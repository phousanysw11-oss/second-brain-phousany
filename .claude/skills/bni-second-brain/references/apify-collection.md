# Apify collection contract
Answer in the user's language. Read this reference before any Apify operation. Default mode is PLAN ONLY until the business owner supplies an authorized public post/video/place URL and approves that bounded run. Do not search for arbitrary unrelated targets.
Use one source and 20-30 top-level text items for the core exercise. Confirm exact Actor, input schema, current account allowance, current pricing, remaining included credits and a run cap that prevents extra charges before starting. ChatGPT Plus does not include Apify charges. If you cannot prove the run stays within the approved no-extra-payment allowance, do not run it. Do not add billing, rent an Actor, enable a schedule or supply private cookies/tokens.
Candidates verified in official publisher documentation on 7 October 2026:
- Facebook comments: apify/facebook-comments-scraper. startUrls=[{url:OWNER_PUBLIC_POST_URL}], resultsLimit=25, includeNestedComments=false. Do not enable separately billed date filters. A Page URL is not a specific post.
- TikTok comments: clockworks/tiktok-comments-scraper. postURLs=[OWNER_PUBLIC_VIDEO_URL], commentsPerPost=25, maxRepliesPerComment=0. Exclude errorCode rows from evidence and record the failure. Check current field support before running.
- Google Maps reviews: compass/google-maps-reviews-scraper. startUrls=[{url:OWNER_PUBLIC_PLACE_URL}], maxReviews=25, reviewsSort=newest. The default maximum is very large; set 25 explicitly. Do not use a broad area search.
Do not invent URL values, IDs, run completion or cost. If an Actor returns fewer records, use the actual number. Stop after one failed run rather than looping. Keep dataset/run ID, retrieval time, source URL, input limits, returned count and actual usage evidence.
Map only observed output fields to message_id, platform, source_url, source_record_id, published_at, captured_at, text_original, rating_if_present, money_amount_if_explicit, currency, money_type, duplicate_of, included, exclusion_reason. Redact names, handles, avatars, contact details and irrelevant private content before sending to the learner Project. A row ID may point into the private raw export; do not expose a link containing a secret.
One primary theme per unique relevant message; comments are unverified audience feedback, not automatically customers. Preserve praise, off-topic and empty rows in exclusion counts. Do not treat an empty result or permission failure as evidence of no complaints. Use only the selected business's feedback.
Fallback: owner-provided redacted CSV, pasted comments with IDs/source/date, or screenshots whose text is checked by the owner. Label the collection manual, not Apify-tested. Never use Mekong Brew to fill a learner's missing evidence.
Sources:
https://docs.apify.com/integrations/chatgpt
https://apify.com/apify/facebook-comments-scraper/input-schema
https://apify.com/clockworks/tiktok-comments-scraper/input-schema
https://apify.com/compass/google-maps-reviews-scraper/input-schema
