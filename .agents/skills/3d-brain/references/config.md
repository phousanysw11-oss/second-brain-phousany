# Personalization and source configuration

Create a JSON object like this after the user chooses the name and categories:

```json
{
  "name": "Atlas Brain",
  "port": 4640,
  "sources": [
    {"id":"knowledge","label":"Business knowledge","paths":["context","wiki"],"color":"#38BDF8","staleDays":75},
    {"id":"meetings","label":"Meetings","paths":["meetings"],"color":"#FB923C","staleDays":null},
    {"id":"projects","label":"Projects","paths":["projects"],"color":"#34D399"}
  ]
}
```

This is a schema example, not permission to assume those folders exist. Include only verified and chosen paths. The scaffold computes `root` relative to the generated app, so the AIOS can move between folders or machines without breaking its in-repo paths. A local `brain.config.json` is gitignored.

Fields:

| Field | Meaning |
|---|---|
| `name` | Exact display name, 1–64 characters. All personal branding is derived from it. |
| `root` | AIOS root relative to the installed app's config. Scaffold sets this automatically. |
| `port` | Local port, 1024–65535, default 4640. Check for conflicts. |
| `maxNodes` | Scan cap, default 3000, maximum 10000. Reaching it produces an inventory notice. |
| `sources` | 1–12 categories. |
| `sources[].id` | Unique lowercase ID beginning with a letter; letters, digits, and hyphens. |
| `sources[].label` | User-facing category name. |
| `sources[].paths` | Approved files/folders, relative to the AIOS root or explicit absolute/`~/` paths. No glob patterns. |
| `sources[].type` | `markdown` (default) or `codex-memory`. |
| `sources[].color` | Optional six-digit hex color; otherwise a distinct palette color is assigned. |
| `sources[].exclude` | Optional relative path prefixes beneath each selected directory. |
| `sources[].staleDays` | Positive number, default 90. `null` disables stale flags for historical records. |
| `sources[].obsidianVault` | Optional existing Obsidian vault name. Only use when the node paths are valid vault-relative paths. |

## Supported sources

**Markdown:** recursively scans `.md` and `.txt`, reads simple scalar frontmatter (`title`, `name`, `description`, `type`, `updated`, `created`, `tags`), and resolves Markdown file links and wikilinks. The source's folder structure determines what is included, not an author's hardcoded wiki layout. Project index entries remain note text; actual project folders need to be selected to include their saved notes.

Hidden directories, git, dependencies, archives, scratch, audit outputs, generated data, and the generated app itself are excluded. Symlinks are skipped during discovery scans. Files over 1 MB produce a notice. Navigation notes are listed in inventory rather than drawn. Choosing the same file twice does not duplicate its node.

**Claude memory:** optional, after an explicit request and exact path choice. Use `markdown` with the approved project-specific Claude memory directory. Do not invent its encoded directory name. Only `discover.mjs --include-external-memory` offers the exact current-root match when it exists; ordinary discovery stays inside the learner workspace.

**Codex Memory:** optional, after an explicit request and exact path choice. Use `codex-memory` and the chosen memory root. Only discovery with `--include-external-memory` checks `CODEX_HOME` or `~/.codex/memories`; ordinary discovery does not visit external memory paths. The adapter reads `memory_summary.md`, sections of `MEMORY.md`, Markdown `rollout_summaries/`, memory `skills/`, and `extensions/ad_hoc/notes/`. It does not scan raw chat logs, `.env`, credentials, hidden files, or duplicate `raw_memories.md`. The store can contain memories from several projects, so explain that scope before the user selects it. No memory source is selected in the saved learner app.

**Other formats:** unsupported by default. Ask for or create an authorized local Markdown export, or implement a documented adapter. Do not synthesize missing business content or claim remote API coverage.
