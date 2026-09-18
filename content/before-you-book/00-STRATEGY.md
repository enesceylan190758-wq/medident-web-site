# MediDent İstanbul — "Before You Book" Trust Cluster
Decision-stage SEO architecture for EN market (UK / IE / US / EU expats)
Prepared: 16 Sep 2026

---

## 1. The strategic read

Every one of the five target queries is a **doubt query**. The searcher has already
decided Turkey is cheap. What they have not decided is whether they will be a victim.

Current SERP reality (checked Sep 2026):

| Query theme | Who ranks now | Weakness to attack |
|---|---|---|
| "is dental treatment in turkey safe" | ~10 Turkish clinic blogs, all answering "Yes! Choose us" | Zero verifiable evidence, no named author, no downside admitted |
| "turkey dentist red flags" | Turkish clinics writing about *other* Turkish clinics | Generic listicles, no checklist tool, no proof they pass their own test |
| "dental treatment abroad second opinion" | UK clinics selling fear + a few facilitators | Nobody offers a real, free, no-obligation clinical second opinion from a Turkish side |
| "aftercare after turkey teeth" | **UK clinics** (southkenmd, jonniesmiles) — hostile territory | Turkish clinics have essentially ceded this query |
| "check my turkey dental quote" | Almost nobody. Near-empty SERP | Pure whitespace — first mover takes it |

**The gap is not more content. It is the only honest page in a category of sales pages.**

A page that says "here is when you should NOT come to Turkey" outranks and out-converts
ten pages that say "Turkey is safe". It is also the only defensible position: competitors
with 261 blog posts (Dentatur) can out-publish us, but they will not publish a page that
tells a patient to stay home.

### Positioning statement for the whole cluster
> We will review your quote from any clinic — including ours — and tell you in writing
> what is wrong with it. If the answer is that you should not do this treatment, we will
> say so.

This is the *product*, not the copy. The copy only describes it. Do not publish the
cluster unless the clinic will actually honour it (see §7).

---

## 2. Architecture — hub + 10 spokes

New directory: `/en/before-you-book/`
Kept separate from `/en/blog/` (commercial-informational, not news) and from `/en/geo/`
(which already carries a thin-content risk — do **not** add these pages there).

```
/en/before-you-book/                                  ← HUB
├── is-dental-treatment-in-turkey-safe/               ← S1  head term
├── check-my-turkey-dental-quote/                     ← S2  money page / lead magnet
├── turkey-dentist-red-flags/                         ← S3  checklist
├── how-to-verify-a-turkish-dental-clinic/            ← S4  proof / verification
├── dental-treatment-abroad-second-opinion/           ← S5  service page
├── aftercare-after-turkey-teeth/                     ← S6  reclaim UK-held SERP
├── turkey-teeth-gone-wrong/                          ← S7  risk + revision
├── crowns-vs-veneers-what-you-actually-need/         ← S8  over-treatment / consent
├── guarantee-and-what-happens-if-something-fails/    ← S9  warranty terms
├── questions-to-ask-before-you-pay-a-deposit/        ← S10 printable 21 questions
└── when-you-should-not-come-to-turkey/               ← S11 the credibility anchor
```

11 pages. S11 is the page that makes the other ten believable. It is not optional.

### Keyword → page map

| Page | Primary | Secondary / entities |
|---|---|---|
| HUB | dental treatment in turkey guide, before booking dental turkey | turkey dental tourism checklist |
| S1 | is dental treatment in turkey safe, is it safe to get dental work in turkey | turkey dental safety, dental tourism turkey risks |
| S2 | check my turkey dental quote, turkey dental quote review, is my dental quote in turkey fair | dental quote second opinion turkey, turkey dental price check |
| S3 | turkey dentist red flags, dental clinic red flags turkey, turkey dental scam signs | how to avoid dental tourism scams turkey |
| S4 | how to verify a turkish dental clinic, check turkish dentist credentials | health tourism authorisation certificate, verify dentist turkey |
| S5 | dental treatment abroad second opinion, free dental second opinion online | second opinion turkey dental plan |
| S6 | aftercare after turkey teeth, turkey teeth aftercare uk dentist | follow up after dental treatment in turkey |
| S7 | turkey teeth gone wrong, failed dental work turkey, turkey teeth regret | fixing turkey teeth, revision treatment |
| S8 | do i need crowns or veneers, tooth shaving turkey teeth, are my teeth being filed down | minimally invasive veneers turkey |
| S9 | turkey dental guarantee, dental warranty turkey, what if my crowns fail turkey | dental implant guarantee turkey |
| S10 | questions to ask dental clinic turkey, before paying deposit dental turkey | dental tourism checklist pdf |
| S11 | should i get dental work in turkey, when not to go to turkey for teeth | dental tourism not suitable |

### Internal linking rules
- Every spoke links **up** to the hub once (breadcrumb) and **sideways** to exactly 3–4
  siblings, in body prose, with descriptive anchors. No 11-link footer blocks.
- Every spoke has one conversion link to **S2** (quote check) — the cluster's single CTA.
- Existing money pages (`/en/turkey-teeth-price`, `/en/hizmetler/implantoloji-implant-tedavisi/`,
  `/en/doktorlar/`) link **down** into S1 and S2 from a "Not sure yet?" module.
- Do not link the cluster from the homepage nav until S1–S3 are indexed and stable
  (~3 weeks), to avoid diluting the current homepage signal.

