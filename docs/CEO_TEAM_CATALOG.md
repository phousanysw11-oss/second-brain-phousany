# CEO Team catalog

Package version: ceo-team-1.0.0. Source review: 2026-10-07.
This is a curated set of **20 CEO capabilities**, including two reused skills.
The 14 existing utility skills remain intact; with 18 new skills there are **32 unique
skill directories per host**. The six workshop segments and original Lao acceptance files
remain unchanged in sequence and required outputs. Bonus methods do not add workshop time.

## Eight native Codex roles

| Native name | Job | Typical handoff |
|---|---|---|
| [ceo_chief_of_staff](../.codex/agents/ceo_chief_of_staff.toml) | Chief of Staff: The single contact coordinating CEO work, CEO Desk and Monday Brief. | One learner contact; route, integrate and save results |
| [ceo_cfo_analyst](../.codex/agents/ceo_cfo_analyst.toml) | CFO Analyst: Business X-Ray, KPI reporting, unit economics and the Board financial perspective. | Scoped evidence packet → findings to coordinator |
| [ceo_customer_analyst](../.codex/agents/ceo_customer_analyst.toml) | Customer Analyst: Hidden Signals, customer evidence, sales support and bounded marketing hypotheses. | Scoped evidence packet → findings to coordinator |
| [ceo_competitor_analyst](../.codex/agents/ceo_competitor_analyst.toml) | Competitor Analyst: Dated competitive evidence, alternatives and the Board competitor perspective. | Scoped evidence packet → findings to coordinator |
| [ceo_investor_strategy_analyst](../.codex/agents/ceo_investor_strategy_analyst.toml) | Investor/Strategy Analyst: Capital allocation, alternatives, reversibility and the Board investor perspective. | Scoped evidence packet → findings to coordinator |
| [ceo_lao_business_advisor](../.codex/agents/ceo_lao_business_advisor.toml) | Lao Business Advisor: The Board local-business perspective grounded in supplied or verified Lao context. | Scoped evidence packet → findings to coordinator |
| [ceo_ai_employee_builder](../.codex/agents/ceo_ai_employee_builder.toml) | AI Employee Builder: Build narrow AI employees and SOPs from approved company policies. | Scoped evidence packet → findings to coordinator |
| [ceo_evidence_reviewer](../.codex/agents/ceo_evidence_reviewer.toml) | Evidence Reviewer: Independently verify sources, arithmetic, workshop outputs and actual employee responses. | Independent checks to coordinator after actual outputs |

Role files omit model settings and inherit the user's model. Five Board seats run separately
on one packet before peer review. Specialist/reviewer files request read-only mode; live
parent permissions still govern. No paid platform, new API key or separate agent install.

## Twenty selected skills

| Skill | Result | Workshop / source |
|---|---|---|
| [bni-second-brain](../.agents/skills/bni-second-brain/SKILL.md) | One ordinary-language entry; correct segment and saved handoff | All six; existing workshop + original Codex integration |
| [ceo-business-xray](../.agents/skills/ceo-business-xray/SKILL.md) | Business X-Ray: Analyze business revenue, margins, concentration and cash from supplied company files. | WS1; Existing workshop method, adapted runtime |
| [ceo-desk](../.agents/skills/ceo-desk/SKILL.md) | CEO Desk: Open or update the original interactive CEO Desk and its saved priorities, tasks and calendar snapshot. | WS2; Existing workshop method, adapted runtime |
| [ceo-hidden-signals](../.agents/skills/ceo-hidden-signals/SKILL.md) | Hidden Signals: Find recurring customer problems from deidentified messages with counts, quotes and one bounded test. | WS3; Existing WS3 + Corey customer-research |
| [ceo-ai-board](../.agents/skills/ceo-ai-board/SKILL.md) | AI Board of Directors: Convene five independent native AI Board perspectives on one frozen evidence packet, then review and synthesize. | WS4; Existing WS4 + Alireza chief-of-staff |
| [ceo-ai-employee](../.agents/skills/ceo-ai-employee/SKILL.md) | AI Employee: Build a narrow AI employee from approved company policy and test normal, missing-input and exception behavior. | WS5 employee; Existing workshop method, adapted runtime |
| [ceo-monday-brief](../.agents/skills/ceo-monday-brief/SKILL.md) | Monday Brief: Prepare a Monday CEO Brief from saved workshop results, decisions and the original three priorities. | WS5 Monday; Existing workshop method, adapted runtime |
| [ceo-source-check](../.agents/skills/ceo-source-check/SKILL.md) | Evidence readiness: Check company source coverage, conflicts, definitions and provenance before consequential analysis. | All; New focused local method |
| [ceo-kpi-report](../.agents/skills/ceo-kpi-report/SKILL.md) | KPI reporting: Report KPI movement using comparable definitions, denominators, currencies and periods. | Recurring / Monday; Original local adaptation + Anthropic variance-analysis |
| [ceo-unit-economics](../.agents/skills/ceo-unit-economics/SKILL.md) | Unit economics: Calculate contribution, break-even and bounded unit scenarios from actual price and variable-cost inputs. | WS1 / Board; Existing workshop method, adapted runtime |
| [ceo-competitor-research](../.agents/skills/ceo-competitor-research/SKILL.md) | Competitor research: Build a dated competitor comparison from supplied sources or verified public pages without inventing market facts. | Board / sales; Corey competitor-profiling, compact adaptation |
| [ceo-decision-review](../.agents/skills/ceo-decision-review/SKILL.md) | Decision review: Review an existing CEO decision against its original assumptions, evidence and agreed review triggers. | Board / recurring; New focused local method |
| [ceo-delegation](../.agents/skills/ceo-delegation/SKILL.md) | Delegation: Create a single-owner delegation brief with outcome, authority, evidence and an explicit acceptance check. | Desk / recurring; New focused local method |
| [ceo-sop](../.agents/skills/ceo-sop/SKILL.md) | SOP: Turn an observed company process into a minimal usable SOP and checklist with exceptions. | Employee / recurring; New focused local method |
| [ceo-policy-answer](../.agents/skills/ceo-policy-answer/SKILL.md) | Policy answers: Answer a company policy question with the approved rule/version, or ask/escalate when it is missing or conflicting. | Employee / recurring; New focused local method |
| [ceo-meeting-followup](../.agents/skills/ceo-meeting-followup/SKILL.md) | Meeting follow-up: Extract decisions, owners and open actions from supplied meeting notes without turning suggestions into commitments. | Desk / recurring; New focused local method |
| [ceo-sales-support](../.agents/skills/ceo-sales-support/SKILL.md) | Sales support: Draft a practical sales reply, objection guide or one-page offer from evidence the team can defend. | Recurring / customer; Corey sales-enablement, compact adaptation |
| [ceo-marketing-test](../.agents/skills/ceo-marketing-test/SKILL.md) | Marketing test: Design one small marketing test tied to customer evidence, an approved offer and a measurable learning question. | Recurring / Hidden Signals; New focused local method |
| [prioritize-work-four-factors](../.agents/skills/prioritize-work-four-factors/SKILL.md) | เลือกงานที่ควรปรับปรุงด้วยเงิน เวลา ผลกระทบ ความถี่ 0–12 | Recurring / Desk; Existing approved project adaptation; original units/unknown handling retained |
| [weekly-review](../.agents/skills/weekly-review/SKILL.md) | ทบทวนงานที่เสร็จจริง สิ่งค้าง และข้อเสนอสำหรับสัปดาห์หน้า | Recurring / Monday; Existing distributed skill; unchanged |

