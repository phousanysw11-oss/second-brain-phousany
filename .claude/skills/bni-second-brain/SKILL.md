---
name: bni-second-brain
description: "Run BNI CEO workshops from one saved company: Business X-Ray, CEO Desk, Hidden Signals, independent AI Board, AI Employee and Monday Brief."
---

# BNI CEO Second Brain

Use ordinary language. The learner never chooses agents, copies prompts or performs manual
handoffs. Ask one consequential missing question at a time; reuse saved answers.
Read [the local runtime contract](references/codex-runtime.md), then only the requested
method and its original acceptance file.

| Request | Method and acceptance | Result |
|---|---|---|
| Analyze my business / เริ่ม WS1 | [WS1](references/workshop-1.md), [checks](references/workshop-1-acceptance.md) | WS1 |
| Open my CEO Desk / เริ่ม WS2 | [WS2](references/workshop-2.md), [checks](references/workshop-2-acceptance.md) | WS2 |
| Find customer problems / เริ่ม WS3 | [WS3](references/workshop-3.md), [checks](references/workshop-3-acceptance.md) | WS3 |
| Ask my AI Board / เริ่ม WS4 | [WS4](references/workshop-4.md), [checks](references/workshop-4-acceptance.md) | WS4 |
| Build my AI employee / เริ่ม WS5 | [WS5](references/workshop-5.md), [checks](references/workshop-5-acceptance.md) | AI_EMPLOYEE |
| Prepare my Monday Brief | [WS5 stages 5–6](references/workshop-5.md), [checks](references/workshop-5-acceptance.md) | MONDAY_BRIEF |

"Start my workshops" starts WS1; "continue" uses the last observed unfinished result.
Do not launch another segment automatically. Preserve every original exercise/output.
Employee and Monday remain two segments even though both carry the WS5 workshop label.
Default to real learner files. Demo requires an explicit request, fictional label and separation.
Never add the author's private company facts.

The Board requires five separate native roles on one frozen packet, then independent review.
Unavailable dispatch means BLOCKED team execution, never simulated seats presented as agents.
The runtime contract governs dispatch/saving; original acceptance files govern learner checks.
Save full outputs, register them and read them back.

The [original CEO Desk](assets/CEO_DESK.html) and [data contract](references/desk-data-contract.md)
are retained. Use `node scripts/ceo.mjs desk`; do not regenerate or publish a replacement.
No mandatory business connector, paid agent platform or new Custom GPT. Optional Calendar/
Apify routes require actual access and explicit scope.
