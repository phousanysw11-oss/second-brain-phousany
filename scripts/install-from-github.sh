#!/bin/bash
# macOS system Bash 3.2 compatible. Native macOS execution has not been verified.
set -euo pipefail
destination=${1:-"$PWD"}
archive=${2:-}
expected='07f4a6388f1c32807171430a4be5d5557d4db12e71f1ebfc1e55f5303715041c'
url='https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/codex/ceo-team-workshops/MY_SECOND_BRAIN.zip'
fail() { printf 'INSTALL STOPPED: %s\n' "$*" >&2; exit 1; }
for command in unzip find cmp mkdir cat awk; do command -v "$command" >/dev/null || fail "Missing $command"; done
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
[ "$(digest "$archive")" = "$expected" ] || fail 'Package checksum mismatch; nothing installed. Fetch the matching branch installer again.'
# The release builder validates archive paths; the exact reviewed ZIP is pinned above.
unzip -q "$archive" -d "$scratch/package"
source_dir="$scratch/package"
if command -v python3 >/dev/null 2>&1; then
    # Full upgrade path, shared with Windows/Python tests. No runtime is installed.
    python3 "$source_dir/install.py" "$archive" "$destination"
    exit $?
fi
# No-runtime compatibility fallback: clean install or exact-version reinstall only.
# It never declares a cross-version upgrade successful or replaces a differing file.
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
manifest_sha=$(digest "$source_dir/MANIFEST.json")
if [ -e "$receipt" ]; then
    grep -Eq '"manifest_sha256"[[:space:]]*:[[:space:]]*"'"$manifest_sha"'"' "$receipt" || fail 'This upgrade needs Python 3 already available to the AI. Nothing changed; use an available Python runtime or a new empty folder.'
    # Only personal scaffold may differ in the fallback; modified shipped code needs review.
    conflicts=0
    while IFS= read -r -d '' file; do
        relative=${file#"$source_dir/"}; target="$destination/$relative"
        assert_plain "$target"
        [ -f "$target" ] || fail "Existing installation needs repair using Python 3: $relative"
        case "$relative" in context/*|data/*|work/*|notes/*|inbox/*|projects/*|brainstorms/*|decisions/*|llm-wiki/raw/*|llm-wiki/wiki/*|aios-intake.md|connections.md|references/voice.md|app/config.json|apps/3d-brain/brain.config.json) continue;; esac
        if ! cmp -s "$file" "$target"; then printf 'REVIEW: modified shipped file %s\n' "$relative"; conflicts=1; fi
    done < <(find "$source_dir" -type f -print0)
    if [ "$conflicts" -ne 0 ]; then printf 'NEEDS REVIEW: files preserved. Use Python 3 for staged incoming copies.\n'; exit 2; fi
    printf 'ALREADY INSTALLED: %s\nSaved answers and personal files preserved.\n' "$destination"
    exit 0
fi
while IFS= read -r -d '' file; do
    relative=${file#"$source_dir/"}; target="$destination/$relative"
    assert_plain "$target"
    parent=${target%/*}
    while [ "$parent" != '/' ] && [ "$parent" != '.' ]; do
        if [ -e "$parent" ] && [ ! -d "$parent" ]; then fail "Parent is not a folder: $parent"; fi
        parent=${parent%/*}; [ -n "$parent" ] || parent=/
    done
    if [ -e "$target" ]; then
        [ -f "$target" ] && cmp -s "$file" "$target" || fail "Existing file differs; nothing changed: $relative. Use Python 3 for a recoverable merge."
    fi
done < <(find "$source_dir" -type f -print0)
while IFS= read -r -d '' file; do
    relative=${file#"$source_dir/"}; target="$destination/$relative"
    assert_plain "$target"; mkdir -p "${target%/*}"
    if [ ! -e "$target" ]; then (set -C; cat "$file" > "$target"); fi
    cmp -s "$file" "$target" || fail "Read-back failed: $relative"
done < <(find "$source_dir" -type f -print0)
(set -C; printf '{"package":"MY_SECOND_BRAIN","version":"4.0.0-ceo-preview","manifest_sha256":"%s","status":"installed"}\n' "$manifest_sha" > "$receipt")
printf 'INSTALLED AND VERIFIED: %s\nNext: read the local onboard skill and ask one question at a time.\n' "$destination"
