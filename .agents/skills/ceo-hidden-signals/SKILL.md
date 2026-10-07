---
name: ceo-hidden-signals
description: "Find recurring customer problems from deidentified messages with counts, quotes and one bounded test."
---

# Hidden Signals

Read [the shared local runtime contract](../bni-second-brain/references/codex-runtime.md) before work.
Reuse `data/state.json` and the selected company's accessible files; save outputs under `work/ceo/`.

Read [WS3 method](../bni-second-brain/references/workshop-3.md) and [original checks](../bni-second-brain/references/workshop-3-acceptance.md).
Dispatch Customer Analyst with supplied messages and dates. Count included unique messages, not sentences or inferred people.
Assign one primary theme per message; preserve praise, off-topic and excluded categories. Report n/N and exact quote IDs.
Keep refund/loss, mentioned order value and unknown money separate. Without order IDs, sums are message-mentioned amounts only.
Do not infer representativeness, complaint rate or sales causality from a bounded sample.
Deliver original WS3_Checked_Output: up to five supported themes, literal quotes, source/count reconciliation, and one
proposed one-week fix with baseline, metric, threshold, cap and stop. Save/register WS3.
Only collect fresh public evidence when asked and actually authorized; local exports need no connector.
Source inspiration: Corey Haines customer-research, pinned in docs/CEO_SOURCES.json; no whole upstream toolchain required.
