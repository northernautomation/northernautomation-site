# Northern Automation — Website Scaling Audit
**Prepared by:** George (AI Operator)
**Date:** 2026-03-12
**Scope:** Full site review for scaling readiness — copy, SEO, pricing, CTAs, technical issues

---

## CRITICAL: CHECKOUT IS BROKEN (Revenue Blocker)

The **entire checkout flow is down**. Both "Get Started" buttons on the website return `{"message":"Workflow execution failed"}`.

**Root cause:** The docker-compose.yml references **inactive** Stripe price IDs from the old $397/$3,997 pricing. New prices at $197/$1,997 were created in Stripe (with 14-day trials) but the n8n environment variables were never updated.

| What | Old (inactive, in docker-compose) | New (active, in Stripe) |
|------|----------------------------------|------------------------|
| Monthly | `price_1T9HEHJTca2OwiKBkz1l2TFI` ($397) | `price_1TA7N4JTca2OwiKBDA7wa1YF` ($197) |
| Annual | `price_1T9HEIJTca2OwiKBCwOmfPtw` ($3,997) | `price_1TA7NCJTca2OwiKBZKvDinFS` ($1,997) |

**The website also still displays the old $397/$3,997 pricing.**

This needs to be fixed across three places: docker-compose.yml, index.html, and hvac-demo.html.

---

## FILE INVENTORY

| File | Purpose | Status |
|------|---------|--------|
| `index.html` | Homepage — hero, features, how-it-works, pricing, footer | Needs updates |
| `hvac-demo.html` | Demo video page with CTA | Needs updates |
| `success.html` | Post-checkout confirmation | Minor issues |
| `privacy.html` | Privacy policy | Unstyled, thin |
| `terms.html` | Terms of service | Unstyled, thin |
| `404.html` | Error page | Unstyled, bare |
| `robots.txt` | Search crawler rules | OK |
| `sitemap.xml` | Sitemap | Incomplete |
| `_headers` | Cloudflare Pages security headers | Minor CSP issue |

---

## PRICING & CTA ISSUES

### 1. Website shows wrong pricing (HIGH)
- **index.html** shows $397/mo and $3,997/yr
- **hvac-demo.html** CTA button says "Start Free Trial — $397/mo"
- Stripe has $197/mo and $1,997/yr as the live active prices
- **Fix:** Update all pricing references to $197/mo and $1,997/yr

### 2. Annual savings math is wrong (MEDIUM)
- Site says "Save $567 vs monthly" on the annual card
- At $397 pricing: actual savings = $767 (12×397 - 3,997)
- At new $197 pricing: actual savings = $367 (12×197 - 1,997)
- **Fix:** Update to "Save $367/year" when new pricing goes live

### 3. Trial period mismatch (MEDIUM)
- Website says "30-day free trial" in 6 places (hero, pricing cards, hvac-demo CTA, hvac-demo note)
- Stripe prices are configured with **14-day trials** (matching pricing analysis recommendation)
- **Fix:** Change all "30-day" references to "14-day"

### 4. hvac-demo.html only offers monthly (LOW-MEDIUM)
- The CTA section only has one checkout button (monthly)
- No way to choose annual from the demo page
- The nav CTA also hardcodes monthly only
- **Fix:** Add annual option or link to homepage pricing section

---

## SEO ISSUES

### 5. No Open Graph tags on any page (HIGH for sharing)
- Zero OG tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Zero Twitter Card tags
- When someone shares the site on Facebook, LinkedIn, or Twitter, it will look terrible — no image, possibly wrong title/description
- **Fix:** Add OG + Twitter Card meta tags to index.html and hvac-demo.html at minimum

### 6. No canonical URL tags (MEDIUM)
- No `<link rel="canonical">` on any page
- Risks duplicate content issues if the site is accessible with and without trailing slashes, www, etc.
- **Fix:** Add canonical tags to all pages

### 7. Sitemap only lists homepage (MEDIUM)
- `sitemap.xml` has one entry: the homepage
- Missing: `/hvac-demo`, `/privacy.html`, `/terms.html`
- Missing: `<lastmod>` dates
- **Fix:** Add all public pages with lastmod dates

### 8. No structured data / Schema.org markup (MEDIUM)
- No JSON-LD for LocalBusiness, Organization, Product, or FAQ
- Missing opportunity for rich search results
- **Fix:** Add Organization + Product schema at minimum

