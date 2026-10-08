# Use this course with ChatGPT Plus

ChatGPT Plus is the course baseline; Pro is not required by these materials.
OpenAI lists Plus at $20/month, with file analysis and limits that may vary; API usage is billed separately. See [the official Plus guide](https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus).
Use the route that fits your app. Codex is included with Plus through ChatGPT sign-in, but availability and usage limits still apply. See [using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan). These sources were checked on 2026-10-08; account-specific limits require a live check.

## Route A: Plus with a local Codex project

Use the signed-in Codex app, open the folder you chose, and paste [INSTALL_MESSAGE.txt](../INSTALL_MESSAGE.txt).
The one INSTALL.md URL locates the package and installer. After file verification, choose quick, guided, use-my-files or later onboarding.
Work is saved in the local folder; optional Desk and 3D Brain need Node.js 22+.

The package contains role files, but discovery and actual independent dispatch must be verified in your session.
Extra agents consume additional tokens; use one coordinator for simple work and delegate only when it helps. See [OpenAI's subagent guidance](https://learn.chatgpt.com/docs/agent-configuration/subagents).
Do not treat local files, model labels or subscription names as proof that agents ran.

## Route B: ChatGPT in the browser

Start one chat, upload or paste [BROWSER_STARTER.md](BROWSER_STARTER.md), and say “Start my business Second Brain”.
Choose onboarding, then provide only the business files needed for the selected workshop. Reuse that chat and its compact handoff for later workshops.
If you use a ChatGPT Project, you may keep the starter and handoff there; the workflow also works as a manual chat/file process.

This route uses ordinary instructions and files. It does not install local skills, execute a GitHub installer, discover TOML roles, or synchronize a folder.
The assistant checks whether file reading, analysis, web research and downloadable outputs are actually available.
If a capability is missing, it gives the exact manual handoff instead of claiming completion.

Use one model to analyze and review unless actual independent tools exist; label this “single-model review”.
For APIFY, prepare the collection specification first. Run it only through an available authorized connection or your own APIFY interface with an approved limit, then upload the real export.
APIFY availability and charges are separate from ChatGPT Plus.

At the end of each workshop, ask for the result and updated HANDOFF.md. Download them and keep the underlying sources.
If file export is unavailable, copy the provided Markdown into those named files yourself; the assistant must label local saving unverified.
A new chat needs the latest handoff, selected result and relevant raw sources. A summary alone is insufficient to recheck financial calculations or source quotes.

For WS4, the output is a reviewable static website folder with index.html at its root, local assets and a checklist.
If the browser session cannot create a downloadable archive, the assistant can provide complete files and exact manual save instructions, but must call the drag-and-drop package incomplete until files are assembled and checked.
Open and check it locally before you choose to publish with Netlify Drop. A generated website does not authorize publication or prove demand.

## Keep the cost and evidence honest

Ask the assistant to reuse saved context, process only relevant sources and avoid unnecessary agent runs.
Do not assume unlimited uploads, context, research or credits; check the current account when a limit affects the work.
Use secure sign-in for connections. Never paste API keys, passwords or payment details into chat.

The guides and local package tests do not prove browser learner-account acceptance. Test the actual account's chosen route and record its limits.
