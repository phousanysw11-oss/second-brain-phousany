# CEO Desk audit and repairs

8 October 2026, Asia/Vientiane. Scope: learner Desk, shared state, portable sharing,
optional 3D view and runtime/plan dependencies. This report is not a whole-package
release approval or a live learner acceptance test.

## Findings and dispositions

| Finding | Evidence | Disposition |
|---|---|---|
| Local Desk hid actionable fields already in the task state | `app/ceo-state.mjs` original projection omitted next, doneWhen, evidence, blocker, project and priority | Repaired in `app/ceo-state.mjs:10,62,80` and `app/ceo-desk-adapter.js:3-22`: edit, render, backup and restore all six fields; display source text without executing HTML. |
| Desk refused 51 tasks even though canonical state allows 2000 | Old Desk projection and validators capped at 50 | Local served copy now uses the state limit of 2000. A 60-task browser save/reload and unit restore passed. The original standalone HTML remains capped at 50. Large-payload limits still apply; 2000-task performance was not benchmarked. |
| A result index showed a path but did not open the result | Original HTML rendered result source as plain text | Added Read saved result using the existing allowed-file endpoint. Markdown appears as inert text in an accessible dialog. |
| Remapping workshop numbers could mislabel saved results | Old WS2/WS3/WS4 meant Desk/Hidden Signals/Board | Course-version-aware labels in `app/ceo-state.mjs:6-8` preserve older meanings and append legacy course. Current WS1–4 use explicit title/current mapping; optional results keep distinct IDs. |
| Two storage modes can be mistaken for synchronization | Original `CEO_DESK.html:29-30,48` uses localStorage; `app/server.mjs:27-42` serves adapter/API | Documented explicitly in `docs/DESK_SHARING.md`. Local authority is `data/state.json`; original standalone HTML is browser-local only. |
| Existing quality evidence did not prove native team readiness | `docs/TEST_REPORT.md:13-20,40,56` disclosed blocked native discovery/model outputs | Remains unverified for a recipient runtime. TOML role files are genuine supported configurations, not proof they loaded. Core Plus workflow uses one assistant and does not depend on native teams. |
| Copying Phou's private Desk would expose data and inherit backend dependencies | Scoped WORK_ORGANIZER README identifies private site/database/authenticated data route | Share sanitized interface/workflow/template only. No private Forma code, data, credentials or live workspace was copied. |

## Actual changes

- `app/ceo-state.mjs`: rich Desk projection and validation; local task capacity;
  current/legacy result labels; optional result IDs; served-copy validation patches.
- `app/ceo-desk-adapter.js`: rich task editor and display; source-safe result reader;
  completion-report explanation; mobile dialog scrolling.
- `.agents/skills/ceo-desk/SKILL.md` and `.claude/skills/ceo-desk/SKILL.md`: identical
  optional Desk workflow, retained legacy reference route, correct `CEO_DESK` result ID,
  ChatGPT Plus browser/file route, local route and lightweight handoff.
- `tests/ceo-state.test.mjs` and `tests/desk-browser.cjs`: regression coverage below.
- `docs/DESK_SHARING.md`: sharing scope, dependency/storage matrix, plan-conscious use
  and primary source links.
- `docs/evidence/desk-browser-2026-10-08.json`, `ceo-desk-2026-10-08.png` and
  `ceo-desk-mobile-editor-2026-10-08.png`: observed synthetic browser evidence.

The distributed original `CEO_DESK.html` remains byte-identical:
`a04f9c80cf720f26caec3372e29e2483f5afd25f5438f137a5c684a5d051c0ad`.
No server/account/deployment permissions or external business records were changed.

## Verification performed

Windows, Node.js 24.18.0. JavaScript syntax checks passed. The state suite passed 9/9:
metadata/decisions and status round-trip, six rich fields and 60-task restore, current
and optional result labels, legacy result meaning, invalid/wrong-company data rejection,
projection failure disclosure, Calendar-only preservation, atomic/revision/backup handling,
and immutable original asset with updated served bootstrap.

The real headless Chrome suite passed 13/13 checks, recorded in the evidence JSON:
allowed result file as inert text; add/save; rich field persistence and HTML escaping;
user-reported completion; reload/reopen; actual downloaded backup restore; wrong-company
restore rejection; Calendar-only preservation; stale API revision rejection; new browser
context plus server restart; mobile form scrolling without horizontal page overflow;
60-task canonical save/bootstrap; failed-write recovery download. Desktop and mobile
screenshots were opened and visually inspected.

Initial tests hit two environment issues. Default Windows sandbox temporary folders
denied atomic rename; placing disposable test folders in the writable workspace resolved
the state tests. The sandbox also denied localhost fetch despite the test server starting;
the automatically approved outside-sandbox browser run passed. An added test initially
reused its pre-edit title locator; that test locator was corrected and the suite rerun.
These failures were not hidden as passes.

Reproduce with `node --test tests/ceo-state.test.mjs` and `node tests/desk-browser.cjs`.
For browser checks, supply an available Playwright module via `CEO_PLAYWRIGHT`, Chrome via
`CEO_BROWSER_CHANNEL=chrome`, and an evidence directory via `CEO_TEST_EVIDENCE`.
In the restricted Windows runtime, set TEMP/TMP to a disposable writable workspace path.
The browser test owns its synthetic folder and closes its test browser/server.

## Subscription and sharing judgment

The confirmed course baseline is ChatGPT Plus, US$20/month. Current primary documentation
and direct links are in [Desk sharing](DESK_SHARING.md). Plus allowance is not unlimited;
API and Apify costs are separate. The prompt/file workflow needs no Pro upgrade. Reuse
short saved handoffs and perform bounded review. Native teams are optional and consume
additional model work. Actual learner account tools/limits remain account-specific.

The 3D Brain is already packaged as an optional local read-only view with selected local
sources and bundled assets; it does not replace task state. It was inspected, not changed
or retested in this scoped repair. A richer private Desk can be adapted into a shareable
template after extraction and fresh-folder QA, but this audit does not claim that a full
Forma clone or cloud backend has been delivered.

Remaining acceptance: real learner Plus session, genuine model-generated workshop
recommendation checked against source, save/resume in a new chat, actual learner feedback,
and any optional native-role discovery. Browser persistence is verified; learner value
and business outcomes are not inferred from it.
