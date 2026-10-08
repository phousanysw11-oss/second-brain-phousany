# WS2: Market X-Ray using Apify

## Outcome
Understand one target customer problem and the alternatives customers can choose.
Read WS1, profile and evidence limits. Apify is the preferred authorized collection route;
a labelled export/public-page fallback preserves access for a ChatGPT Plus learner.

## Internal prompt chain
**1. Frame.** State audience, geography, use case, known alternatives and the decision this
research informs. Include the status quo/do-nothing alternative. Ask one material gap.
Do not infer a country-wide market from a single post.

**2. Plan.** Follow [Apify collection](apify-collection.md). Save exact public targets,
Actor/build/schema if checked, question, supported date window, record cap, cost scope and
stop rule. Default core exercise: one relevant target, at most 25 top-level text items.
If the owner explicitly authorizes comparative collection, use up to two targets and 50 total.
Top/newest ordering can bias the sample. Plans and URLs are not collected evidence.

**3. Collect or fall back.** Run only after verified access, authorization and enforceable
cost scope. Preserve actual run/dataset ID, build, input, status, returned count and usage.
No supported integration/account/control -> learner runs in their account and supplies a
redacted export, or use existing redacted CSV/screenshots/public offer pages.
Modes: APIFY_LIVE, OWNER_EXPORT, PUBLIC_PAGE, PLAN_ONLY. Never claim Apify-tested for a manual
upload. Zero rows or permissions failure is not no complaints or no demand.

**4. Normalize.** One row per item: stable ID, target/source/date/text, optional rating,
inclusion/exclusion reason and duplicate linkage. Strip names/handles/contact details not
needed for analysis. Duplicate stable IDs may be excluded; identical text by different IDs
is not automatically duplicate. Retain praise/neutral/off-topic/blank/error counts.
Assign one primary theme per included message so totals reconcile. Secondary tags may overlap
and must say so. Denominator = included unique messages, not inferred customers.

**5. Interpret and compare.** Show short literal quote/row IDs, n/N, source distribution,
interpretation and alternative explanation for important themes. Compare actual competing
offer, price scope/currency/date, proof, service/delivery and unanswered customer questions.
Vendor claims remain vendor claims. Not found does not mean absent.
Engagement/reviews do not establish sales, willingness to pay, market size or representativeness.
Separate verified refund/loss, mentioned order value and unknown money; no causal ROI claim.

**6. Recommend and pass forward.** Deliver up to three supported hypotheses and one next
research/offer test, including what could disprove them. Pass observations and limitations
to WS3's company/customer/competitor comparison. Use [acceptance](workshop-2-acceptance.md).
Save/export report, deidentified evidence table, receipt and [handoff](handoff-contract.md).
No market data means PLAN_ONLY/PARTIAL, not a completed market conclusion.

## Output contract
Business/audience/geography/question; collection mode/receipt and actual source dates/caps;
row reconciliation; themes n/N with quote IDs; competitor/status-quo comparison with URLs;
observations vs hypotheses; sampling/access limits; recommended test and WS3 handoff.

