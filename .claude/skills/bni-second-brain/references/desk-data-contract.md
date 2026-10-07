# Desk data contract v1

Full file: JSON object, not executable JavaScript. UTF-8. No credentials, personal contact details or private event descriptions. Strings are rendered as text. Unknown dates and owners use an empty string; never invent them.

```json
{
  "schema_version": 1,
  "workspace_id": "my-business",
  "fictional": false,
  "profile": {"business": "[business]", "role": "CEO", "timezone": "Asia/Vientiane", "working_hours": "[hours]", "daily_view": "Today"},
  "priorities": ["[priority 1]", "[priority 2]", "[priority 3]"],
  "tasks": [{"id": "TASK-001", "title": "[real task]", "owner": "", "due": "", "status": "todo", "source_ids": ["[source]"], "review_status": "draft"}],
  "calendar": {"mode": "unavailable", "source": "not in the data", "retrieved_at": "", "range_start": "", "range_end": "", "events": []},
  "results": [{"workshop": "WS1", "title": "Business X-Ray", "status": "draft", "source": "[Project source name]"}]
}
```

- workspace_id: 1–64 lowercase letters, digits, hyphens or underscores. Stable across refreshes; distinct per business.
- schema_version must equal 1. Full import requires profile, priorities, tasks, calendar, results and fictional.
- profile timezone must be a valid IANA timezone. At most three priorities.
- tasks: max 50, unique nonempty id, nonempty title. status in todo/doing/waiting/done. due empty or valid YYYY-MM-DD. review_status draft/checked/proposed. owner is descriptive, not evidence of accepted delegation.
- calendar.mode: connector-read/snapshot/demo/unavailable. connector-read means a successful read in ChatGPT, not direct browser sync. source must identify the connector or file. retrieved_at is an ISO datetime with offset for connector-read, otherwise supplied source freshness or empty. range_start/end empty or YYYY-MM-DD.
- events: max 100, unique id, title, start and end. For timed events use ISO datetimes with offsets. All-day events use dates, all_day true, and an exclusive end date. source_id and timezone are required. end must be later than start. Overlaps are valid and must not be silently removed.
- results: max 10, workshop WS1–WS5, title/status/source. Store source names as text, not pretend working URLs.
- Calendar-only refresh: schema_version, workspace_id, calendar. It replaces only the Calendar snapshot after user review; it cannot overwrite tasks or the business profile.
- Full restore replaces the current workspace data only after explicit Apply import. Export a backup first if it contains real work. On storage failure, show an error and allow backup; never claim saved.

Acceptance: validate all types/dates/IDs before state mutation; compare a known Calendar event to its source; test empty events, bad dates, another workspace, duplicate IDs, and task preservation on Calendar-only import.
