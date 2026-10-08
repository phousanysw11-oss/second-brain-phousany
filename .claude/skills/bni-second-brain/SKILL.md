---
name: bni-second-brain
description: "Guide four connected CEO workshops: Business X-ray, Market X-ray with Apify, Winning Zone, and a static website ready for Netlify Drop."
---

# CEO Second Brain: one starting point

Baseline: ChatGPT Plus. Use the learner's language, one company, one main assistant and reusable evidence. Read [runtime](references/codex-runtime.md), then only the requested method. Offer onboarding choices when new; reuse answers and saved files. Browser users start with [Plus guide](../../../docs/CHATGPT_PLUS_START.md); local users use the canonical state.

| Request | Method | Acceptance | Result |
|---|---|---|---|
| Analyze my business / เริ่ม WS1 | [Business X-ray](references/workshop-1.md) | [Check](references/workshop-1-acceptance.md) | WS1 |
| Research my market / เริ่ม WS2 | [Market X-ray](references/workshop-2.md) | [Check](references/workshop-2-acceptance.md) | WS2 |
| Find my winning zone / เริ่ม WS3 | [Winning Zone](references/workshop-3.md) | [Check](references/workshop-3-acceptance.md) | WS3 |
| Build my website / เริ่ม WS4 | [Website](references/workshop-4.md) | [Check](references/workshop-4-acceptance.md) | WS4 |

“Start my workshops” starts WS1. “Continue” reads the last saved versioned handoff and resumes the unfinished step. Do not repeat onboarding or automatically launch a paid collection/deploy. Default to real authorized learner data; labelled synthetic demo only when requested. Missing inputs yield bounded partial analysis or a specific question, never fabricated facts.

The chain passes inspected business evidence → dated market evidence → a proposed Winning Zone → approved website claims. Read the actual previous artifacts, not an assumed summary. Keep unknowns and evidence IDs. Native subagents are optional for core workshops; do not label sequential perspectives independent. An actual requested independent Board still requires real separate calls and evidence.

## Optional tools outside the four workshops

- [CEO Desk](../ceo-desk/SKILL.md): open/update the local work view; result CEO_DESK.
- [AI Board](../ceo-ai-board/SKILL.md): optional independent review; result AI_BOARD.
- [Customer signals](../ceo-hidden-signals/SKILL.md): deeper feedback analysis; result HIDDEN_SIGNALS.
- [AI Employee](../ceo-ai-employee/SKILL.md) and [Monday Brief](../ceo-monday-brief/SKILL.md): legacy optional utilities, not WS5 in this course.

Save full results and read them back. New WS1–4 records carry course version `2026-10-08-four-workshops`; unversioned prior WS2–4 results keep their historical meaning. Do not overwrite old artifacts merely to reuse a filename. File existence does not prove model quality, native runtime, a live connector or learner acceptance.