For exact procedures and acceptance, read only the selected skill. Every new skill routes to
the shared [runtime contract](../.agents/skills/bni-second-brain/references/codex-runtime.md).
Identical new skill mirrors are packaged under .claude/skills for file compatibility; this
does not establish native Codex role execution in Claude. A host lacking native dispatch
must report that team step BLOCKED, not simulate it.

## Existing utilities retained

3d-brain, audit, finish-my-task, grill-me, level-up, onboard, open-3d-brain, plan-my-day,
prioritize-work-four-factors, read-team-performance, start-my-work, weekly-review,
wiki-helper, workspace-from-todos. They keep their existing references/assets and behavior.
The curated list reuses prioritization and weekly review rather than adding duplicates.
KPI reporting complements read-team-performance: KPI definition/comparison is its distinct job.

## Source and license review

- [anthropics/knowledge-work-plugins at 8444efcd48f7](https://github.com/anthropics/knowledge-work-plugins/tree/8444efcd48f7012f09797778a36a33e73d0861f4): Apache-2.0. Selected for compact adaptation. [License](../licenses/ceo-team/anthropic-finance-Apache-2.0.txt). Selective variance narrative and reconciliation concepts for ceo-kpi-report. Upstream thresholds, default financial advice disclaimer, complex mix formulas and connectors are not imported.
- [coreyhaines31/marketingskills at 5e721d73ac85](https://github.com/coreyhaines31/marketingskills/tree/5e721d73ac85be8ba917d6a9ca9cb5bc98f02b80): MIT. Selected for compact adaptation. [License](../licenses/ceo-team/corey-haines-MIT.txt). Compact original adaptations for quoted customer evidence, dated competitor comparisons and defensible sales claims. No full upstream scripts, references or marketing context state copied.
- [alirezarezvani/claude-skills at 19392f7a0826](https://github.com/alirezarezvani/claude-skills/tree/19392f7a08264ed00486a251f5b2098321771f94): MIT. Selected for compact adaptation. [License](../licenses/ceo-team/alireza-rezvani-MIT.txt). Adapted bounded coordination, independent initial Board perspectives, named disagreements and decision review. Native Codex dispatch replaces textual INVOKE syntax. Local authoritative state replaces global Claude memory paths.
- [msitarzewski/agency-agents at 5baafd5f1452](https://github.com/msitarzewski/agency-agents/tree/5baafd5f1452e9785c413065b033ec083ab27757): MIT. Reviewed candidate, not installed. [License](../licenses/ceo-team/agency-agents-candidate-MIT.txt). Reviewed as candidate; not installed or adapted. Broad autonomy, always-fail skepticism, persona experience and mandatory web-stack QA commands do not fit this beginner CEO package. Evidence reviewer is newly authored against original acceptance criteria.

Exact reviewed paths/blob hashes and dependency decisions: [CEO_SOURCES.json](CEO_SOURCES.json).
Official native-role/discovery rules were read at [OpenAI subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
and [OpenAI build skills](https://learn.chatgpt.com/docs/build-skills).
No repository was installed wholesale; no private author context was copied.

## Delivery checks

File validation is separate from a real fresh-session test. Required behavioral evidence:
ordinary-language routing, real role tool IDs, five independent initial Board responses,
post-initial review, policy-case actual replies, local state/Desk agreement and preserved
user work on reinstall/upgrade. See the package test report for observed status.
Do not interpret this catalog as proof of discovery, financial accuracy, learner time saving
or scheduled background work.
