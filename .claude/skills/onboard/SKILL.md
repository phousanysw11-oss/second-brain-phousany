---
name: onboard
description: Set up or resume this Second Brain through a saved interview, one question at a time. Use for first use, onboarding, or a requested context refresh.
---

# Onboard this person

Read the applicable local operating manual, `aios-intake.md`, `context/me.md`, `context/priorities.md`, and `context/preferences.md` from this project root. Read `work/tasks.md` when a task is supplied. Blank or unanswered fields are unknown, never learner facts.

## Start and resume

- On first use, start the guided interview with the first relevant unanswered question. Do not make the learner choose a skill, agent, package, or app.
- Ask **one question per turn** in the user's language. Reuse saved answers and the current conversation. Accept a batch of answers; save all of it without asking the learner to repeat.
- Accept "skip" or "unknown", record the gap, and continue. "Later", "pause", or "stop" pauses the interview: save the next unanswered topic and ask nothing further.
- A deferred or paused interview resumes only when requested. A completed interview stays completed unless the learner asks to update or restart it.
- If the learner asks for a specific task instead, help with that task using relevant context. Ask only missing information needed for it; do not make completing onboarding a prerequisite.
- Installation, extraction, verification, and onboarding never launch Dashboard, 3D Brain, a browser, or a server. No Node.js, Git, plugin, API, or account connection is required. Finish in chat.

## Useful topics

Follow the saved topic order, adapting questions to what is already known:

1. **Name and work.** For a blank intake, ask "What should I call you?" first. Ask about their work separately if needed to understand their goal. Do not require a title or business ownership.
2. **Priority.** Ask for the main result they want help with now. Retain a deadline or success measure only if supplied.
3. **First real task.** Use a task they already mentioned, or ask which task they want help with first. Proposed next actions stay labeled proposed.
4. **Sources.** Ask where the relevant information is kept. A file, folder, or tool name is enough; reported location does not prove access.
5. **Working style.** Ask how they prefer to work with AI, such as language and answer length. A writing sample is optional and useful only when voice matters.

These are topics, not a required number of turns. Ask only consequential gaps. Do not request passwords, API keys, card details, or bank account numbers.

## Save every answer

Local capture is part of a requested onboarding session. Preserve the user's wording in `aios-intake.md`, redacting any secrets. Record date, confirmed answers, skipped/unknown topics, status, and next question. Use the existing structure; do not replace earlier answers or invent answers to fill it.

Before changing a file containing learner data, create a unique timestamped backup under `archives/onboarding/`; preserve earlier backups. Update only supported facts in the corresponding text files:

- Name, work, and background → `context/me.md`.
- Confirmed priority, timeframe, and success measure → `context/priorities.md`.
- Language and collaboration preferences → `context/preferences.md`.
- First task, next action, status, and known completion check → `work/tasks.md`. Reuse a matching task; leave unstated owner/date blank. An intention is not completion.
- Reported sources → `connections.md`, labeled access unverified until actually checked.
- An optional writing sample → `references/voice.md`, preserving wording and provenance.

These Markdown files are canonical. Do not create or require JSON state, projections, or app synchronization. Preserve unrelated content. Read back saved answers and changed fields before asking the next question. If writing fails, keep the answer visible in chat, say exactly what was not saved, and pause capture.

## Finish

When useful topics are answered or explicitly skipped, set status to complete or complete-with-gaps and clear the next question. Check saved context against the actual answers. Briefly return the recorded priority, links to saved files, and a useful next step for the first task. Do not run another skill, launch an app, ingest files into Wiki, or create a schedule automatically.

For a completed intake, use the saved context for ordinary work without restarting the interview. A requested correction preserves the earlier dated answer and updates only the affected facts.
