---
name: ceo-desk
description: "Open or update the original interactive CEO Desk and its saved priorities, tasks and calendar snapshot."
---

# CEO Desk

Read [the shared local runtime contract](../bni-second-brain/references/codex-runtime.md) before work.
Reuse `data/state.json` and the selected company's accessible files; save outputs under `work/ceo/`.

Read [WS2 method](../bni-second-brain/references/workshop-2.md), [original checks](../bni-second-brain/references/workshop-2-acceptance.md) and local-runtime override.
Reuse saved profile, original three priorities, tasks and result links. Missing owner/date stays empty.
Run `node scripts/ceo.mjs desk`; use the returned local URL and the original packaged asset plus state adapter.
Do not substitute a new design. Calendar connection is optional; a file snapshot is sufficient and labelled.
Validate workspace, unique IDs, date types and period before import; Calendar-only refresh preserves tasks.
Verify one task add/edit/complete/save/reload and backup/restore against `data/state.json`, not only browser display.
Deliver original WS2_Checked_Output with actual behavior checks and limitations. Register WS2.
Node >=22 is required for the interactive Desk; detect absence and disclose exactly what remains blocked.
