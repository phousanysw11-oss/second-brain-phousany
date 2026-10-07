---
name: ceo-meeting-followup
description: "Extract decisions, owners and open actions from supplied meeting notes without turning suggestions into commitments."
---

# Meeting follow-up

Read [the shared local runtime contract](../bni-second-brain/references/codex-runtime.md) before work.
Reuse `data/state.json` and the selected company's accessible files; save outputs under `work/ceo/`.

Read actual notes/transcript with speaker/date locators. Separate confirmed decisions, explicit accepted commitments,
proposals, unanswered questions and conflicts. Do not infer a person's acceptance from their name near an action.
For each action capture deliverable, owner if confirmed, due date if stated, dependency, next step and source.
Preserve uncertainty in relative dates; resolve only from the known meeting date/timezone.
Return a concise recap and ready-to-review action list. Save artifacts and, when requested, register tasks in authoritative state.
No calendar invitation or message is implied. Quote only necessary snippets; unnecessary personal data stays out of the summary.
