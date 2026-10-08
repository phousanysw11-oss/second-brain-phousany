> Historical optional reference. Current four-workshop runtime overrides numbering, storage, and execution. This is not a main-course workshop. Board = AI_BOARD; Desk = CEO_DESK; Hidden Signals = HIDDEN_SIGNALS. Browser users use explicit artifact export, not local CLI assumptions.

# Optional Hidden Signals

## Goal and default route
Use 20–30 deidentified customer messages/reviews/complaints already supplied by the
learner. Optional staff exit evidence stays separate. Read accessible exports/paste/photos
directly; do not make account or connector setup a prerequisite. Real business evidence
only. Public comments are unverified audience feedback, not automatically customers.

## Execute internally

1. Identify source, dates, actual count and three exact samples with IDs. Deduplicate
   repeated exports while preserving provenance. Count unique messages, not sentences or
   assumed unique people. Show inclusion/exclusion counts; preserve praise/no-issue,
   off-topic, empty/error/unclassifiable categories. Ask only about a source ambiguity that
   changes inclusion or meaning. Unclear screenshot text requires confirmation.
2. Assign one primary theme per included unique message. Secondary tags may be visible
   but cannot be summed as extra messages. Return up to five supported problems; fewer
   is fine. Show frequency n/N and two short literal quotes with source IDs where available.
   Preserve originals; any translation is labelled. State the denominator explicitly.
3. Rank by frequency descending. Use comparable documented money evidence for ties only;
   keep verified loss/refund, mentioned order value and unknown separate. Unknown money
   is not zero. Before each subtotal, list source IDs/amounts and recompute addends, counting
   unknowns. Without distinct order IDs, totals may repeat the same order and are only
   message-mentioned values, never unique-order exposure or lost revenue. Do not join
   messages to sales without shared stable order/customer IDs.
4. Link accessible WS1/WS2 facts only where evidence supports the relationship, not cause.
   This bounded sample does not prove the business complaint rate, representativeness or
   what leadership knows. Present leadership visibility as a question.
5. Propose one low-cost one-week fix: hypothesis anchored in quotes, action, scope,
   proposed owner, baseline needed, measure, proposed success threshold, stop rule and
   supplied budget cap or not set. A candidate is AI's proposal until the CEO chooses it.
   No revenue promise or accepted owner. Do not send or run the real experiment.
6. Produce HIDDEN_SIGNALS_Checked_Output: source/collection method/dates, inclusion counts, ranked
   themes, exact quote table, money limits, selected or proposed test, unknowns and state.
   Ask the learner to check three quotes/IDs, frequency counts and one money subtotal.

## Optional Apify collection, built in

Only when the learner requests fresh public collection and lacks usable evidence:
1. Ask for one business-authorized public Facebook post, TikTok video or Google Maps place
   URL. Do not search unrelated targets or invent URLs. Default state is PLAN ONLY.
2. Verify current exact Actor/input schema, account allowance, pricing, remaining included
   credits, and a enforceable run cap that prevents extra charges before starting. Plus
   does not include Apify charges. If no-extra-payment allowance cannot be verified, do
   not run. No billing setup, Actor rental, schedule, private cookie or token in chat.
3. Show the bounded plan (one URL, max 25 top-level items, cost evidence and cap). Run
   only after the owner explicitly approves that verified no-extra-payment operation.
4. Candidate Actors/fields, to reverify before a live run:
   - Facebook: apify/facebook-comments-scraper, startUrls=[{url:PUBLIC_POST_URL}],
     resultsLimit=25, includeNestedComments=false. Page URL is not a post. Do not enable
     separately billed date filters.
   - TikTok: clockworks/tiktok-comments-scraper, postURLs=[PUBLIC_VIDEO_URL],
     commentsPerPost=25, maxRepliesPerComment=0. Verify field support. Exclude errorCode
     rows and report them.
   - Maps: compass/google-maps-reviews-scraper, startUrls=[{url:PUBLIC_PLACE_URL}],
     maxReviews=25, reviewsSort=newest. Set limit explicitly; no broad-area search.
5. Execute at most one approved bounded run. After failure stop that route, retain error
   evidence and use manual fallback. Never interpret no records/access failure as no issue.
   Record actual run/dataset IDs, source URL, retrieval time, limits, count and usage.
6. Map only observed fields: message_id, platform, source_url, source_record_id,
   published_at, captured_at, text_original, rating_if_present, money_amount_if_explicit,
   currency, money_type, duplicate_of, included, exclusion_reason. Redact names/handles,
   avatars/contact details and irrelevant private content before Project use. No secret
   links. Then execute the analysis stages above with actual returned N, even below 25.

Fallback: redacted CSV, pasted comments with IDs/source/date, or owner-checked screenshots.
Label manual/export provenance. An uploaded export is not evidence of an Apify live test.
Do not require the learner to find another Skill or Prompt Pack for either route.

Official sources to verify when live collection is requested:
https://docs.apify.com/integrations/chatgpt
https://apify.com/apify/facebook-comments-scraper/input-schema
https://apify.com/clockworks/tiktok-comments-scraper/input-schema
https://apify.com/compass/google-maps-reviews-scraper/input-schema

Minimum by minute 30: three or fewer supported themes with quotes and one proposed fix.
Stretch: a second sample or compare periods with comparable coverage; don't keep collecting
to force a desired answer. Suggest a next step only when relevant; this is not a numbered workshop.
