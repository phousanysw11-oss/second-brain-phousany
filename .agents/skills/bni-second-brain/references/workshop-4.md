# WS4: Business website ready for Netlify Drop

## Outcome and inputs
Create actual static files from the learner's profile and WS3 Strategy Card, verify them,
and deliver a folder the owner can drag into Netlify Drop. Design for the learner's business,
not the kit author's brand. Use [the build prompt](website-build-prompt.md), filling it internally.

## Internal prompt chain
**1. Public brief.** Read profile/WS3 and extract public-safe facts/assets. Keep confidential
records and unvalidated market hypotheses out. Use supplied business name, audience, offer,
brand assets, evidence and contact path. No raw sales/customer files, internal source paths,
hidden notes or keys enter public code. Ask only a blocking fact; omit nonessential unknowns.

**2. Structure and copy.** One primary visitor task and CTA. Plan clear hero, actual offer,
supported benefits, how it works, useful FAQ and contact/footer. Include proof only when supplied.
No fake numbers, testimonials, badges, staff identities or stock imagery presented as actual
operations. Use verified supplied mailto/tel/contact links. A form without a working authorized
service must be absent or visibly disabled; no fake "sent" success.

**3. Build.** Deliver site/index.html plus local assets and optional styles.css/script.js.
Use UTF-8 semantic responsive HTML, accessible headings/focus/alt text and progressive enhancement.
Relative asset paths must survive a new host URL. The final folder has no required Node server,
backend, framework build step or environment variable. If using development tooling, deliver
its generated static output. Never invent canonical URLs/sitemaps before a final domain exists.
Use factual language/title/description metadata; respect asset licenses. Essential content works
without JavaScript. In local mode use work/ceo/website/<unique-run-id>/site/; browser mode creates
downloadable site folder/ZIP when file tools permit.

**4. Check.** Inspect mobile (~390px) and desktop (~1280px) when a browser exists. Check hierarchy,
overflow, links, images, keyboard focus, heading order, alt text, CTA and console. Validate each
local reference and public claim; scan deploy folder for private files. Test direct opening and
local HTTP preview when available. Fix material defects and rerun affected checks.
Unavailable browser means visual/interaction UNVERIFIED, not passed.

**5. Package.** Keep QA.md, public-claims.md, report and source annex OUTSIDE site/.
Deliver site/ plus a ZIP of its contents when supported, file inventory, preview and review record.
index.html is directly at the deploy folder root. Without file creation, return complete file
contents with exact filenames and saving instructions labelled MANUAL_ASSEMBLY_REQUIRED.
A prose plan or inaccessible attachment is not a completed folder.

**6. Handoff.** Explain: review files; sign into the owner's Netlify account if required;
open https://app.netlify.com/drop; drag site/; inspect the returned URL on mobile/desktop.
The owner controls account/cost/publication. Do not upload, connect a domain, enable lead forms
or analytics, or purchase services without explicit scope. Keep NOT_DEPLOYED until observed.
Use [acceptance](workshop-4-acceptance.md) and [handoff](handoff-contract.md).

## Output contract
Static files/folder + ZIP if supported; preview; inventory; public claim check; actual QA/limits;
Drop steps; BUILD_COMPLETE/PARTIAL/MANUAL_ASSEMBLY_REQUIRED; browser PASS/FAIL/UNVERIFIED;
deployment NOT_DEPLOYED unless observed. A website artifact does not prove customer conversion.

Official source: https://docs.netlify.com/deploy/create-deploys/#deploy-with-drag-and-drop
Documentation checked 2026-10-08; current account eligibility/limits require account verification.

