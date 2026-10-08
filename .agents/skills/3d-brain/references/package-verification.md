# Package verification

Checked October 8, 2026, for the core seven release on Windows with Node.js 24.18.0 and headless Chrome. These are synthetic fixture checks, not a recipient account or conversational skill acceptance test.

## Automated checks

The scaffold package passed **13 check groups** with **188 fictional notes, five configured categories, and 545 connections**. One category was intentionally missing to verify an honest warning and zero count. Default discovery listed learner-local sources and omitted external assistant memories.

Checks covered config validation, local-only discovery, new-directory scaffolding and overwrite refusal, custom branding/categories, unique IDs, duplicate basenames, valid edge endpoints, relative-link targets, exact explicitly selected Codex topic sections, private-file exclusions, growth parent ordering and final positions, every note's HTTP readback, static/API path boundaries, Host/Origin rejection, and unchanged source files. Runtime startup required no npm installation.

The shipped saved app was also copied to an isolated learner fixture with its unchanged generic config. It read exactly **seven synthetic notes across five local Markdown categories** from context, work/notes, wiki, raw/references, and a skill note. Each source readback matched the fixture; unselected content stayed out. Both 3D skills have explicit-only invocation policies. The saved config contains no external memory or session-history source.

## Browser checks

A fictional Atlas Brain graph was inspected using the **exact saved app renderer** at desktop and 390-pixel widths. Ten browser/saved-app check groups passed. Search, note reading, a relative Markdown link opening Launch Plan, category solo/restore, inventory notices, and mobile Sources controls worked. Personalized branding appeared in the title and header.

Cinema growth was observed at **1, 21, and 188 notes**. The central orb was visible early; virtual drag and zoom preserved playback; completion offered Replay and replay returned to the beginning. Pause/resume and reduced-motion emulation worked. The checked flows produced no page errors, error-level console entries, or external requests.

A narrow follow-up corrected the status count after stopping a replay early. Six focused browser assertions passed across the saved and scaffold bundles: stopping restored the full **188-note** status, a solo-filtered replay restored **61 notes**, and restoring categories returned to 188, with no page errors. The scaffold also uses local font fallbacks and an inline icon to avoid unnecessary network dependencies. The existing Cinema, growth, and layout behavior was retained.

Final saved bundle SHA-256: `65dfc262a0d6e6b533cd6994d7d92e06c49ba1b751c3367ad79d3eb54fcdd4f3`. Final scaffold bundle SHA-256: `dcd9c611762b06662699d075a64c2b22b3bed369aefe99cc46bf815d9f2169ae`. The earlier full browser fixture used the saved bundle before the count correction; the final bundles received the targeted follow-up above.

## Limits

This verifies packaged runtimes and fictional fixtures on this host. A conversational skill run, recipient accounts, other operating systems, Node 22, and graphs at the configured maximum remain untested. Each learner's real source paths and category mappings still require the acceptance checklist. Screenshots, receipts, and fixtures remain local test artifacts outside this public package.
