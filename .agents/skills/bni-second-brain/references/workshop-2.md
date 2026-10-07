# WS2 Interactive CEO Desk

## Goal
Produce the learner's original interactive CEO Desk through the bundled local adapter.
The source assets/CEO_DESK.html stays byte-for-byte unchanged; the served adapter connects
its existing interface to authoritative data/state.json. Reuse WS1 evidence and profile.
Run node scripts/ceo.mjs desk and use its returned URL. Do not regenerate or publish the app.

## Execute internally

1. Ask only missing setup items, at most five short questions; accept a batch answer:
   business/role; three priorities; actual tasks with owner/due/status; working hours,
   timezone and Calendar range/route; preferred daily view. Reuse known answers. Derive
   a stable lowercase workspace_id from the business only if unambiguous; show it in the
   import preview. Unknown owners/dates remain blank. Any suggested task is proposed.
2. Check actual Google Calendar tool availability only if that route was selected.
   Reuse/ask date range and timezone; Asia/Vientiane may be proposed, not silently assumed
   for foreign events. Read one day first, only title/start/end/ID. Show the actual tool,
   range and retrieval timestamp, and ask the learner to compare one event. No descriptions,
   attendees, event writes or invites. After confirmation read up to seven days if needed.
   If inaccessible, diagnose once then use redacted screenshot/export/typed schedule or
   unavailable. Access failure never means zero events. No secrets or extra permissions.
3. Build minimal profile, priorities, tasks, Calendar evidence and workshop result links.
   Calendar is an imported snapshot. A successful read in ChatGPT does not make the HTML
   continuously connected, automatic, or authorized to write. State this before delivery.
4. Validate all JSON types/dates/unique IDs and business scope against the contract below.
   On refresh return a Calendar-only envelope to preserve local tasks. Read browser edits from the verified local state API. A standalone exported copy still
   requires its backup before importing changes. Never merge workspaces.
5. Serve the packaged original asset through the local adapter, not from a reconstructed design.
   Return downloadable desk-data.json and unchanged HTML when supported. If file tools or
   full asset access are unavailable, state the gap, provide JSON and a manual chat Desk
   as PARTIAL, with interactive delivery/tests pending. Never claim it is the interactive
   result. Open the returned localhost URL when a browser tool is available. Retain Import data,
   Preview import, business/event/task checks and Apply import for manual imports.
6. Ask the learner to add/edit/complete one task, reload, download backup and import it
   back. Do not claim opening, persistence or restoration passed without actual evidence.
   Write WS2_Checked_Output with source/check states and the next manual refresh.

## Data contract v1

UTF-8 JSON object, not executable JavaScript. No credentials, contact details or private
event descriptions. Strings are rendered as text. Empty owner/due means unknown.

```json
{
  "schema_version": 1,
  "workspace_id": "my-business",
  "fictional": false,
  "profile": {"business": "[business]", "role": "CEO", "timezone": "Asia/Vientiane", "working_hours": "[hours]", "daily_view": "Today"},
  "priorities": ["[priority 1]", "[priority 2]", "[priority 3]"],
  "tasks": [{"id": "TASK-001", "title": "[real task]", "owner": "", "due": "", "status": "todo", "source_ids": ["[source]"], "review_status": "draft"}],
  "calendar": {"mode": "unavailable", "source": "not in the data", "retrieved_at": "", "range_start": "", "range_end": "", "events": []},
  "results": [{"workshop": "WS1", "title": "Business X-Ray", "status": "draft", "source": "[observed result identifier]"}]
}
```

- workspace_id: 1–64 lowercase letters/digits/hyphens/underscores, stable per business.
- schema_version = 1. Full import requires profile, priorities, tasks, calendar, results,
  fictional. Real data has fictional=false; explicit separate demo has fictional=true.
- profile.timezone is a valid IANA timezone. Priorities at most three.
- tasks at most 50; unique nonempty id/title; status todo/doing/waiting/done; due empty or
  valid YYYY-MM-DD; review_status draft/checked/proposed. An owner is not acceptance.
- calendar.mode connector-read/snapshot/demo/unavailable. connector-read requires an
  observed successful ChatGPT tool read. source identifies tool/file. retrieved_at is
  actual ISO datetime with offset for tool reads; otherwise supplied freshness or empty.
  range_start/end empty or YYYY-MM-DD. No successful tool read means never connector-read.
- events at most 100; unique id, title, start, end, source_id, timezone. Timed events use
  ISO datetimes with offsets. All-day events use dates plus all_day=true and exclusive end.
  end must be later than start. Preserve valid overlaps rather than silently removing them.
- results at most 10; workshop WS1–WS5, title/status/source. A source name is plain text,
  not a claim of a working URL or persistent Project source.
- Calendar-only refresh = schema_version, workspace_id, calendar. It replaces only the
  snapshot after preview/Apply; it must not overwrite tasks/profile.
- Full restore replaces data only after explicit Apply import. Export a backup before
  restoring over real work. Storage errors remain visible; never claim saved on failure.

## Handoff and checks
WS2_Checked_Output, at most 250 words: priorities, selected WS1 action, tasks/owners/dates,
Calendar route/range/source/retrieval time, actual checks and unresolved limits, backup
filename if observed, next manual refresh. Draft/PARTIAL until human checks support more.

Check business plus three facts; one event/time and freshness; task add/edit/done/reload
and backup/restore. Wrong workspace, malformed dates or duplicate IDs must be rejected
before mutation. Preserve tasks on a Calendar-only update. Browser behavior is a real
user check, never simulated acceptance from JSON generation.

Minimum by minute 30: three priorities, one real task and an honest Calendar state.
Stretch after Desk/backup checks: optional weekly time audit against three goals. Use
five to seven buckets, percentage denominator defined, missing time and overlaps visible,
Stop / Delegate / Give-to-AI proposals and one task, with no promised hours saved.
End with "เริ่ม WS3". "อัปเดต Calendar" reuses this workflow and stable workspace ID.
