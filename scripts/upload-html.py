#!/usr/bin/env python3
"""Upload HTML/SEO files via curl tmp + FTP rename."""
from __future__ import annotations

import ftplib
import subprocess
import time
from pathlib import Path

HOST, USER, PW = "ftp.medidentistanbul.com", "medident", "kAx#5YC#8u1Jn4"
DIST = Path("/workspace/dist")
LOG = Path("/tmp/html-upload.log")


def log(msg: str) -> None:
    line = msg + "\n"
    print(msg, flush=True)
    with LOG.open("a") as f:
        f.write(line)


def put(rel: str, retries: int = 40) -> bool:
    local = DIST / rel
    size = local.stat().st_size
    tmp = "_h_" + rel.replace("/", "_").replace(".", "_")
    dest = "public_html/" + rel
    log(f"UPLOAD {rel} ({size}b)")
    for i in range(1, retries + 1):
        p = subprocess.run(
            [
                "curl", "-k", "--ftp-ssl-control", "--ftp-pasv",
                "--connect-timeout", "20", "--max-time", "90",
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
        log(f"  try{i} {out} rc={p.returncode}")
        try:
            code, up = out.split(":")
            if p.returncode == 0 and up.isdigit() and int(up) == size:
                ftp = ftplib.FTP_TLS()
                ftp.connect(HOST, 21, timeout=45)
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
                log(f"  OK remote={rsz}")
                return rsz == size
        except Exception as e:
            log(f"  err {e}")
        time.sleep(2 + (i % 4))
    return False


def main() -> int:
    LOG.write_text("")
    priority = [
        "sitemap.xml",
        "blog/index.html",
        "geo/index.html",
        "hizmetler/index.html",
        "hizmetler/oral-implantoloji/index.html",
        "hizmetler/implantoloji-implant-tedavisi/index.html",
        "hizmetler/estetik-dis-hekimligi/index.html",
        "hizmetler/dis-beyazlatma/index.html",
        "hizmetler/protezler/index.html",
        "hizmetler/seffaf-plaklar-invisalign/index.html",
        "hizmetler/agiz-dis-ve-cene-cerrahisi/index.html",
        "hizmetler/cene-ve-dis-cerrahisi/index.html",
        "hizmetler/cene-eklemi-rahatsizliklari/index.html",
        "hizmetler/periodontoloji-diseti-hastaliklari/index.html",
        "hizmetler/pedodonti-cocuk-dis-hekimligi/index.html",
        "hizmetler/konservatif-dis-tedavileri/index.html",
        "hizmetler/halitosis-agiz-kokusu/index.html",
        "hizmetler/genel-anestezi-ve-sedasyon/index.html",
        "hizmetler/endodonti-kanal-tedavileri/index.html",
        "doktorlar/index.html",
        "doktorlar/dr-faruk-ogutlu/index.html",
        "doktorlar/dr-alperen-demiral/index.html",
        "doktorlar/dt-levent-emir-guneysu/index.html",
        "doktorlar/dr-dt-nilufer-yilmaz-ogutlu/index.html",
        "hakkimizda/index.html",
        "iletisim/index.html",
        "yorumlar/index.html",
        "galeri/index.html",
        "sss/index.html",
        "en/index.html",
        "de/index.html",
        "404.html",
        ".htaccess",
    ]
    all_html = sorted(p.relative_to(DIST).as_posix() for p in DIST.rglob("index.html"))
    files = []
    for f in priority + all_html:
        if f not in files and (DIST / f).is_file():
            files.append(f)

    ok = fail = 0
    failed = []
    for i, rel in enumerate(files, 1):
        log(f"[{i}/{len(files)}]")
        if put(rel):
            ok += 1
        else:
            fail += 1
            failed.append(rel)
            log(f"  FAIL {rel}")
    Path("/tmp/html-failed.txt").write_text("\n".join(failed) + "\n")
    log(f"DONE ok={ok} fail={fail}")
    return 0 if fail == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
