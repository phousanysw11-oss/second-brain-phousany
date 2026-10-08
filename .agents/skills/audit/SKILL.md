---
name: audit
description: Audit this Second Brain's context, source routes, selected skills, and actual operating evidence using the Four Cs. Saves a dated local report with findings and verification limits.
---

# Second Brain Audit

Assess whether this folder can find the right information and support the learner's work. Use [rubric.md](rubric.md), **rubric v2**: Context, Connections, Capabilities, and Cadence, each out of 25. Label the score **verified operational reliability**; it is not a usefulness grade. Skill count, file presence, or an API key does not prove execution.

The audit reads inspected systems. Its only default write is a new local report in `audits/`. Do not repair, synchronize, install, launch apps, ingest Wiki sources, change schedules, or write external systems while auditing. An explicit "do not save" overrides report persistence.

## Scope and prior evidence

Resolve the current project root and actual date. Read applicable root `AGENTS.md` and `CLAUDE.md`, then relevant indexes and canonical text context: `aios-intake.md`, `context/me.md`, `context/priorities.md`, and `context/preferences.md`. Follow established project routes. Template blanks are unknown; a fresh kit is not a broken personalized system.

Use [history.md](history.md) to select at most two relevant prior reports initially, carry findings, and establish whether scores are comparable. A changed scope or rubric cannot support a simple score delta.

Choose up to three real priority workflows before inspecting their outputs. No revenue data, cloud connector, custom agent, Dashboard, or automatic schedule is required to use this kit. Local files and manual work can be the intended architecture. Their verification evidence and the rubric's manual-cadence limits still apply.

Record checked coverage, exclusions, and evidence for every material finding: verified, documented but unverified, missing, stale, or conflicting. Distinguish confirmed defects, verification gaps, intentional differences, and optional improvements. An unchecked path is not proven broken.

## Routes and core skills

Run [compatibility.md](compatibility.md) for the runtimes used or targeted. For this distribution, the intended core set is exactly:

`onboard`, `grill-me`, `audit`, `level-up`, `wiki-helper`, `3d-brain`, `open-3d-brain`.

Inventory both `.agents/skills/` and `.claude/skills/`. Check all seven entrypoints, frontmatter names, required references/assets, and declared mirror parity. Identify a missing or unexpected bundled skill; learner-added skills are not defects merely because they extend the core. UI metadata under a skill's `agents/` directory is not a standalone agent. Report runtime discovery separately from file presence and execution.

Check concrete paths from their declared base, including text context, work tasks, brainstorms, decisions, and `llm-wiki/raw/` plus `llm-wiki/wiki/`. Check the onboarding-first rule: one missing question, saved answers reused, pause respected, and no automatic app launch. Do not start onboarding or 3D merely to audit.

Use five retrieval probes appropriate to the learner:

1. Who is this person, and what matters now?
2. Where is an authoritative current priority, task, or status?
3. Where is the deliverable and next step for an active project?
4. Where is a past decision or knowledge item and its original source?
5. Where is a commonly needed original record, file, or external source?

If a category does not apply, substitute a relevant retrieval need and explain why. For a blank kit, record unanswered probes honestly; do not manufacture learner projects. Show attempted route, actual source, freshness/authority, and direct, fallback, or unresolved result. Broad search recovery does not prove the declared route worked.

## Four-Cs evidence

- **Context:** Check actual answers, source authority, relevant routes, freshness, and contradictions. Wiki summaries should trace to original sources; current operational figures need appropriate dated or live evidence.
- **Connections:** Check only relevant source domains. Record mechanism, specific route, successful-read evidence/date, and limitations. A reported tool is unverified until checked. Use bounded read-only access or existing run evidence; never expose secrets or run unknown scripts.
- **Capabilities:** Inspect meaningful output, completion checks, missing-input behavior, portability, and actual repeat use for the sampled priority workflows. A static check or synthetic rehearsal is not real learner use.
- **Cadence:** Inspect only declared human rituals or actual triggers and due-run evidence. No schedule is a valid choice; it is not unattended execution. Do not create triggers to improve a score.

Read the complete rubric, score all 20 criteria, show four subtotals and raw total, then apply its caps with reasons. Partial or unavailable scores remain null. Do not invent points from absence of evidence or inflate/depress scores to encourage another run.

## Report and next action

Use [templates/report.md](templates/report.md) and [history.md](history.md). Save with a real UTC timestamp and collision-resistant suffix; preserve prior reports. Read back metadata, score arithmetic, evidence links, and carried finding states. On a partial run, mark it partial. If saving fails, say "report not saved" and return the report in chat.

Include:

- Scope and plain-language conclusion.
- Dedicated root-manual findings: each manual checked/missing/not checked, shared-guidance comparison, exact references, and whether any manuals changed. A normal audit says "No operating manuals were changed."
- Seven-skill/mirror and routing compatibility results, with discovery and execution limits.
- Five retrieval results and all Four-Cs arithmetic.
- Stable finding IDs, evidence, prior/current states, and completion checks.
- Up to three useful next actions, labeled repair, verify, or optional; do not invent issues to fill the list.
- Previous-report links and comparison limits, plus the actual saved report link.

A next step may be `level-up` for one selected repair or `grill-me` for genuinely missing context. Recommend it only when useful; do not invoke another skill or change the audited system automatically. A repeat audit can verify a fix when requested; it is not background monitoring.
