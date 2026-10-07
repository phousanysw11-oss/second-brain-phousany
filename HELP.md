# Second Brain Phousany

A personal Second Brain in a folder on your computer, for **Claude Code or Codex**.
Includes project skills, notes, a knowledge wiki, and optional Dashboard / 3D Brain.

## CEO preview entry

Use **codex/ceo-team-workshops** for this preview. It includes **32 project skills per host** and **eight native Codex role files**; the curated CEO set has 20 capabilities and reuses two original skills. Start CEO work at [CEO_START_TH.md](CEO_START_TH.md), with [the installation message](INSTALL_MESSAGE.txt) and [observed test results](docs/TEST_REPORT.md).

Native Codex role discovery and model workshop execution remain **NOT TESTED** in this preview. A fresh nested session could not read local files because of its execution policy; its tool bridge did not expose named-role selection. Installed files alone do not establish native execution. Claude receives skill mirrors; this does not install native Claude agents. See [installation evidence](docs/evidence/install-summary.json).

The original Lao guides and HTML remain as historical starter material. For the revised CEO workflow, follow [CEO_START_TH.md](CEO_START_TH.md) and the current branch instructions below. CEO Desk and its state tools need an available Node.js runtime; initial Windows file installation and onboarding do not.

## Start in three steps

1. Create a folder on your computer, for example **My Second Brain**.
2. Open that folder as your **local project in Codex**, or as your **working folder in Claude Code**. Use the chosen folder directly, not a cloud task or an isolated worktree.
3. Paste this message into the AI:

```text
Install the CEO preview of https://github.com/phousanysw11-oss/second-brain-phousany/tree/codex/ceo-team-workshops into this local project folder. Read and follow https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/codex/ceo-team-workshops/INSTALL.md. Include its CEO team, workshops and all project skills. Preserve my saved answers, files and custom instructions; verify the install and report any upgrade conflicts. Then start or resume onboarding one question at a time.
```

The AI installs the files, checks them, then asks the first onboarding question.
Answer one question at a time. You can say **skip** or return later.
No manual copying of skills, GitHub account, plugin, API key, Node.js or Git is needed for core setup.
Your AI app must already be signed in and able to read/write the selected local folder and download the public package.

## Already installed? Start working

Open the same folder and say **Start onboarding** or **Resume onboarding**.
Claude Code: `/onboard`. Codex: `$onboard` (or choose the local onboard skill).
If it is not in the menu yet, use this in either app:

```text
Read this project's .agents/skills/onboard/SKILL.md (Codex) or .claude/skills/onboard/SKILL.md (Claude Code), then start or resume onboarding one question at a time.
```

After onboarding, ask **What should I work on first today, and why?**
You can also ask **Help me finish this task**, **Save this document into my wiki**, or **Review my week**.
Skills are already installed in the project; you do not need to memorize their names.

## เริ่มใช้ภาษาไทย

สร้างโฟลเดอร์ → เปิดโฟลเดอร์เป็นโปรเจกต์ใน Codex หรือ Claude Code → วางข้อความข้างบน
AI จะติดตั้งแล้วถามทีละข้อ ข้ามสิ่งที่ยังไม่รู้ได้ ครั้งต่อไปเปิดโฟลเดอร์เดิมแล้วบอก “เริ่ม onboarding” หรือ “ทำต่อจากครั้งก่อน”
เริ่มทำงานได้เลย ไม่ต้องเปิด Dashboard หรือเชื่อม Google Drive ก่อน

## What is included

All 14 original skills are retained, plus 18 CEO/workshop skills, for 32 skills in each project skill folder. The CEO capability catalog reuses prioritize-work-four-factors and weekly-review to make its curated set of 20. Read [the CEO catalog](docs/CEO_TEAM_CATALOG.md) for routing; the learner need not choose a role.

Dashboard and 3D Brain are optional local apps; those need Node.js 22+.
Ask your AI to open them when needed. See [optional apps](OPTIONAL_APPS.md).
All personal files stay in your chosen folder unless you explicitly share them. Files you provide to your AI are processed under that AI provider's service; this is not an offline language model.

## If installation needs attention

- If a skill is missing from the menu, start a new session in the same folder; the direct-file message above is the documented fallback; verify it in the recipient session before claiming success.
- If the AI cannot open the GitHub page, it can fetch https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/codex/ceo-team-workshops/INSTALL.md.
- If network access is unavailable, download [MY_SECOND_BRAIN.zip](https://github.com/phousanysw11-oss/second-brain-phousany/raw/refs/heads/codex/ceo-team-workshops/MY_SECOND_BRAIN.zip), place it in your chosen folder, and tell the AI: “Read INSTALL.md inside this ZIP, install it here, verify it, then start onboarding.”
- Existing custom files and saved answers are preserved. Modified shipped files are staged for review outside active role/skill folders; exit 2 means needs_review, not a completed upgrade. Use the exact report and incoming copies to review the merge. See [recovery details](INSTALL.md#preservation-and-recovery).
- If the AI can only chat and cannot write local files, open the folder in local Claude Code or Codex first.

Maintainer details: [installation procedure](INSTALL.md), [sources and notices](SOURCE_NOTICES.md).
