---
name: onboard
description: Set up or resume this local Second Brain through a short one-question-at-a-time interview. Use when the user asks to onboard, start onboarding, resume setup, or begin their Second Brain.
---

# Onboard this person in this folder

Read the local operating manual, aios-intake.md, data/state.json, context/me.md, context/priorities.md and context/preferences.md. Resolve paths from this project root, not from the skill folder or the kit author's computer. A fresh package has blank fields; these are not facts.

Start immediately with the first unanswered topic below. One question per turn, using the user's language. If they already provided several answers, save them and ask only what matters next. Accept "skip", "unknown" and "later"; note the gap and continue. Do not force a voice sample, financial data, job title or business ownership. No plugin, Git, Node, server, calendar setup or other skill is a prerequisite.

## Five short topics
1. Name and work: "What should I call you, and what do you mainly do?" Capture their name, role, and department only if supplied. For a business owner, their offer/customer can be captured here without demanding an ICP exercise.
2. Priority: "What is the most important result you want this Second Brain to help you with now?" Retain any stated deadline and success measure; never invent one.
3. First real task: "What is one task you want help with first?" Use the task they already mentioned. Save a proposed next action as proposed; leave unknown owner/date/criterion blank.
4. Sources: "Where do you keep the information you use for that task?" File/folder/tool names are enough. No credentials or mandatory account connections. Do not infer a calendar from an email provider.
5. Working style: "How would you like AI to work with you, for example language and short or detailed answers?" Offer optional writing samples only when voice matters; never block completion on them.

## Save after every answer
The user asked to onboard: save supported answers locally as part of that task. Before changing a non-template user file, create a unique timestamped backup under archives/onboarding/. Never overwrite an earlier backup. Save each response (redacting any secrets) into aios-intake.md with date, confirmed facts, skipped/unknown items, status and next unanswered topic. Read the saved file back before the next question. If saving fails, show the answer in chat, explain the exact write failure, and pause capture; do not claim it was saved.

Update only the corresponding context with confirmed information:
- Identity -> data/state.json.profile.name / role / department; primary result -> profile.goal plus context/priorities.md. Preferences -> context/preferences.md. The intake retains full wording if a profile string would exceed 2000 characters.
- First task -> data/state.json.tasks only when a real task was stated. Reuse a matching existing task; do not duplicate on resume. Task fields: id (unique letters/numbers/hyphens, max 80 chars), title (max 240), status (todo/doing/blocked/done), owner, due (YYYY-MM-DD or empty), next, doneWhen, evidence, blocker, project, priority (all strings). New tasks default to todo. Do not mark done without the agreed criterion and evidence. Preserve all other state fields and existing tasks.
- Sources -> connections.md as reported / access unverified until actually tested. Writing samples if provided -> references/voice.md, preserving wording but removing secrets. Do not fabricate voice content.

For state changes follow the manual's Dashboard/revision rule: never race an active Dashboard. On a fresh install the installer does not launch the app. Use the verified local API if this project's app is running; otherwise, with it stopped, read the newest state, back it up under data/backups/, change only supported fields, increment revision and refresh context/me.md and work/tasks.md as readable projections of that same state. Changes to projections alone do not count. Preserve aios-intake.md and richer context independently of the projections. Re-read JSON to verify syntax, confirmed values, revision and no lost tasks.

## Finish and resume
Once the useful topics are answered or explicitly skipped, set intake status to complete or complete-with-gaps and clear the next question. Verify saved profile, priority and task against actual answers. Close with the user's recorded priority, links to the saved context, and one concrete next action for the first task. Do not claim any external tool is connected without evidence. No compulsory Day-2 schedule or follow-up automation.

If already complete, do not rerun the questions or rewrite unchanged files. Briefly state what is saved and ask what they want to work on or update. If paused, continue at the stored unanswered topic. An explicit correction updates that fact and its projections with backups, retaining the dated earlier answer in the intake.
