#!/usr/bin/env python3
"""Upload non-image dist files to Turhost via tmp+rename (HTML/CSS/JS/sitemap first)."""
from __future__ import annotations

import ftplib
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

DIST = Path("/workspace/dist")
HOST, USER, PW = "ftp.medidentistanbul.com", "medident", "kAx#5YC#8u1Jn4"


def ensure_dirs(dirs: list[str]) -> None:
    ftp = ftplib.FTP_TLS()
    ftp.connect(HOST, 21, timeout=60)
    ftp.login(USER, PW)
    ftp.prot_p()
    ftp.set_pasv(True)
    for d in dirs:
        cur = ""
        for part in d.strip("/").split("/"):
            cur = f"{cur}/{part}" if cur else part
            try:
                ftp.mkd(cur)
            except Exception:
                pass
    ftp.quit()


def upload(rel: str, retries: int = 25) -> bool:
    local = DIST / rel
    if not local.is_file():
        return False
    size = local.stat().st_size
    tmp = "_p_" + rel.replace("/", "_").replace(".", "_")
    dest = "public_html/" + rel
    timeout = max(60, min(180, 40 + size // 40000))
    for i in range(1, retries + 1):
        p = subprocess.run(
            [
                "curl", "-k", "--ftp-ssl-control", "--ftp-pasv",
                "--connect-timeout", "20", "--max-time", str(timeout),
                "-u", f"{USER}:{PW}",
                "--upload-file", str(local),
                f"ftp://{HOST}/tmp/{tmp}",
                "-w", "%{http_code}:%{size_upload}",
                "-o", "/dev/null", "-s",
            ],
            capture_output=True,
            text=True,
        )
        out = (p.stdout or "").strip()
        print(f"  try{i} {rel} ({size}b) -> {out}", flush=True)
        try:
            code, up = out.split(":")
            if p.returncode == 0 and up.isdigit() and int(up) == size:
                ftp = ftplib.FTP_TLS()
                ftp.connect(HOST, 21, timeout=60)
                ftp.login(USER, PW)
                ftp.prot_p()
                ftp.set_pasv(True)
                parent = "/".join(dest.split("/")[:-1])
                cur = ""
                for part in parent.split("/"):
                    cur = f"{cur}/{part}" if cur else part
                    try:
                        ftp.mkd(cur)
                    except Exception:
                        pass
                try:
                    ftp.delete(dest)
                except Exception:
                    pass
                ftp.rename(f"tmp/{tmp}", dest)
                rsz = ftp.size(dest)
                ftp.quit()
                if rsz == size:
                    print(f"  OK {rel}", flush=True)
                    return True
                print(f"  size mismatch {rsz}", flush=True)
        except Exception as e:
            print(f"  err {e}", flush=True)
        time.sleep(1 + (i % 4))
    return False


def live_ok(rel: str, min_size: int = 200) -> bool:
    url = "https://medidentistanbul.com/" + rel.replace("index.html", "")
    if rel.endswith("index.html") and rel != "index.html":
        url = "https://medidentistanbul.com/" + rel[: -len("index.html")]
    elif rel == "index.html":
        url = "https://medidentistanbul.com/"
    else:
        url = "https://medidentistanbul.com/" + rel
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=25) as r:
            body = r.read()
            return r.status == 200 and len(body) >= min_size
    except Exception:
        return False


def main() -> int:
    files = sorted(
        p.relative_to(DIST).as_posix()
        for p in DIST.rglob("*")
        if p.is_file() and not str(p.relative_to(DIST)).startswith("assets/img/")
    )
    # Priority order
    priority = [
        ".htaccess",
        "index.html",
        "sitemap.xml",
        "robots.txt",
        "llms.txt",
        "404.html",
        "CNAME",
        "assets/css/site.css",
        "assets/js/site.js",
        "hizmetler/index.html",
        "doktorlar/index.html",
        "blog/index.html",
        "geo/index.html",
        "hakkimizda/index.html",
        "iletisim/index.html",
        "yorumlar/index.html",
        "galeri/index.html",
        "sss/index.html",
        "en/index.html",
        "de/index.html",
    ]
    ordered = []
    for f in priority:
        if f in files and f not in ordered:
            ordered.append(f)
    # then all other html
    for f in files:
        if f.endswith(".html") and f not in ordered:
            ordered.append(f)
    for f in files:
        if f not in ordered:
            ordered.append(f)

    argv_files = [a for a in sys.argv[1:] if not a.startswith("-") and (DIST / a).is_file()]
    if argv_files:
        ordered = argv_files

    # Skip already-good pages unless --force or explicit file list (explicit = always upload)
    force = "--force" in sys.argv or bool(argv_files)
    todo = []
    for rel in ordered:
        local_size = (DIST / rel).stat().st_size
        if not force and rel.endswith((".html", ".xml", ".txt", ".css", ".js")):
            if live_ok(rel, min_size=min(500, max(100, local_size // 3))):
                print(f"SKIP live-ok {rel}", flush=True)
                continue
        todo.append(rel)

    dirs = sorted(
        {
            "tmp",
            "public_html",
            *{
                "public_html/" + "/".join(rel.split("/")[:-1])
                for rel in todo
                if "/" in rel
            },
        }
    )
    ensure_dirs(dirs)

    print(f"Uploading {len(todo)} / {len(ordered)} files…", flush=True)
    ok = fail = 0
    failed = []
    for i, rel in enumerate(todo, 1):
        print(f"[{i}/{len(todo)}] {rel}", flush=True)
        if upload(rel):
            ok += 1
        else:
            fail += 1
            failed.append(rel)
            print(f"  FAIL {rel}", flush=True)

    Path("/tmp/pages-upload-failed.txt").write_text("\n".join(failed) + "\n")
    print(f"DONE ok={ok} fail={fail}", flush=True)
    return 0 if fail == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
