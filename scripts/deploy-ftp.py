#!/usr/bin/env python3
"""Deploy dist/ via tmp upload + rename (Turhost FTP workaround)."""
import ftplib
import os
import sys
import time
import urllib.request
from pathlib import Path

HOST = os.environ.get("FTP_HOST", "94.199.205.197")
USER = os.environ.get("FTP_USER", "medident")
PASS = os.environ.get("FTP_PASSWORD", "")
REMOTE = "public_html"
DIST = Path(__file__).resolve().parents[1] / "dist"
TMP_NAME = "_md"


def conn():
    ftp = ftplib.FTP_TLS()
    ftp.connect(HOST, 21, timeout=90)
    ftp.login(USER, PASS)
    ftp.prot_c()
    ftp.set_pasv(True)
    return ftp


def with_retry(fn, label, retries=5):
    last = None
    for i in range(1, retries + 1):
        ftp = None
        try:
            ftp = conn()
            result = fn(ftp)
            ftp.quit()
            return result
        except Exception as exc:
            last = exc
            print(f"  retry {i}/{retries} {label}: {exc}")
            time.sleep(min(i * 2, 10))
            if ftp:
                try:
                    ftp.quit()
                except Exception:
                    pass
    raise last


def ensure_dirs(ftp, rel_path: str):
    parts = Path(rel_path).parent.as_posix().split("/")
    if parts == ["."]:
        return
    cur = REMOTE
    for part in parts:
        if not part:
            continue
        cur = f"{cur}/{part}"
        try:
            ftp.mkd(cur)
        except ftplib.error_perm:
            pass


def deploy_file(rel: str):
    local = DIST / rel
    remote = f"{REMOTE}/{rel}"

    def op(ftp):
        ensure_dirs(ftp, rel)
        with local.open("rb") as fh:
            ftp.cwd("tmp")
            ftp.storbinary(f"STOR {TMP_NAME}", fh, blocksize=8192)
        ftp.cwd("/")
        try:
            ftp.delete(remote)
        except ftplib.error_perm:
            pass
        ftp.rename(f"tmp/{TMP_NAME}", remote)

    with_retry(op, rel)


def main():
    if not PASS:
        print("FTP_PASSWORD required", file=sys.stderr)
        return 1
    files = sorted(p.relative_to(DIST).as_posix() for p in DIST.rglob("*") if p.is_file())
    print(f"Deploying {len(files)} files...")
    for i, rel in enumerate(files, 1):
        print(f"[{i}/{len(files)}] {rel}")
        deploy_file(rel)
    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
