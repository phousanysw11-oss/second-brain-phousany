---
name: ceo-desk
description: "Open or update an optional CEO Desk with saved priorities, actionable tasks, checked work and a labelled Calendar snapshot."
---

# CEO Desk

This is an optional daily workspace after onboarding, not one of the four workshops.
Use the learner's existing ChatGPT Plus plan. Pro, a paid API, native agent teams and live
Calendar are not requirements. Read [sharing and runtime choices](../../../docs/DESK_SHARING.md).

Reuse the selected company's profile, priorities and accessible files. Do not copy the kit
author's data or live workspace. Missing owner, date or source stays unknown.

## Local Codex or Claude Code folder
Read [the shared runtime contract](../bni-second-brain/references/codex-runtime.md) and
[the retained Desk method](../bni-second-brain/references/legacy-ceo-desk.md).
The four-workshop routing takes precedence over historical WS2 numbering in that method.
Use `data/state.json` as authority. Run `node scripts/ceo.mjs desk`; open the returned URL.
The original asset is adapted locally: edit next action, completion criterion, evidence,
blocker, project and priority; show saved workshop outputs. Marking done is a user report.
The served Desk supports up to 2000 tasks; standalone original HTML supports up to 50.
Calendar is an optional labelled snapshot, not automatic sync. Calendar-only refresh must
preserve tasks and priorities. A native agent is unnecessary for this workflow.
Check Node >=22; if unavailable, continue file work or the browser option below.

## ChatGPT Plus browser option
Provide the original `assets/CEO_DESK.html` from bni-second-brain as a downloadable file and
prepare a minimal checked JSON import from the learner's own supplied information.
When converting existing native data, use `node scripts/ceo.mjs desk-data-standalone`.
It omits rich fields and optional non-WS result rows; keep the full local backup and explain
that this limited copy is not a complete backup. Oversized data rejects without truncation.
If file creation is unavailable, provide the already-bundled HTML plus a saved JSON/text
handoff and disclose the missing download capability. Do not claim a local skill installation
or folder synchronization from an uploaded Markdown source.
Explain that this HTML saves in that browser only: download a JSON backup before moving
devices, clearing storage or sharing. The next chat needs the learner's latest backup.
Keep one small saved handoff per workshop; reuse it and ask only unanswered questions.

## Acceptance
Read [retained checks](../bni-second-brain/references/legacy-ceo-desk-acceptance.md), applying
the correct storage route. Verify add/edit/reload and backup/restore; local route also reads
`data/state.json` back. Wrong-company restores and invalid data must reject.
Keep evidence, uncertainties and owner choices visible. Do not claim business results from
a completed file or done checkbox. Save `work/ceo/CEO_DESK_Checked_Output.md` with actual
checks and limitations; register optional result ID `CEO_DESK` when the local helper exists.