### 9. No favicon (MEDIUM)
- `favicon.ico` returns 404
- No `<link rel="icon">` tags in any HTML file
- Looks unprofessional in browser tabs and bookmarks
- **Fix:** Create and add a favicon

### 10. Thin page content (LOW-MEDIUM)
- Homepage: ~359 visible words
- hvac-demo: ~92 visible words
- For SEO, Google prefers pages with 500-1500+ words of useful content
- **Fix:** Consider adding a FAQ section, testimonials (even placeholder), or "What you get" expanded section. A blog would help long-term.

---

## COPY & MESSAGING ISSUES

### 11. HVAC-only positioning limits scaling (STRATEGIC)
- Title: "AI Phone Receptionist for HVAC"
- Hero badge: "AI Phone Receptionist for HVAC"
- This is fine for the current Thunder Bay HVAC vertical
- But when expanding to other trades or cities, you'll need either:
  - A generic homepage + vertical-specific landing pages (`/hvac`, `/plumbing`, `/electrician`)
  - Or a rebrand of the main page to be vertical-agnostic
- **Not urgent** — but plan the URL structure now

### 12. "No credit card risk" is vague (LOW)
- hvac-demo.html says "No credit card risk"
- Stripe checkout does collect a card for trials — the promise is "no charge until trial ends"
- Better wording: "No charge for 14 days" or "Try free for 14 days — cancel anytime"

### 13. Feature cards could be stronger (LOW)
- "Turns Missed Calls Into Revenue" card cites "30% of inbound calls" stat with no source
- Consider making this more specific to the prospect's own missed calls

---

## STYLING & UX ISSUES

### 14. Privacy, Terms, and 404 pages are completely unstyled (MEDIUM)
- `privacy.html`: raw HTML, no CSS, no nav, no footer, no brand identity
- `terms.html`: same — raw HTML with no styling
- `404.html`: inline styles, no brand consistency
- These are the pages people see when they're evaluating trust. Unstyled legal pages signal "not a real company."
- **Fix:** Apply the same nav/footer/color scheme from index.html

### 15. Video poster is empty (LOW)
- `hvac-demo.html` has `poster=""` on the video element
- Before the video loads, users see a black rectangle
- **Fix:** Generate a poster frame from the video and add it

### 16. No loading states on CTA buttons (LOW)
- Clicking "Get Started" navigates to an external URL with no visual feedback
- Consider adding a brief loading indicator or at minimum `target` handling

---

## TECHNICAL ISSUES

### 17. CSP blocks external analytics (NOTED)
- `script-src 'self' 'unsafe-inline'` means no external scripts can load
- If you want to add Google Analytics, Plausible, or any tracking, the CSP needs updating
- Current state: **zero analytics** — you have no visibility into traffic, conversion, or visitor behavior
- **Fix:** Add self-hosted analytics (Plausible/Umami) or update CSP for a cloud analytics provider

### 18. No `lang` attribute on legal pages (LOW)
- `privacy.html` and `terms.html` use `<html>` without `lang="en"`
- Minor accessibility issue
- **Fix:** Add `lang="en"` to all HTML tags

### 19. success.html references wrong email (LOW)
- Shows "Questions? Email us at hello@northernautomation.ca"
- This alias may not be configured in Google Workspace (see site-audit.md)
- **Fix:** Ensure hello@ routes to Dave's inbox, or change to a confirmed working address

---

## SCALING READINESS SUMMARY

### Ready Now
- ✅ Clean, modern design on homepage
- ✅ Clear value proposition for HVAC
- ✅ Simple pricing structure
- ✅ Working Google Calendar booking link
- ✅ Good security headers
- ✅ Mobile-responsive CSS
- ✅ robots.txt present

### Must Fix Before Scaling
1. 🔴 **Stripe price IDs in docker-compose** — checkout is completely broken
2. 🔴 **Update website pricing** from $397/$3,997 to $197/$1,997
3. 🔴 **Update trial period** from 30-day to 14-day everywhere
4. 🟡 **Add OG tags** — sharing looks broken without them
5. 🟡 **Style the legal pages** — they undermine trust
6. 🟡 **Add a favicon** — basic professionalism
7. 🟡 **Complete the sitemap** — SEO foundation
8. 🟡 **Add analytics** — can't scale what you can't measure

### Nice to Have for Scale
- Vertical-specific landing pages
- FAQ section for SEO content depth
- Schema.org structured data
- Video poster image
- Blog (long-term SEO play)

