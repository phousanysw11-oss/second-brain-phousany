# Acceptance checks

Use synthetic data in a disposable browser profile and empty output directory. Never run destructive fixtures against a student's real state.

1. A blank workspace immediately allows pasting tasks. Preview and import a mixed Thai/English list, including an undated line and a checked Markdown task. The source text is retained and no invented owner/date/priority appears.
2. Add, edit, complete and reopen a task. Choose focus tasks; the limit is explained and waiting/done tasks are excluded. Search retrieves matching tasks and notes.
3. Set a date, owner, project and priority; inspect Week/Month and the project progress. Navigate date ranges and return to today. Unscheduled tasks remain findable.
4. Create a linked note. Reopen the note, change it and reload the page. Both the task and note persist.
5. Toggle Thai/English on every route and open form. Check labels, accessible names, placeholders, errors and dates. Reload; language remains selected. User content is unchanged.
6. Export, open a fresh browser context and import. Counts, text, associations and focus agree. Import into an existing workspace with the same IDs; preview explains the policy and no current record is silently lost. Invalid JSON, duplicate IDs and corrupt local state do not overwrite the last good data.
7. Check keyboard navigation, dialog Escape/close, 390px mobile width, long Thai titles, long lists, and light/dark colors. Main content must scroll both directions; sidebar collapse must release its layout width.
8. Run `npm run check` and `npm run build` in the generated app. Check that `dist/` includes only generic public app files. Confirm that no student data, credentials, private file URLs or host-specific configuration are in the release.

Report what actually ran. Successful local tests do not prove Sites deployment, Claude Code skill discovery, multi-device sync, scheduled alerts, accessibility certification or student classroom success.
