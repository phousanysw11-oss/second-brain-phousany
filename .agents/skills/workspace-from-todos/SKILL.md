---
name: workspace-from-todos
description: Build a personal Work & Second Brain web app from a student's to-do list, with Thai/English switching, priorities, Today/Week/Month views, projects, notes and backup. Use when someone asks to build or adapt their own task workspace; supports Codex with Sites and Claude Code.
---

# Workspace from To-dos

Turn the student's own tasks into a working personal workspace. Use the fresh template in `assets/template/`; do not copy another person's app, account setup, business data or integrations. The template is an intentionally browser-local starter, not a cloud team system.

## Start with the supplied tasks

1. Read the current request and supplied list. If no list exists, ask for it in ordinary language, one task per line. A file or pasted notes are equally acceptable; do not require a spreadsheet, agent role or framework choice.
2. Honor the student's requested target platform first; otherwise detect Codex or Claude Code from the environment. Ask which only if unclear. Use [Codex + Sites](references/codex-sites.md) or [Claude Code](references/claude-code.md) for that route, not both unless both are requested. Check the actual available tools before offering hosting. This skill does not install a plugin or grant connector access.
3. Default to the supplied bilingual template and preserve the student's explicit changes. Personal use, blank first run, Thai UI and optional English are the starter defaults. Explain once that tasks are stored in this browser and can be backed up. If they explicitly need shared records, cross-device sync or background reminders, discuss the required backend or scheduler before claiming those features.
4. Reuse supplied project names, ownership, dates and priorities. Preserve original wording in `sourceText`. Leave unknown fields blank; suggest next actions separately instead of treating estimates as commitments. Resolve relative dates against the student's local date/timezone. Ask one question only when an ambiguous deadline materially matters; otherwise keep it in source text and leave the date blank. Never deduce a manager's acceptance from their name.

## Build the app, not a proposal

For a new project run the bundled helper using an available Node.js runtime:

```text
node <skill-dir>/scripts/create-workspace.mjs <new-output-directory>
```

The destination must not already exist. The helper copies only the template and writes a small local project. No package installation is required. For an existing app, inspect its instructions and structure, preserve user data, and integrate changes rather than overwriting it with the starter.

Read [data and behavior](references/data-and-behavior.md) before producing task JSON or changing storage. Task input can use either:

- **Simplest:** Have the student paste their list using Add from list. Preview shows exactly what will be added. Existing tasks stay intact.
- **Organized import:** Convert explicitly supplied facts into the documented backup schema. Save a download/import file outside the Site checkout and public asset folders; use the in-app import preview. Do not embed real student tasks into JavaScript, HTML, demo examples, Git history or deployed static files. Confirm the actual imported result if browser control is available; otherwise say the import is ready, not completed.

Use only synthetic data for template demos. Clear dates and owners must come from the student; imported priorities remain unset if not supplied. A few concise recommendations may accompany the import file, labeled as suggestions. Do not delay the first useful build for a full interview, complete KPI data or a taxonomy exercise.

## Keep cognitive effort low

- Today: up to three chosen focus tasks; suggestions remain separate. Completed or waiting work must not masquerade as ready-to-start focus.
- All tasks: quick capture, editing, status, priority, owner, next action and due date. Completing a task can be undone by reopening it.
- Week and Month: date-based overviews with date navigation and an accessible route to undated tasks. A task due date is not a calendar event or a week commitment.
- Projects: progress is completed tasks divided by tasks, not business performance. Do not invent revenue or success metrics.
- Notes: editable, searchable notes linked to tasks. This is a small Second Brain, not an automatically ingested company knowledge base.
- Due notices work while the app is open. External notifications require a separately connected service, tested schedule and relevant user authorization.

## Thai / English is a requirement

Keep the visible language button available on desktop and mobile. Switch all app labels, forms, placeholders, accessible names, validation/error messages, empty states and date formatting immediately. Persist the preference after reload. Set the document `lang` correctly. User-entered tasks, names, projects and notes stay in their original language. Keep language keys paired; never use machine translation or a network call just to switch the interface.

## Verify and hand off

Run the generated project's syntax check and static build. Use [acceptance checks](references/acceptance.md) for realistic workflows, using temporary synthetic data. Test both languages and narrow-screen scrolling when browser testing is available and allowed by the active tool instructions. If a check cannot run, list that precise untested item rather than claiming it passed.

Give one clear opening link or local start command, a short explanation of where data is stored, and how to export a backup. Include the organized import file if one was created. Hosting follows the student's selected platform and existing authorization: a build request is not permission to expose their personal task data publicly. Do not ask for repeat approval when publication scope was already explicitly authorized. Do not install unrelated skills or promise that reminders, Google Sheets, Calendar, login or team synchronization are running.
