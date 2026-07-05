# ClaimGuard Business Plan

## Executive summary

ClaimGuard is a denial-prevention and appeal-operations SaaS for independent medical practices. The product scans high-value claims and prior authorization requests before submission, predicts payer-specific denial risk, assigns the missing documentation as work items, and produces appeal packets when a denial happens.

The wedge is intentionally narrow: specialty practices with expensive, documentation-heavy services such as cardiology imaging, orthopedic imaging, infusion therapy, home health, and sleep medicine. These practices feel the pain of payer automation but rarely have enterprise revenue-cycle teams or custom EHR integrations.

ClaimGuard starts as a lightweight workflow layer that works from structured forms and CSV exports, then expands into EHR/clearinghouse integrations and CMS prior-authorization API readiness.

## Market problem

Healthcare providers are losing margin to administrative claim review, denial rework, and prior authorization delays.

- Premier reported that claims adjudication cost providers $25.7B in 2023, a 23% increase from the prior year, and said 70% of denials were ultimately overturned only after costly review cycles.
- CMS finalized interoperability and prior authorization rules that require impacted payers to improve API-based access, report usage metrics, and support faster, more transparent prior authorization workflows.
- HFMA has emphasized that denial prevention depends on standardized categories, trend data, and root-cause workflows, not only post-denial firefighting.
- The American Hospital Association cited nearly 15% initial denial rates for private-payer claims and $19.7B spent by hospitals and health systems in 2022 trying to overturn denials.

Sources:
- Premier: https://premierinc.com/newsroom/policy/claims-adjudication-costs-providers-257-billion-18-billion-is-potentially-unnecessary-expense
- CMS final rule: https://www.cms.gov/initiatives/burden-reduction/overview/interoperability/policies-regulations/cms-interoperability-prior-authorization-final-rule-cms-0057-f
- HFMA denial metrics: https://www.hfma.org/guidance/standardizing-denial-metrics-revenue-cycle-benchmarking-process-improvement/
- AHA market scan: https://www.aha.org/aha-center-health-innovation-market-scan/2024-04-02-payer-denial-tactics-how-confront-20-billion-problem

## Customer and ICP

Primary ICP:
- Independent specialty practice groups with 5-75 providers.
- Monthly claim volume of 1,000-20,000 claims.
- High-value procedures where denials are financially material.
- Thin billing teams using EHR exports, clearinghouse portals, spreadsheets, and manual payer calls.

Economic buyer:
- Practice administrator, RCM manager, CFO, or physician-owner.

Daily users:
- Billing specialists, prior authorization coordinators, referral coordinators, and practice managers.

Beachhead specialties:
- Cardiology and cardiac imaging.
- Orthopedics and imaging-heavy musculoskeletal care.
- Infusion and biologics.
- Home health recertification.
- Sleep medicine.

## Solution

ClaimGuard has four product loops.

1. Pre-submission risk scan
   - User enters or imports payer, CPT, service, amount, deadline, and documentation notes.
   - ClaimGuard scores denial risk and identifies payer-specific missing evidence.
   - Risk is explainable: payer category, high-dollar exposure, missing evidence, deadline pressure.

2. Documentation work queue
   - Missing documentation becomes assigned work items.
   - Practice managers can see at-risk cases, owners, deadlines, expected revenue exposure, and status.
   - The app prioritizes claims with the highest risk-adjusted dollars.

3. Appeal packet builder
   - For denied claims, ClaimGuard generates the packet checklist: clinical notes, payer rule, coding rationale, timeline, physician attestation, and submission proof.
   - It tracks whether the packet is appeal-ready, submitted, or recovered.

4. Business intelligence
   - Admin dashboard shows denial-risk distribution, recovered revenue, bottlenecks, payer trends, and team throughput.
   - This becomes the renewal story: recovered revenue, fewer days in appeal, and cleaner first-pass claims.

## Product shipped in this arena build

The deployed demo includes:
- Landing page that explains the business and market wedge.
- Demo authentication with practice and admin accounts.
- Practice dashboard with live metrics, work queue, payer playbook, claim scanner, risk scoring, and status advancement.
- Admin dashboard with funnel metrics, business signals, recovered revenue, and the same live work queue.
- Local browser persistence using `localStorage`, so new cases and status changes survive refreshes in the demo environment.

## Competitive landscape

Competitor categories:

- Enterprise RCM platforms: Optum, Waystar, Experian Health, R1, FinThrive.
  - Strength: broad integrations and deep enterprise contracts.
  - Weakness: long implementation cycles and pricing/complexity mismatched to independent practices.

