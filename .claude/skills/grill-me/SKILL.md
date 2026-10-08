---
name: grill-me
description: Explore or stress-test a plan or topic through one-question interviews, saving each answer and a resume point. Use when the user asks to be grilled, brainstorm, or extract their thinking.
---

# Grill Me

Turn the user's thinking into a durable capture and clearer decisions. Start from relevant saved context and evidence; ask about material gaps and tradeoffs, not facts already available.

## Start a capture

Read the applicable operating manual and only the context, project files, or prior captures relevant to this topic. An installed skill does not start an interview.

Get the actual date. Create `brainstorms/YYYY-MM-DD-topic.md` with a title, goal, date, status, sources, Q&A log, summary, and open questions. Create exclusively; add a time or unique suffix if the name exists. Resume an existing capture only when the user refers to that session; read it and retain its question numbering.

If the topic is unknown, ask what to explore and retain that answer in the capture. Tell the user the saved location in one short line.

## Interview and checkpoint

- Ask **one question per turn**, chosen for its effect on the plan or understanding. Do not turn one question into a long list of unrelated demands.
- For facts, ask neutrally. For choices, a recommendation may help; distinguish it from the learner's answer.
- Read a relevant supplied file instead of asking the user to repeat its contents. Respect actual source scope and permissions.
- After each answer, append the question and the user's confirmed facts or decisions. Keep tentative ideas, assistant suggestions, contradictions, and unknowns distinct.
- If the user supplies several answers together, capture the entire response and ask only what is still useful.
- Read back the saved entry before continuing. If saving fails, retain the answer in chat, explain the failure, and pause capture.
- Preserve the original answer when corrected; add the correction with its date and update the summary. Do not silently rewrite history.
- Accept "unknown" or "skip" and move on with the gap recorded. Mark an owner only if supplied. On pause or stop, save the next useful question and ask nothing further.
- Stop when the requested scope is covered, the user stops, or further questions add little value. Avoid interviewing indefinitely merely to fill a form.

A compact capture can use:

```markdown
# Topic
Date:
Goal:
Status: in-progress / paused / complete
Sources:
## Summary and decisions
## Q&A
### Q1
Asked:
Confirmed:
Tentative or suggested:
Unresolved:
## Open questions and resume point
```

## Close and use the answers

Check for contradictions and summarize what changed. Return the actual capture link, material unresolved questions, and one useful next step.

When the user asked to build or update their Second Brain context, merge confirmed durable facts into the corresponding existing `context/me.md`, `context/priorities.md`, or `context/preferences.md` with a dated source link. Back up files containing learner data before editing; preserve unrelated facts. Append a meaningful confirmed decision to `decisions/log.md` only within that requested context update.

For a plan interview, the raw capture is the default output. Save a polished requested deliverable under its existing project, or `projects/work/` when no project exists. Do not automatically run audit, level-up, Wiki ingestion, or 3D Brain. Captures are dated evidence, not automatically current truth.

No global-memory changes, external messages, publication, spending, account setup, or app launches follow from an interview. Never save credentials. Verify capture creation, append, and resume against the files actually saved; do not claim persistence from chat alone.
