---
name: ceo-hidden-signals
description: "Find recurring customer problems from deidentified messages with counts, quotes and one bounded test."
---

# Hidden Signals

Read [the shared local runtime contract](../bni-second-brain/references/codex-runtime.md) before work.
Reuse `data/state.json` and the selected company's accessible files; save outputs under `work/ceo/`.

Read [optional Hidden Signals method](../bni-second-brain/references/legacy-hidden-signals.md) and [original checks](../bni-second-brain/references/legacy-hidden-signals-acceptance.md).
Dispatch Customer Analyst with supplied messages and dates. Count included unique messages, not sentences or inferred people.
Assign one primary theme per message; preserve praise, off-topic and excluded categories. Report n/N and exact quote IDs.
Keep refund/loss, mentioned order value and unknown money separate. Without order IDs, sums are message-mentioned amounts only.
Do not infer representativeness, complaint rate or sales causality from a bounded sample.
Deliver original HIDDEN_SIGNALS_Checked_Output: up to five supported themes, literal quotes, source/count reconciliation, and one
proposed one-week fix with baseline, metric, threshold, cap and stop. Save/register HIDDEN_SIGNALS.
Only collect fresh public evidence when asked and actually authorized; local exports need no connector.
Source inspiration: Corey Haines customer-research, pinned in docs/CEO_SOURCES.json; no whole upstream toolchain required.
