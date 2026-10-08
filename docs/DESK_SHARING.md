# Shareable CEO Desk and plan-aware use

Checked 8 October 2026. The course baseline is ChatGPT Plus (US$20/month), as selected
by Phou. Pro, a paid API and a five-agent team are not prerequisites for the four workshops.
Account limits and tools still vary; check the actual account before the class.

## What can be shared

Share the blank Desk interface, workflow instructions, schema, synthetic examples and
validation tools. Each learner supplies their own business profile and evidence.
The learner package already includes these assets; an additional subscription is not
needed merely to open the local HTML or the Node-based local interface.

Phou's richer private Desk can inform a portable template, but its private workspace is
not that template. Do not copy his task register, employee/customer records, business
files, saved browser storage, site database, account IDs, OAuth settings, tokens or
authenticated links. Extract only reusable interface/code after checking dependencies
and licenses; substitute blank state and test in a fresh learner folder. Giving someone
a skill does not give them access to Phou's connected accounts or create their own backend.

## Choose the route already available to the learner

| Route | What works | State and dependencies |
|---|---|---|
| ChatGPT Plus with supplied files | One assistant runs WS1–4 in sequence; saves a short checked output and next-step handoff | Learner retains files and uploads the latest handoff when needed. An uploaded SKILL.md is reference text, not proof of native skill installation. |
| Standalone original CEO_DESK.html | Optional priorities, up to 50 tasks, source IDs, workshop result index and imported Calendar snapshot | Browser storage only. Import/export JSON; download backup before switching browser/device. No folder autosync. No Node or model call is required to open/edit this HTML. |
| Local folder in Codex/Claude Code | Richer Desk tasks with next action, done criterion, evidence, blocker, project and priority; readable saved results; up to 2000 tasks | Node.js 22+ and local filesystem access. `node scripts/ceo.mjs desk`. `data/state.json` is authoritative; adapter writes revisions/backups and regenerates Markdown. No cloud/team synchronization is implied. |
| Optional 3D Brain | Read and navigate the learner's selected knowledge files | Bundled local app uses Node; no npm install is needed for packaged assets. It is a visual knowledge view, not a task database or automatic learning process. |

The native Codex roles are an optional execution mode. Their `.codex/agents/*.toml`
files use the documented custom-agent format, but an actual discovery/dispatch test is
still needed in the recipient runtime. Claude skill mirrors do not create Claude-native
agents. Core workshops continue in one assistant if native teams are unavailable.

## Use the Plus allowance carefully

Read only the files needed for the current question. Complete one workshop at a time,
save its facts, uncertainties, decision and handoff, and reuse that short handoff instead
of uploading the entire archive repeatedly. Use a separate review only when it can
check a material claim. If a limit is reached, preserve progress and resume after reset;
do not buy credits, switch to a billed API, or tell the learner to upgrade automatically.

The plain browser Desk is an optional companion. The four workshops must still deliver
useful checked files even when an interactive Desk, custom agents or a connector is absent.

## Boundaries that the interface must make visible

To move a small native project into the original standalone HTML, use
`node scripts/ceo.mjs desk-data-standalone`, not `desk-data` or a native full backup.
The separate `work/ceo/desk-data-standalone.json` is a limited copy: rich task fields and
optional non-WS result rows are omitted. Nothing in the canonical state is deleted or
relabeled. More than 50 tasks or text exceeding the original title/owner limits rejects
without truncation. Keep the full local backup; this projection cannot restore all local data.

- Done is the user's completion report; a checkbox is not independent verification.
- Calendar is a dated imported snapshot unless a successful current read is recorded.
- Restore stays within the same company on the local route; stale writes reject.
- Desk backups contain business information. Keep them private and inspect before sharing.
- The original standalone asset remains unchanged. Rich fields and the higher task limit
  are features of the local adapter, so an original-HTML edit may omit those fields.
- Local saved-result reading goes through the server's allowed Markdown files and displays
  text without executing HTML from a source.

## Current primary references

- [ChatGPT Plus](https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus): $20/month;
  usage limits can vary; API use is billed separately.
- [Codex pricing and access](https://learn.chatgpt.com/docs/pricing): included plan access
  and usage details. No fixed number of workshop runs is promised here.
- [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents): custom
  agent TOMLs and additional token use when delegating.
- [Local skills](https://learn.chatgpt.com/docs/build-skills): local discovery and skill
  distribution are distinct from browser uploads.
- [Claude Code with Pro/Max](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan):
  Claude and Code share plan limits; API-key authentication uses separately billed API usage.
- [Apify pricing](https://apify.com/pricing) and [subscription limits](https://docs.apify.com/account/subscriptions):
  a separate account/allowance, not included in ChatGPT Plus. Check the selected Actor,
  remaining allowance and approved cap before any run; use an export fallback when unavailable.
- [Netlify Drop](https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/): folders
  and ZIP files are accepted. Signed-in users can submit source needing a build; a prebuilt
  static package with root `index.html` is the predictable workshop deliverable. Dropping
  publishes the files; prepare and check them before the learner chooses to publish.

## Required recipient checks

On a fresh learner account/folder: confirm available tools; run one real-data workflow;
check a generated recommendation against its source; save and resume from the handoff.
For the chosen Desk route: add/edit/reload, export/restore, and check the real storage
location. For 3D: verify selected sources and a clicked note. Passing code tests or a
synthetic browser run alone does not establish learner acceptance or business value.