---

## 3. E-E-A-T: the signature model

Google will not reward a YMYL safety page written by "the MediDent team".
Three layers, in order of cost:

**Layer 1 — Named clinical reviewer (mandatory, week 1).**
Every page carries a byline block:
> *Clinically reviewed by Dr. {Name}, DDS — Specialist in {field}, {registration no.},
> Turkish Dental Association. Last reviewed: {date}.*
Use the three dentists already published at `/en/doktorlar/`. Each reviewer profile page
must exist, be indexable, and carry `Person` + `sameAs` (LinkedIn, TDB registry, PubMed
if applicable). **Do not use a name that is not a real, contracted clinician** — a
fabricated name on a safety page is the single highest-risk thing in this project.

**Layer 2 — Academic co-signature (target: week 4–8).**
Commission a named academic (Prof. Dr. / Doç. Dr. from a Turkish dental faculty —
prosthodontics or oral surgery) to review and co-sign S1, S7, S8 and S9 specifically.
Terms to agree in writing before use: scope of review, right to edit, annual re-review,
right to withdraw. Pay for it. A one-line "reviewed by Prof. X" with a link to their
faculty page is worth more than 20 blog posts.
If no academic will sign, **do not fake this layer** — Layer 1 alone still wins the SERP.

**Layer 3 — Institutional proof (ongoing).**
Ministry of Health International Health Tourism Authorisation certificate number,
displayed as a number, with a link to the government verification directory at
`healthturkiye.gov.tr/certificated-health-service-providers` so the reader can check us.
Implant and material brands with lot/traceability. Nobody in this SERP does this.

### Author schema on every page
`Article` + `author` (Person) + `reviewedBy` (Person) + `publisher` (Dentist/MedicalClinic)
+ `dateModified`. See each page file for the JSON-LD block.

---

## 4. Page-level technical spec (applies to all 11)

- Static HTML, matching existing build. One `<h1>`, semantic `<h2>`/`<h3>`.
- `<title>` ≤ 60 chars, meta description ≤ 155, both written per page (see page files).
- Canonical self-referencing. `hreflang` to TR/DE/FR/AR/RU **only once those translations
  exist** — an hreflang pointing at a missing page is worse than none.
- Schema per page: `BreadcrumbList` + `Article` + `FAQPage` (max 6 Q, only questions
  genuinely answered on-page).
- S2 and S5 additionally: `Service` + `Offer` (price 0 / free review).
- S10 additionally: `HowTo`.
- Answer-first format: the H1 question is answered in the first 40 words, in a short
  paragraph, before any preamble. This is what gets pulled into AI Overviews and LLM
  answers — which is where this audience increasingly researches.
- No stock smile photos. Use: certificate scans, real clinic photos, the reviewer's
  photo, annotated quote screenshots (redacted).
- Page weight target < 400 KB. Mobile LCP < 2.0 s — this audience is 70%+ mobile.
- Every page gets `tracking.js` events already in place; add a `quote_check_start` and
  `quote_check_submit` event on S2.

---

## 5. Publishing order (do not publish all 11 at once)

| Week | Publish | Why |
|---|---|---|
| 1 | HUB, S1, S2 | Establish the cluster root + the money page first |
| 2 | S3, S4 | Checklist + proof; these two make S1 credible |
| 3 | S6, S7 | Reclaim the UK-held aftercare/gone-wrong SERPs |
| 4 | S5, S9 | Service + warranty, once traffic exists to convert |
| 5 | S8, S10, S11 | Depth + the credibility anchor |

Two pages a week, each human-reviewed before merge — consistent with the existing
one-task-at-a-time workflow. Rushing 11 pages live in one day on a 5-year-old domain
in a YMYL niche is a spam signal.

---

## 6. Measurement

- GSC: track the 12 primary keywords as a saved query group; expect first impressions
  at week 3–4, meaningful position at week 8–12.
- GA4: `quote_check_submit` is the only KPI that matters. Target: 1 quote review per
  60 cluster sessions by month 3.
- Lead quality tell: the first US lead (11 Sep) came from a price page with a request no
  form option matched. Add a free-text "describe your situation" field to the S2 form —
  the decision-stage audience does not fit dropdowns.
- Watch S7 ("gone wrong") for negative-intent traffic that never converts. If after 90
  days it brings volume and zero leads, keep it for topical authority, do not expand it.

---

## 7. Preconditions — do not publish without these

1. The free quote review is **actually delivered**, in writing, within a stated SLA
   (recommend 48 h), by a named dentist, on any clinic's quote.
2. The guarantee terms on S9 match what the clinic will actually honour, in writing.
   Publishing a warranty the clinic won't pay out is a legal and reputational liability.
3. Every named reviewer is real and has consented.
4. The Ministry of Health certificate number shown is the clinic's own and current.
5. Legal/UK: avoid claiming or implying UK regulatory status; be explicit that Turkish
   clinicians are regulated in Türkiye, not by the GDC. See the disclaimer block in S1.

---

## 8. Files in this delivery

`pages/00-hub.md` … `pages/11-when-not-to-come.md` — each contains: URL, title, meta,
full publish-ready English body copy, FAQ block, JSON-LD, and internal-link instructions.
Placeholders in `{{curly braces}}` are clinic data that must be filled by MediDent before
publication — they are deliberately left blank rather than invented.
