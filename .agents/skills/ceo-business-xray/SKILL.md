---
name: ceo-business-xray
description: "Analyze business revenue, margins, concentration and cash from supplied company files."
---

# Business X-Ray

Read [the shared local runtime contract](../bni-second-brain/references/codex-runtime.md) before work.
Reuse `data/state.json` and the selected company's accessible files; save outputs under `work/ceo/`.

Read [WS1 method](../bni-second-brain/references/workshop-1.md) and its [original checks](../bni-second-brain/references/workshop-1-acceptance.md).
Dispatch CFO Analyst with actual files and source IDs; use Evidence Reviewer for independent checks.
Map sales, matched COGS, expenses, stock, cash and obligations. Exclude subtotal/duplicate rows visibly.
Recompute supported monthly net revenue, margin and supplied-data operating remainder; never call purchases COGS or incomplete remainder net profit.
Product/customer concentration uses ceil(0.2*N), actual selected revenue and identifiable-customer coverage.
Keep period/currency groups separate. Cash less known due payments is snapshot coverage, not a full forecast.
Deliver original one-page WS1_Checked_Output, evidence annex, three sourced team questions and actual gaps.
Save/register WS1; ask for the three original human checks only after showing the draft.
