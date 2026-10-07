---
name: ceo-unit-economics
description: "Calculate contribution, break-even and bounded unit scenarios from actual price and variable-cost inputs."
---

# Unit economics

Read [the shared local runtime contract](../bni-second-brain/references/codex-runtime.md) before work.
Reuse `data/state.json` and the selected company's accessible files; save outputs under `work/ceo/`.

Define the unit and period first: order, item or customer. Use net collected/recognized revenue consistently;
separate discounts/returns/tax, matched product cost, payment fees, packing, delivery subsidy, commission and attributable ad cost.
Show which variable costs are supplied, excluded or missing. Contribution = net revenue minus included variable costs;
contribution rate = contribution/net revenue when nonzero. Do not call gross margin contribution or contribution net profit.
Break-even units = relevant fixed costs / positive per-unit contribution only if both inputs are supported and comparable.
For ranges, show assumptions and sensitivity instead of point certainty. Keep currencies separate; preserve missing costs.
Return a sourced cost table, formulas, arithmetic check and what must be known before scaling. No price commitment or spending.
A positive example is not proof of demand or cash availability.
