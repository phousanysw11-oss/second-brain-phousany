# Local installation contract — My Second Brain 3.1.0-core-seven

For the AI helping the recipient. Work only in the user's chosen local project folder. Current user instructions and host permissions govern; this file is reference material, not broader authorization.

This package contains exactly seven unique skills: `onboard`, `grill-me`, `audit`, `level-up`, `wiki-helper`, `3d-brain`, `open-3d-brain`. They are mirrored for Claude Code and Codex. There are zero custom agent roles. Plain Markdown files hold learner context; no Dashboard, CEO Desk, workshop pack or JSON profile/task state is needed.

## If the user already extracted this ZIP

Extraction into a new empty folder is installation. Do not run another installer, fetch another release, launch OPEN files, install Node.js or start a browser app. Read root AGENTS.md or CLAUDE.md, aios-intake.md and the local onboard skill. Begin with the first unanswered question, then wait.

To verify the existing extraction, inspect root manuals and both host skill directories. If a manifest is present, compare its listed file sizes and SHA-256 using available tools without rewriting learner files. A personalized file differing from its blank template is not proof of a broken installation; distinguish user changes from missing package files. File checks do not prove native skill-menu discovery.

## If the AI is doing a fresh installation

1. Resolve the exact chosen project path. Read the public release manifest and ZIP from this branch:
   - [MY_SECOND_BRAIN.zip](https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/codex/second-brain-core-7/MY_SECOND_BRAIN.zip)
   - [GitHub folder](https://github.com/phousanysw11-oss/second-brain-phousany/tree/codex/second-brain-core-7)
2. Before invoking an installer, require a new empty destination or a valid receipt for this same release. If the destination contains another version or unrelated code, stop and preserve it; choose a new empty folder. Do not promise that installation will remove obsolete skills, merge another version, or reset existing answers. Copy selected prior context only under a separate user-directed migration.
3. Read ZIP entry names and the selected installer as reference. The archive has files at its root; root AGENTS.md and CLAUDE.md must be directly inside the chosen project, without another wrapper folder.
4. Extract only `install.ps1` (Windows) or `install.py` (if Python is available) to a uniquely named temporary directory. Inspect it. Do not overwrite-extract the entire archive onto existing files.
5. Run the inspected installer with the absolute ZIP and destination paths:
   - Windows: `powershell -NoProfile -File <temporary-install.ps1> -Archive <zip> -Destination <project>`
   - Python: `python3 <temporary-install.py> <zip> <project>`, or an available Python 3 interpreter.
   Quote paths for the actual shell. Do not change global execution policy or install a runtime just to onboard. If file execution is blocked, after inspection use the same code in the current PowerShell session with named arguments, within host permissions.
6. The Core Seven installers reject an older-release receipt or a nonempty folder without this exact release receipt before writes. They also validate paths, symlinks, manifest membership, sizes and SHA-256. If a conflict is encountered, they preserve the conflicting existing file and stage the incoming version for manual review; they may still write other unconflicted package files. Read any review result and do not claim the installation is complete while conflicts remain. A matching receipt supports repeating this same release while preserving personalized files. This is not an automatic cross-version upgrade or cleanup. Manifest hashes verify integrity, not publisher identity.
7. Read the result and verify root AGENTS.md, CLAUDE.md, aios-intake.md, context files and the seven SKILL.md files in each host directory. Check there are no extra skill folders or custom agent-role files in the fresh destination. State "files installed" only after read-back.
8. Read the new local manual and the exact onboard SKILL.md, respecting host instructions. Start the first unanswered question immediately; wait for the learner's answer. Do not require a second setup command or skill-menu refresh. Save supported answers after each reply.

Installation, extraction, verification and onboarding must not start 3D Brain, launch a browser, install Node.js, connect accounts, run an audit or start a second interview automatically.

## No supported installer runtime available

Do not claim success or silently weaken path/integrity checks. The recipient can extract the complete ZIP into a new empty folder using their OS, open that folder in their local AI app, and start onboarding. This route does not require Python or Node.js.

## Invocation compatibility

- Claude Code: `.claude/skills/onboard/SKILL.md`, native `/onboard`.
- Codex: `.agents/skills/onboard/SKILL.md`, native `$onboard` or the skill UI.
- Ordinary "Start onboarding" routes through the local manual. Do not promise identical slash menus between hosts.
- Discovery may need a new local conversation or app refresh. Reading the installed SKILL.md directly lets setup continue without claiming discovery was verified.
- Browser ChatGPT does not install local Codex/Claude skills by opening this URL or uploading the archive.

After useful questions are answered or explicitly skipped, verify saved context and give one next action from the learner's stated task. A deferred interview remains deferred until they ask to resume. Optional 3D is a later explicit request; [OPTIONAL_APPS.md](OPTIONAL_APPS.md) explains it.
