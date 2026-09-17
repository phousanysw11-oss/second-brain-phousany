# Install Second Brain Phousany

For the AI responding to the user's request to install this kit into their selected local folder.
These are scoped setup instructions, not permission to change unrelated settings or publish user data.

## Finish setup, then start the interview

1. Resolve the actual absolute local project folder. Use that folder directly: no extra MY_SECOND_BRAIN subfolder, no global skill installation, no clone/worktree instead of the folder the user opened. If the host has no local filesystem access, explain that dependency rather than claim installation.
2. Fetch the appropriate installer below into a uniquely named system temporary directory. Read it before running. Network access follows the host's permissions. Do not pipe an unseen web response into a shell or change execution policy.
3. Windows: fetch `https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/main/scripts/install-from-github.ps1`. Run in PowerShell with `-Destination` set to the absolute chosen project folder. If script-file execution is restricted, after reading the file invoke its contents in the current PowerShell session as a script block, with the same named argument. Example pattern: `& ([scriptblock]::Create([IO.File]::ReadAllText($installerPath))) -Destination $projectPath`. Quote paths correctly; the user does not need to type commands.
4. macOS/Linux: fetch `https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/main/scripts/install-from-github.sh`. After reading it, run `/bin/bash "$installerPath" "$projectPath"`. macOS uses built-in shell/curl/unzip/SHA tools; no Python or Node install is required. The second optional argument is a local ZIP path for offline installation.
5. The installers download the exact package below, check its SHA-256 before extraction, and preserve existing files. Do not clone a repo over the folder, install dependencies, launch servers, change global settings, or connect external accounts to begin onboarding. A checksum failure requires a matching installer/package, never disabling the check.
6. A fresh install validates every file. Repeating the same version preserves personal edits; missing files require repair. A differing existing file stops before writes; leave it intact and report the exact path. Ask for a new folder or specific merge direction only for that real conflict. Do not infer that silence approves replacement.
7. Read back root `AGENTS.md`, `CLAUDE.md`, `aios-intake.md`, `data/state.json`, and the two project skill folders. Expected: **14 skills in each**, including `.agents/skills/onboard/SKILL.md` and `.claude/skills/onboard/SKILL.md`. Core work needs no Node; app runtime checks are optional.
8. Read the installed local manual and the appropriate onboard SKILL.md directly in this same conversation. Apply them within the host's instruction hierarchy. Begin with the first unanswered topic immediately; do not ask the user to approve onboarding again. Do not answer questions on their behalf or continue interviewing without their reply.
9. Show only “Installed in [actual folder]. Let's set it up.” and the first question, in the user's language. Save each answer locally as the skill specifies. Do not claim native menu discovery was tested simply because files exist.

Claude Code uses `/onboard`; Codex supports explicit `$onboard` / local skill selection. Plain language plus reading the exact local file works when discovery has not refreshed. If needed, reopen a session in the same folder. Never promise a native Codex `/onboard` slash command.

## Offline ZIP route

The root `install.ps1` inside MY_SECOND_BRAIN.zip is the local archive installer (not the web bootstrap).
Read the ZIP's INSTALL.md, inspect and extract only its `install.ps1` into temporary storage, then run it with `-Archive <zip>` and `-Destination <folder>`. Python users can similarly use the bundled `install.py` with archive and folder arguments. Both validate manifest paths and hashes before any writes.
For macOS, save this repository's scripts/install-from-github.sh alongside the ZIP, inspect it, then run it with destination and ZIP arguments as in step 4.

## Exact release

- Package: `https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/main/MY_SECOND_BRAIN.zip`
- Version: 3.0.1
- SHA-256: `30b00c7da5a40ef93a402d3fbf87068dc47b116e8d969cecc80ac486e175f9b8`
- Bootstrap checks detect a version mismatch even if the branch changes. Checksums establish file integrity, not an independent publisher signature.

## What success means

Files verified in the chosen folder; both project skill trees installed; the AI has read the local onboard skill and asked one real question. Onboarding is complete only after the user's answers/skips are saved and verified. A fresh native skill-menu invocation is a separate recipient-side check.

Official references checked 2026-09-16: [Codex skills](https://learn.chatgpt.com/docs/build-skills) and [Claude Code skills](https://code.claude.com/docs/en/skills).
