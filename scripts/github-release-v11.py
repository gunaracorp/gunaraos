#!/usr/bin/env python3
"""Terbitkan GitHub Release dari isi CHANGELOG.md — tanpa kredensial di kode (SECURITY.md).

Pemakaian: GITHUB_TOKEN=<token> python3 scripts/github-release-v11.py [tag]
Body diambil dari heading CHANGELOG "## [<tag tanpa v>]" sampai heading berikutnya.
"""
import json, os, re, sys, subprocess

TOKEN = os.environ.get("GITHUB_TOKEN", "")
if not TOKEN:
    sys.exit("Set env GITHUB_TOKEN dulu — kredensial tidak boleh ditulis di kode (SECURITY.md §1).")
REPO = "gunaracorp/gunaraos"
TAG = sys.argv[1] if len(sys.argv) > 1 else "v11.0.0"
VER = TAG.lstrip("v")

changelog = open("CHANGELOG.md", encoding="utf-8").read()
m = re.search(rf"## \[{VER}\][^\n]*\n(.*?)(?=\n## \[)", changelog, re.S)
if not m:
    sys.exit(f"Seksi CHANGELOG {VER} tidak ditemukan")

payload = {
    "tag_name": TAG,
    "name": f"GUNARA OS {TAG}",
    "body": m.group(1).strip(),
    "draft": False,
    "prerelease": False,
}

out = subprocess.run(
    ["curl", "-s", "-w", "\n%{http_code}", "-X", "POST",
     "-H", f"Authorization: Bearer {TOKEN}",
     "-H", "Accept: application/vnd.github+json",
     f"https://api.github.com/repos/{REPO}/releases",
     "-d", json.dumps(payload)],
    capture_output=True, text=True).stdout
body_out, _, code = out.rpartition("\n")
print("HTTP", code)
data = json.loads(body_out or "{}")
if code == "201":
    print("RELEASE_URL:", data.get("html_url"))
elif code == "422":
    print("Sudah ada — cek:", data.get("errors") or data.get("message"))
else:
    print("Gagal:", data.get("message", body_out[:200]))