- Clearinghouses and EHR modules: Availity, Change Healthcare/Optum, athenahealth, eClinicalWorks modules.
  - Strength: already in workflow.
  - Weakness: often focus on eligibility/submission rather than payer-specific denial prevention and appeal orchestration.

- Services-led billing companies.
  - Strength: done-for-you operations.
  - Weakness: labor-intensive, opaque, and not a software-margin product.

ClaimGuard positioning:
- Lighter than enterprise RCM.
- More opinionated than spreadsheets.
- More prevention-oriented than denial cleanup services.
- Designed for fast implementation by practices that can export claims today.

## Business model

Pricing:
- Starter: $499/month per practice, includes 3 users and 1,000 scanned claims/month.
- Growth: $1,499/month, includes 15 users, 10,000 scanned claims/month, payer playbooks, CSV imports, and admin analytics.
- Performance add-on: 0.9% of recovered revenue above baseline, capped by contract.
- Implementation: $1,500 one-time onboarding for mapping payer/CPT workflows and historical denial categories.

Why this pricing works:
- If one high-value appeal is recovered each month, the software can pay for itself.
- The base subscription keeps revenue predictable.
- The performance fee aligns incentives without making the practice hand over full billing operations.

## Go-to-market

Phase 1: founder-led pilots
- Target 20 specialty practices in Texas, Arizona, Ohio, Florida, and California.
- Offer a 30-day denial-risk audit using exported claim and denial data.
- Convert audit into a paid pilot with ROI report.

Phase 2: channel partnerships
- Partner with boutique billing companies serving independent specialty practices.
- Give billing partners a white-label dashboard and revenue share.
- Use specialty societies, RCM consultants, and practice administrator communities as distribution.

Phase 3: integration-led expansion
- Add EHR/clearinghouse import connectors.
- Add payer API readiness modules as CMS interoperability requirements mature.
- Move from prevention workflow into automated packet generation and payer-specific analytics.

## Financial projections

Assumptions:
- Average subscription revenue per practice: $1,100/month in year 1, $1,650/month in year 2, $2,050/month in year 3.
- Implementation fee averages $1,000 net after discounts.
- Gross margin: 78% year 1, 83% year 2, 86% year 3.
- Logo churn: 16% year 1, 11% year 2, 8% year 3.

Year 1:
- 35 paying practices.
- Subscription ARR exiting year: $462K.
- Implementation revenue: $35K.
- Total recognized revenue estimate: $265K.

Year 2:
- 155 paying practices.
- Subscription ARR exiting year: $3.07M.
- Total recognized revenue estimate: $1.78M.

Year 3:
- 520 paying practices.
- Subscription ARR exiting year: $12.79M.
- Total recognized revenue estimate: $7.4M.

Long-term upside:
- 5,000 practices at $2,000/month is $120M ARR before performance revenue.
- The category can expand into payer scorecards, outsourced appeal networks, and embedded financing for delayed reimbursements.

## Roadmap

0-30 days:
- Harden auth and multi-tenant database.
- Add CSV import/export and audit trail.
- Add denial category taxonomy based on HFMA-style definitions.

31-90 days:
- Pilot with 5-10 specialty practices.
- Add appeal packet PDF generation.
- Add payer-specific templates for top five payer/service combinations.
- Build ROI report and monthly executive summary.

3-6 months:
- Integrate with clearinghouse exports.
- Add team assignments, SLA notifications, and document checklist completion.
- Add analytics by payer, CPT, physician, and denial category.

6-12 months:
- EHR integrations for top beachhead systems.
- Prior authorization API readiness module.
- AI-assisted clinical letter drafting with human approval and compliance controls.

## Risks and mitigations

Risk: EHR integration friction.
Mitigation: start with CSV/export workflows and high-value manual queues.

Risk: Complex healthcare compliance.
Mitigation: begin as workflow software without storing unnecessary PHI in the MVP; add BAA, audit logs, and access controls before production pilots.

Risk: Enterprise incumbents copy features.
Mitigation: win on specialty-specific templates, speed, and independent-practice affordability.

Risk: Denial rules change by payer.
Mitigation: maintain a payer playbook library updated from customer outcomes and public policy updates.

## Why now

Payers are automating review and prior authorization, providers are reporting higher administrative cost, and CMS rules are pushing the ecosystem toward more transparent, API-enabled prior authorization. Independent practices need a practical bridge now: a product that works with exports and staff workflows today, then becomes the integration layer tomorrow.

## Demo credentials

- Practice dashboard: practice@claimguard.demo / DemoPass!2026
- Admin dashboard: admin@claimguard.demo / AdminPass!2026
