# Compact workshop handoff: one business, reproducible evidence

Write one immutable dated handoff per completed/partial stage. It is an artifact, not another
writable profile/task database. The local ledger links the report; browser learners save/download
it and upload it with sources when resuming. Do not claim that a chat can reopen unseen files.

The human-readable report should be useful by itself. The companion handoff can be Markdown
or JSON with these fields:
- schema_version: 2; course_version: 2026-10-08-four-workshops; workshop: WS1/WS2/WS3/WS4.
- business_id and business_name; fictional true/false; actual created_at if available.
- source register: id, accessible filename/path/URL, exact locator, observed date/version,
  period, currency/unit/definition where relevant, public/private classification.
- previous_artifacts: actual prior report/handoff references, workshop/version and review state.
- observations: ID, statement, kind (supported_observation/owner_statement/hypothesis),
  source_ids, source_locator details, limitations. A hypothesis is not upgraded on reuse.
- unknowns/contradictions; explicit excluded data and reasons.
- recommendation: proposed action, evidence IDs, trade-off, first step, measure and stop/change rule.
- execution_mode: single_assistant or native_delegation; actual review type and evidence.
- artifacts: report/evidence/website references that actually exist or actual downloadable attachment names.
- review_status: Draft/PARTIAL/Human reviewed; human report only if actually supplied.
- next_step: what can proceed, missing input, and any separate collection/spend/publication authorization.
- public_claims (WS3/WS4): claim, evidence IDs, owner-approved public status or qualification;
  confidential raw source data is excluded from the website.

WS2 also carries collection mode (APIFY_LIVE/OWNER_EXPORT/PUBLIC_PAGE/PLAN_ONLY), actual receipt,
included/excluded counts, sample limitations and theme-to-row IDs.
WS3 carries selected audience/job, three evidence dimensions, candidate status and untested assumptions.
WS4 carries site inventory, build/browser-test status, QA path and deployment NOT_DEPLOYED unless observed.

Do not fabricate hashes/tool IDs/Actor runs/retrieval times. Missing metadata stays unknown.
Human reviewed does not prove demand, complete accounting, deployment or financial results.
A partial prior stage may feed the next stage only with its limitations explicitly preserved.
For a standalone WS request, reconstruct only relevant missing upstream evidence from provided files.

