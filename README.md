# My Second Brain — Core Seven

**Version 3.1.0-core-seven.** A simple local folder for Claude Code or Codex, with **7 skills and 0 custom agent roles**. Start with a guided interview, one question at a time. Personal context and knowledge stay in Markdown files.

## Download, open, onboard

1. [Download MY_SECOND_BRAIN.zip](https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/codex/second-brain-core-7/MY_SECOND_BRAIN.zip).
2. Extract it into a **new empty folder**, such as `My Second Brain`. The files belong directly in that folder; avoid an extra nested copy.
3. Open that extracted folder as a local project in Codex, or as the working folder in Claude Code. Say:

```text
Start onboarding. Ask one question at a time, save my answers, and continue from anything already recorded.
```

**Extraction has already installed the package.** Do not install it again or open an app to begin. No Node.js, Git, plugin, API key, Dashboard or browser launcher is needed for onboarding. Use an already signed-in local AI app that can read and write this folder.

The AI asks one missing question and waits. You can say **skip**, **unknown**, or **later**. Saved answers are reused; a completed interview is not restarted. To return to a paused interview, say **Resume onboarding**.

## Let your AI install into an empty folder instead

If you have not extracted the ZIP, create and open a new empty local folder, then paste [INSTALL_MESSAGE.txt](INSTALL_MESSAGE.txt), or:

```text
Install My Second Brain Core Seven 3.1.0 into this empty local project. Read https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/codex/second-brain-core-7/INSTALL.md and follow its verified ZIP installation instructions. Preserve existing files. Then start onboarding one question at a time. Do not start any apps.
```

[INSTALL.md](INSTALL.md) is the detailed contract for the installing AI. This is the same package as the download above; the instruction link is only needed when the AI performs the extraction/install for you.

## Included skills

| Skill | What it helps with |
|---|---|
| onboard | Setup through one question at a time; save and resume answers. |
| grill-me | Examine an idea through a deeper interview. |
| audit | Check the Second Brain against actual evidence. |
| level-up | Improve one workflow or a verified gap. |
| wiki-helper | Save authorized sources or answer using the knowledge Wiki. |
| 3d-brain | Build or open a 3D knowledge map when requested. |
| open-3d-brain | Open or refresh an existing map when requested. |

These are the same seven skills in two host folders, not fourteen different skills. `agents/openai.yaml` contains skill metadata, not custom agent roles.

Use ordinary chat for actual work. You do not have to choose a skill or finish onboarding before asking for a specific task. **3D Brain is optional and opens only when you ask**; that separate feature needs Node.js 22+. See [OPTIONAL_APPS.md](OPTIONAL_APPS.md).

## Already have another version?

Keep the old folder and its answers. Extract this smaller kit into a new empty folder, then ask the AI to copy only the specific context, notes or Wiki sources you choose. It should inspect and back up before any merge. Installing this kit over a populated older folder does **not** automatically remove old skills or apps. The bundled installers support a fresh folder and repeating the same verified installation, not automatic migration of another version.

**ภาษาไทย:** ดาวน์โหลด ZIP → แตกในโฟลเดอร์ใหม่ → เปิดใน Codex หรือ Claude Code → พิมพ์ “เริ่ม onboarding ถามทีละคำถามและบันทึกคำตอบ” แล้วตอบทีละข้อ การเปิด 3D เป็นทางเลือกภายหลังเท่านั้น

[Help](HELP.md) · [GitHub folder](https://github.com/phousanysw11-oss/second-brain-phousany/tree/codex/second-brain-core-7) · [Sources and licenses](SOURCE_NOTICES.md)
