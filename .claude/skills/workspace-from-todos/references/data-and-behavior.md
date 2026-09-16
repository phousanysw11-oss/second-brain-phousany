# Data and behavior contract

The browser key is `work-second-brain.v1`. Each origin (including hostname and port) has its own storage; changing the port or hosting URL does not transfer records. Export/import to transfer them. No server synchronization is included.

Backup JSON shape:

```json
{
  "version": 1,
  "settings": {"language": "th", "theme": "light"},
  "tasks": [{
    "id": "task-example-1",
    "title": "Draft a workshop outline",
    "project": "Sample project",
    "owner": "",
    "nextAction": "",
    "date": "",
    "priority": "",
    "status": "todo",
    "note": "",
    "sourceText": "Draft a workshop outline",
    "createdAt": "2026-09-16T01:00:00.000Z",
    "updatedAt": "2026-09-16T01:00:00.000Z"
  }],
  "notes": [],
  "focusIds": []
}
```

This example is synthetic. Generate current timestamps when producing a real import; dates are not due dates unless supplied. IDs must be unique strings and notes use `{id,title,body,taskId,createdAt,updatedAt}`. Unlinked notes have an empty `taskId`.

- Dates: valid Gregorian `YYYY-MM-DD`, or `""` for unknown. Display localized dates without changing the stored value.
- Priority: `high`, `medium`, `low` or `""` (unset).
- Status: `todo`, `doing`, `waiting`, `done`.
- Language: `th` or `en`. Theme: `light` or `dark`.
- Missing owner, next action or project: empty string, not an invented person or commitment.
- Source text: preserve the raw task line even when the title is tidied.
- Import validates structure before mutation and previews conflicts. Same IDs represent the same records. Preserve existing edits on conflict unless the student explicitly chooses replacement; never silently reset the workspace. Plain-list imports create new IDs and do not delete existing tasks.
- Focus IDs refer to existing tasks with status `todo` or `doing`, at most three. Waiting and done tasks cannot be focus. A date is independent of focus.
- Backup merge preserves current language/theme settings, as stated in the preview; importing a backup does not unexpectedly change the interface language.
- Render all task/note fields as text; never execute HTML, script or links from imported content.
- Reject invalid dates, unsupported enum values, duplicate IDs and oversized input with a clear bilingual message. A failed save/import must leave recoverable data intact.

The template's pure helper `window.WorkspaceApp.validateBackup` is the implementation authority for accepted input. Inspect its validation limits before generating large lists. Run an actual import, export and fresh-browser restore to verify data, not just a schema check.
