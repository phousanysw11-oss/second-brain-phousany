---
name: ceo-ai-employee
description: "Build a narrow AI employee from approved company policy and test normal, missing-input and exception behavior."
---

# AI Employee

Read [the shared local runtime contract](../bni-second-brain/references/codex-runtime.md) before work.
Reuse `data/state.json` and the selected company's accessible files; save outputs under `work/ceo/`.

Read [WS5 method](../bni-second-brain/references/workshop-5.md) and [original checks](../bni-second-brain/references/workshop-5-acceptance.md).
Reuse the repeated question and verified approved policy/version, effective date, approver and escalation role.
Dispatch AI Employee Builder to write the actual English instruction with "Answer in the user's language":
allowed policy IDs, required inputs, method, cited-answer format, missing/conflicting-rule behavior and no exception authority.
No approved policy means an intake/escalation assistant, explicitly lacking answer automation.
Keep CEO private sources outside staff-facing context. Save AI_Employee_Instruction and three starter questions.
Independently dispatch Evidence Reviewer with the instruction/policy to generate ACTUAL answers for normal, missing input,
and prohibited exception/private-information cases. Include a threshold boundary; record input/reply/expected/policy/pass-fail.
Repair errors, rerun affected cases, save/register AI_EMPLOYEE. Tests are bounded; no staff deployment or sharing is implied.
