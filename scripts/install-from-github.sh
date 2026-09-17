#!/bin/bash
# macOS/Linux installer, compatible with the macOS system Bash 3.2.
set -euo pipefail
destination=${1:-"$PWD"}
archive=${2:-}
expected='30b00c7da5a40ef93a402d3fbf87068dc47b116e8d969cecc80ac486e175f9b8'
manifest_sha='842864b84e348b8342829182d5388450f8ba40f5be944dcbc760bc4c36bade76'
url='https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/main/MY_SECOND_BRAIN.zip'
fail() { printf 'INSTALL STOPPED: %s\n' "$*" >&2; exit 1; }
for command in unzip find cmp mkdir cat; do command -v "$command" >/dev/null || fail "Missing $command"; done
digest() {
    if command -v shasum >/dev/null; then shasum -a 256 "$1" | awk '{print $1}';
    elif command -v sha256sum >/dev/null; then sha256sum "$1" | awk '{print $1}';
    else fail 'No SHA-256 tool found'; fi
}
scratch=$(mktemp -d "${TMPDIR:-/tmp}/second-brain.XXXXXXXX")
cleanup() {
    case "$scratch" in "${TMPDIR:-/tmp}"/second-brain.????????) rm -rf -- "$scratch";; *) printf 'Temporary folder retained: %s\n' "$scratch";; esac
}
trap cleanup EXIT
if [ -z "$archive" ]; then
    command -v curl >/dev/null || fail 'curl is needed to download the package'
    archive="$scratch/MY_SECOND_BRAIN.zip"
    curl --fail --location --silent --show-error "$url" --output "$archive"
fi
[ "$(digest "$archive")" = "$expected" ] || fail 'Package checksum mismatch; nothing installed. Fetch the matching installer again.'
# This known archive is path-validated at release build time. The exact SHA above
# is checked before extraction; no unverified archive may reach unzip.
unzip -q "$archive" -d "$scratch/package"
source_dir="$scratch/package"
assert_plain() {
    local cursor="$1"
    while [ "$cursor" != '/' ] && [ "$cursor" != '.' ]; do
        [ ! -L "$cursor" ] || fail "Linked destination: $cursor"
        cursor=${cursor%/*}; [ -n "$cursor" ] || cursor=/
    done
}
case "$destination" in /*) ;; *) destination="$PWD/$destination";; esac
case "/$destination/" in */../*|*/./*) fail 'Use an absolute destination without dot segments';; esac
assert_plain "$destination"
if [ -e "$destination" ] && [ ! -d "$destination" ]; then fail 'Destination must be a folder'; fi
receipt="$destination/.second-brain-install.json"
assert_plain "$receipt"
if [ -e "$receipt" ]; then
    grep -Eq '"manifest_sha256"[[:space:]]*:[[:space:]]*"'"$manifest_sha"'"' "$receipt" || fail 'Different installed version; use a new folder or reviewed migration'
    while IFS= read -r -d '' file; do
        relative=${file#"$source_dir/"}
        assert_plain "$destination/$relative"
        [ -f "$destination/$relative" ] || fail "Existing installation needs repair: $relative"
    done < <(find "$source_dir" -type f -print0)
    printf 'ALREADY INSTALLED: %s\nSaved answers and personal files preserved.\n' "$destination"
    exit 0
fi
# Preflight every collision before writing any project file, including dotfolders.
while IFS= read -r -d '' file; do
    relative=${file#"$source_dir/"}; target="$destination/$relative"
    assert_plain "$target"
    parent=${target%/*}
    while [ "$parent" != '/' ] && [ "$parent" != '.' ]; do
        if [ -e "$parent" ] && [ ! -d "$parent" ]; then fail "Parent is not a folder: $parent"; fi
        parent=${parent%/*}; [ -n "$parent" ] || parent=/
    done
    if [ -e "$target" ]; then
        [ -f "$target" ] && cmp -s "$file" "$target" || fail "Existing file differs; nothing changed: $relative"
    fi
done < <(find "$source_dir" -type f -print0)
while IFS= read -r -d '' file; do
    relative=${file#"$source_dir/"}; target="$destination/$relative"
    assert_plain "$target"
    mkdir -p "${target%/*}"
    if [ ! -e "$target" ]; then (set -C; cat "$file" > "$target"); fi
    cmp -s "$file" "$target" || fail "Read-back failed: $relative"
done < <(find "$source_dir" -type f -print0)
(set -C; printf '{"package":"MY_SECOND_BRAIN","version":"3.0.1","manifest_sha256":"%s","status":"installed"}\n' "$manifest_sha" > "$receipt")
printf 'INSTALLED AND VERIFIED: %s\nNext: ask your AI to read the local onboard SKILL.md and start one question at a time.\n' "$destination"
