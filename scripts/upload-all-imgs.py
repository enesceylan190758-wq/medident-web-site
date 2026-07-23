#!/usr/bin/env python3
"""Upload all dist/assets/img files via tmp + rename (Turhost-safe)."""
from __future__ import annotations

import ftplib
import subprocess
import sys
import time
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
        for part in d.split("/"):
            cur = f"{cur}/{part}" if cur else part
            try:
                ftp.mkd(cur)
            except Exception:
                pass
    ftp.quit()


def upload(rel: str, retries: int = 40) -> bool:
    local = DIST / rel
    if not local.is_file():
        print(f"  SKIP missing local {rel}", flush=True)
        return False
    size = local.stat().st_size
    tmp = "_up_" + rel.replace("/", "_")
    dest = "public_html/" + rel
    timeout = max(60, min(240, 40 + size // 40000))
    for i in range(1, retries + 1):
        p = subprocess.run(
            [
                "curl",
                "-k",
                "--ftp-ssl-control",
                "--ftp-pasv",
                "--connect-timeout",
                "25",
                "--max-time",
                str(timeout),
                "-u",
                f"{USER}:{PW}",
                "--upload-file",
                str(local),
                f"ftp://{HOST}/tmp/{tmp}",
                "-w",
                "%{http_code}:%{size_upload}",
                "-o",
                "/dev/null",
                "-s",
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
                remote_size = ftp.size(dest)
                ftp.quit()
                if remote_size == size:
                    print(f"  OK {rel} size={remote_size}", flush=True)
                    return True
                print(f"  size mismatch remote={remote_size} local={size}", flush=True)
        except Exception as e:
            print(f"  err {e}", flush=True)
        time.sleep(1 + (i % 5))
    return False


def main() -> int:
    priority_path = Path("/tmp/missing-homepage.txt")
    priority = []
    if priority_path.exists():
        priority = [x.strip() for x in priority_path.read_text().splitlines() if x.strip()]
    # always include logos
    for logo in (
        "assets/img/logo.png",
        "assets/img/logo-white.png",
        "assets/img/logo-mark.png",
        "assets/img/favicon-32.png",
        "assets/img/favicon-180.png",
        "assets/img/favicon-192.png",
    ):
        if logo not in priority:
            priority.insert(0, logo)

    all_imgs = sorted(
        p.relative_to(DIST).as_posix()
        for p in (DIST / "assets/img").rglob("*")
        if p.is_file()
    )
    ordered = []
    for f in priority + all_imgs:
        if f in all_imgs and f not in ordered:
            ordered.append(f)

    if len(sys.argv) > 1:
        ordered = [a for a in sys.argv[1:] if (DIST / a).is_file()]

    ensure_dirs(
        [
            "public_html/assets",
            "public_html/assets/img",
            "public_html/assets/img/blog",
            "public_html/assets/img/brand",
            "tmp",
        ]
    )

    print(f"Uploading {len(ordered)} images…", flush=True)
    ok = fail = 0
    failed = []
    for i, rel in enumerate(ordered, 1):
        print(f"[{i}/{len(ordered)}] {rel}", flush=True)
        if upload(rel):
            ok += 1
        else:
            fail += 1
            failed.append(rel)
            print(f"  FAIL {rel}", flush=True)

    Path("/tmp/img-upload-failed.txt").write_text("\n".join(failed) + "\n")
    print(f"DONE ok={ok} fail={fail}", flush=True)
    return 0 if fail == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
