# My Second Brain: saved local app

This app is optional. Installation and onboarding do not start it or check Node.js. Open it only when the learner explicitly requests 3D Brain. Reuse this saved app and `brain.config.json`; its root is this learner workspace. Default local URL: http://127.0.0.1:4782 .

From the learner workspace root, run `node apps/3d-brain/serve.mjs --port 4782`. This starts only the 3D server; open its printed localhost link when ready. First check whether the saved local graph endpoint is already responding; do not start a duplicate or stop another app on this port. Node.js 22 or newer is required only for this optional app; no npm installation is needed. Preserve the config and use its saved port if it has been changed. The default sources are local context, work/notes, wiki, raw/references and .agents/skills. No external memory or session-history source is selected.

Use search, open a note, follow its actual source, and use Rebuild after saving new knowledge. The initial nodes are starter method notes and skills, not completed learner business work. Keep all companion files and THIRD-PARTY-NOTICES.txt.
