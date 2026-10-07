# Embedded Desk extraction

The single Project source BNI_SECOND_BRAIN.md also contains the exact interactive Desk HTML.
Use a file/code tool to read the raw uploaded file bytes, select the bytes between the two
markers, verify SHA-256, and return CEO_DESK.html as a downloadable file. Do not regenerate
the app or paste its source into the learner response. The native/local skill uses
assets/CEO_DESK.html directly. Both routes use the same original asset.

```python
from pathlib import Path
import hashlib
raw = Path(ACTUAL_UPLOADED_PACK_PATH).read_bytes()
start = b"\n<!-- BNI_DESK_ASSET_BEGIN -->\n"
end = b"\n<!-- BNI_DESK_ASSET_END -->\n"
assert raw.count(start) == raw.count(end) == 1
html = raw.split(start, 1)[1].split(end, 1)[0]
assert hashlib.sha256(html).hexdigest() == "a04f9c80cf720f26caec3372e29e2483f5afd25f5438f137a5c684a5d051c0ad"
Path(ACTUAL_OUTPUT_DIRECTORY, "CEO_DESK.html").write_bytes(html)
```

Never claim a download was created unless the file exists and is returned by a supported
tool. If raw file access/file generation is unavailable, disclose that specific limitation
and offer the original Desk download from the course folder. A chat-only task table is a
partial fallback, not a completed interactive CEO Desk.
