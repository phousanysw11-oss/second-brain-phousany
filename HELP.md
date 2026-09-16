# Second Brain Phousany

A personal Second Brain in a folder on your computer, for **Claude Code or Codex**.
Includes project skills, notes, a knowledge wiki, and optional Dashboard / 3D Brain.

## Start in three steps

1. Create a folder on your computer, for example **My Second Brain**.
2. Open that folder as your **local project in Codex**, or as your **working folder in Claude Code**. Use the chosen folder directly, not a cloud task or an isolated worktree.
3. Paste this message into the AI:

```text
Install https://github.com/phousanysw11-oss/second-brain-phousany into this local project folder. Follow its INSTALL.md, include all project skills, preserve my existing files, and verify setup. Then start onboarding one question at a time.
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

Onboard plus 13 supporting skills: grill-me, audit, level-up, 3d-brain, workspace-from-todos,
start-my-work, plan-my-day, finish-my-task, read-team-performance, wiki-helper, weekly-review,
open-3d-brain, and prioritize-work-four-factors. Both project skill folders are included.

Dashboard and 3D Brain are optional local apps; those need Node.js 22+.
Ask your AI to open them when needed. See [optional apps](OPTIONAL_APPS.md).
All personal files stay in your chosen folder unless you explicitly share them. Files you provide to your AI are processed under that AI provider's service; this is not an offline language model.

## If installation needs attention

- If a skill is missing from the menu, start a new session in the same folder; the direct-file message above also works.
- If the AI cannot open the GitHub page, it can fetch https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/main/INSTALL.md.
- If network access is unavailable, download [MY_SECOND_BRAIN.zip](https://github.com/phousanysw11-oss/second-brain-phousany/raw/refs/heads/main/MY_SECOND_BRAIN.zip), place it in your chosen folder, and tell the AI: “Read INSTALL.md inside this ZIP, install it here, verify it, then start onboarding.”
- Existing conflicting files are preserved. The AI identifies the conflict so you can choose a new empty folder or a specific merge. Repeating the same installer keeps saved answers.
- If the AI can only chat and cannot write local files, open the folder in local Claude Code or Codex first.

Maintainer details: [installation procedure](INSTALL.md), [sources and notices](SOURCE_NOTICES.md).
