# Core Seven verification

Date: 8 October 2026. Version: 3.1.0-core-seven, trimmed from public 3.0.1.

The requested distribution contains exactly onboard, grill-me, audit, level-up, wiki-helper, 3d-brain and open-3d-brain. They have matching Codex/Claude copies. Skill UI metadata is not a custom agent. Dashboard, CEO workshops, custom agent-role definitions and the JSON profile runtime are excluded. Frozen learner context is blank Markdown; a build never reads personalized context.

Observed development checks:

- Shared Python/native Windows installer regression: 36 tests passed, two junction checks unavailable in this environment. Core Seven adds empty-folder/exact-release gates before writes; the exact-archive check separately exercises fresh install, same-release repeats, preserved answers and four populated/older-folder rejection cases across both backends.
- Real archive checks verify every member hash/size, the seven-skill inventory, both mirrored file trees, concrete Markdown links and blank scaffolds. Exact final build receipts are generated separately; inspect release.json and SHA256SUMS.txt for the published bytes.
- Both optional 3D runtimes were checked with synthetic sources: 13 package groups and 10 saved-app/browser groups. Cinema, orbit/zoom, replay, pause, reduced motion, note readback and mobile controls worked. Six final targeted assertions checked the repaired note-count status across both bundles. See the 3D skill's package-verification.md for the exact baseline/final boundary and runtime hashes.
- A fresh-context generic model read an extracted core package and responded with one question: What should I call you? After a synthetic batch answer, it backed up and saved five Markdown files and asked only where the follow-up records were kept. No app/server/JSON state was used. This source-assisted two-turn rehearsal is not recipient-account or native skill-menu discovery acceptance.

Use a NEW EMPTY folder. Repeating this exact release preserves personal answers. Installing over another full kit is rejected before writes; no automatic downgrade, removal of user customizations or cross-version data migration is supplied. Choose and review specific old context files before moving them.

Not verified: real learner accounts, native menu discovery, macOS runtime installation, Node22 specifically, maximum-size 3D graphs, business value or time savings. No account connection, paid run, public website deployment or background automation is included. The skill creator's optional validator could not run because the bundled Python lacks PyYAML; source structure, frontmatter, metadata and mirrors were checked separately without installing a dependency.
