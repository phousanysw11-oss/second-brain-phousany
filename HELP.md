# Installation and first-use help

Start with [README.md](README.md) and the single [installation message](INSTALL_MESSAGE.txt).
INSTALL.md is the canonical installation entry. The repository page is a source browser, not a second requirement.

## Existing installation

Use the same folder. The installer checks a manifest, preserves saved context and custom files, and stages conflicting shipped files outside active skill/role folders.
Exit 0 means files are ready; exit 2 means **needs_review**, not a completed upgrade. Read the report and incoming copies before merging.
See [preservation and recovery](INSTALL.md#preservation-and-recovery). Do not replace your folder with a fresh ZIP over existing data.

Resume onboarding from saved answers. A completed interview is not repeated. “Change onboarding to quick start” or “Do onboarding later” changes the route.
See [the mode guide](docs/ONBOARDING.md).

## Missing skill or team capability

Open a new local chat in the same folder. If a skill is not in the menu, say:

```text
Read this project's .agents/skills/onboard/SKILL.md in Codex, or .claude/skills/onboard/SKILL.md in Claude Code, and resume from saved answers.
```

Reading the method directly does not prove native skill discovery or independent agent dispatch.
Claude skill mirrors do not install native Claude agents. A browser-only ChatGPT conversation cannot install these local files into a local app.
Use available capabilities and report exact limits; do not invent team execution.

## Subscription and tools

Check the actual session before recommending an upgrade. The core interview/file workflows need an AI session with authorized local read/write access.
Public web research, local execution, APIFY, visual previews and independent agents are separate capabilities.
A plan label is not proof of any of them. Record only what was observed in this session; unknown remains unknown.

The optional local apps need Node.js 22+. If missing, use the file workflow and show the official installation route when useful.
APIFY requires the user's own supported connection and permission for any paid run. Available tools or credits do not authorize spending.
Never request passwords, tokens or card details in chat. Authentication belongs in the provider's secure sign-in flow.

## No network access

Obtain the matching [preview ZIP](https://github.com/phousanysw11-oss/second-brain-phousany/raw/refs/heads/codex/ceo-team-workshops/MY_SECOND_BRAIN.zip) with its matching bootstrap/checksum.
Tell the local AI: “Read INSTALL.md inside the ZIP, install it in this folder, verify it, then offer onboarding choices.”
Do not bypass checksum failure. Read [the offline route](INSTALL.md#offline-route).

## What verification means

Installation checks prove the tested files and preservation behavior. They do not prove workshop answer quality, private account access, learner acceptance or business results.
Review [observed tests](docs/TEST_REPORT.md). Native macOS installation and individual learner-account behavior remain separate tests.
