#!/usr/bin/env python3
"""Upload router.php + .htaccess; delete empty remote index.html (control channel)."""
from __future__ import annotations

import ftplib
import subprocess
import time
from pathlib import Path

HOST, USER, PW = "ftp.medidentistanbul.com", "medident", "kAx#5YC#8u1Jn4"
DIST = Path("/workspace/dist")


def put(rel: str, retries: int = 30) -> bool:
    local = DIST / rel
    size = local.stat().st_size
    tmp = "_r_" + rel.replace("/", "_").replace(".", "_")
    dest = "public_html/" + rel
    print(f"UPLOAD {rel} ({size}b)", flush=True)
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
        print(f"  try{i} {out} rc={p.returncode}", flush=True)
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
                print(f"  OK remote={rsz}", flush=True)
                return rsz == size
        except Exception as e:
            print(f"  err {e}", flush=True)
        time.sleep(2 + (i % 3))
    return False


def delete_empty_indexes() -> int:
    """Delete remote index.html that are 0 bytes so router can take over."""
    htmls = sorted(p.relative_to(DIST).as_posix() for p in DIST.rglob("index.html"))
    # never delete homepage if it has real content — check size first
    ftp = ftplib.FTP_TLS()
    ftp.connect(HOST, 21, timeout=45)
    ftp.login(USER, PW)
    ftp.prot_p()
    ftp.set_pasv(True)
    deleted = 0
    for rel in htmls:
        if rel == "index.html":
            continue
        remote = "public_html/" + rel
        try:
            sz = ftp.size(remote)
        except Exception:
            continue
        if sz == 0:
            try:
                ftp.delete(remote)
                print(f"DELETED empty {remote}", flush=True)
                deleted += 1
            except Exception as e:
                print(f"del fail {remote}: {e}", flush=True)
    ftp.quit()
    return deleted


def main() -> int:
    ok1 = put("router.php")
    ok2 = put(".htaccess")
    deleted = delete_empty_indexes()
    print(f"DONE router={ok1} htaccess={ok2} deleted_empty={deleted}", flush=True)
    return 0 if ok1 and ok2 else 2


if __name__ == "__main__":
    raise SystemExit(main())
