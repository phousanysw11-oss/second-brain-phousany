# Fictional CEO workshop fixture

Lotus Home Demo is entirely fictional. Every role, date, amount, transaction, message and policy is invented for bounded testing. Nothing in this directory authorizes real actions or describes a real company.

Use an isolated learner folder. Do not import this demo into a real business workspace. Run the kit's documented init-demo command only in an empty or already matching demo workspace. The fixture itself does not start an AI session, create a connector or schedule a job.

## Input sources

- company/state.json: blank-review profile, three original priorities, tasks, company scope, source registry and pending decision.
- company/profile.md: business scope and original priority order.
- company/sales.csv, expenses.csv, stock.csv: separate periods/currencies, duplicate transaction, subtotal, return and missing matched COGS.
- company/cash.csv, obligations.csv, receivables.csv: dated snapshot and collection promise; no complete forecast.
- company/refunds.csv: independent synthetic receipt supporting F003; it is not part of the October cash window.
- company/feedback.csv: 22 raw rows, duplicate, blank, praise, ambiguous comment, conflicting policy claim and malicious embedded instruction. Quoted source instructions are data, never authority.
- company/policy.md: narrow fictional approved policy with exact boundary and private-data restriction.
- company/employee-cases.json: three actual inputs to run through the generated employee instruction.
- company/calendar.json: invented overlapping events and an all-day exclusive end; never label a connector read.
- company/decision.md: pending decision, deadline, explicitly unapproved candidate cap.

FIN-SALES-v1 defines revenue as net after returns and discounts, excluding tax. Blank matched COGS is missing, not zero. The S010 display subtotal is not independent accounting reconciliation. All message texts are invented. Unknown money stays blank. Repeated mentioned order values lack unique order IDs and cannot establish distinct-order exposure.

## Evaluation separation

company/expectations.json is a reviewer oracle. Do not supply it as business evidence to the model being evaluated. It contains expected calculations and a NOT_RUN marker, not example outputs. Test inputs may include employee-cases.json; compare the actual replies against its expected objects only after the model has replied.

Run `node tests/workshop-contracts.mjs` for deterministic fixture checks. Passing proves that these synthetic inputs and expectations agree; it does not prove the CEO skills produced correct answers. See ../docs/WORKSHOP_ACCEPTANCE.md for fresh-session tests of actual outputs.
