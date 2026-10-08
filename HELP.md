# Using My Second Brain — Core Seven

## First use

[Download the ZIP](https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/codex/second-brain-core-7/MY_SECOND_BRAIN.zip), extract into a new empty folder, and open that folder in local Codex or Claude Code. Say **Start onboarding. Ask one question at a time.**

Extraction already installed the package. Do not install again. You do not need Node.js, a browser app, Git, a plugin or a new account connection to answer the first question. Your local AI app must already be signed in and able to read/write this folder.

Onboarding saves answers in [aios-intake.md](aios-intake.md) and corresponding Markdown context. The AI reads saved answers before asking another question. Say **skip** or **unknown** for a missing item, **later** to pause, and **Resume onboarding** to return. A completed interview is reused, not restarted.

**ภาษาไทย:** แตก ZIP ในโฟลเดอร์ใหม่ → เปิดโฟลเดอร์นั้นใน Codex หรือ Claude Code → พิมพ์ “เริ่ม onboarding ถามทีละคำถามและบันทึกคำตอบ” ไม่ต้องเปิด 3D ก่อน

## Skill menu missing?

Say **Start onboarding**. Or use the exact file:

```text
Read this project's .agents/skills/onboard/SKILL.md in Codex, or .claude/skills/onboard/SKILL.md in Claude Code. Read aios-intake.md, reuse saved answers, and ask only the next unanswered question.
```

Claude Code uses `/onboard`; Codex uses `$onboard` or its skill menu. A new session in the same folder may refresh discovery. File presence alone is not proof the client menu has loaded a skill.

## After onboarding

Talk normally: "Help me think through this decision", "Save this source into my Wiki", or "Check my Second Brain". There is no required sequence of seven skills. A specific work request can proceed even when an interview is paused.

Seven skills are included: onboard, grill-me, audit, level-up, wiki-helper, 3d-brain and open-3d-brain. Host copies do not double the count; there are no custom agent roles.

## Optional 3D Brain

Say **Open my 3D Brain** or **Build my 3D Brain** only when you want the visual map. This feature needs Node.js 22+. If no suitable Node runtime exists, the AI should explain the dependency and follow your permission rules before installing anything. [OPTIONAL_APPS.md](OPTIONAL_APPS.md) describes the feature.

## Keeping previous answers

Keep your earlier folder. Use a new empty folder for this smaller version. Ask the AI to copy only the context or knowledge you choose, after inspection and backups. Repeating this release's installer preserves its saved answers; installing over a different version does not remove old skills or apps automatically.

If the AI can only chat and cannot write local files, use a local Codex or Claude Code project first. In browser ChatGPT, uploaded files are reference material and do not install local skills.

Files stay in the chosen folder unless shared or used through an authorized connection. Files supplied to your AI are processed under its provider's service; this is not an offline language model.

[README.md](README.md) · [Installation contract](INSTALL.md) · [Sources](SOURCE_NOTICES.md)
