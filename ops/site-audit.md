# Northern Automation — Site & Communications Audit
**Prepared by:** George (AI Operator)  
**Date:** 2026-03-12  
**Scope:** Email addresses, public-facing content, n8n workflow emails, Stripe communications, onboarding flow

---

## PART 1: EMAIL ADDRESS AUDIT

### Summary of All Email Addresses Found

| Address | Where It Appears | Role / Purpose |
|---------|-----------------|----------------|
| `hello@northernautomation.ca` | index.html footer (mailto link) | Public contact |
| `hello@northernautomation.ca` | success.html footer note | Post-purchase support contact |
| `hello@northernautomation.ca` | NA-STRIPE-001 welcome email body (signature/footer link) | Displayed in automated email |
| `hello@northernautomation.ca` | NA-ONBOARD-001 confirmation email body (signature/footer link) | Displayed in automated email |
| `info@northernautomation.ca` | terms.html Contact Information section | Legal/compliance contact |
| `dave@northernautomation.ca` | NA-STRIPE-001 — **From address** (sends welcome email) | SMTP sender |
| `dave@northernautomation.ca` | NA-ONBOARD-001 — **From address** (sends setup confirmation email) | SMTP sender |
| `dave@northernautomation.ca` | SMTP credential in n8n (Google Workspace app password, smtp.gmail.com:465) | Underlying mail account |

---

## PART 2: LOCATION-BY-LOCATION BREAKDOWN

### 2.1 Website — northernautomation.ca

**index.html (homepage footer)**
- `hello@northernautomation.ca` — displayed as clickable mailto link
- Line 538: `<a href="mailto:hello@northernautomation.ca">hello@northernautomation.ca</a>`

**success.html (post-checkout page)**
- `hello@northernautomation.ca` — plain text, no mailto link
- Line 106: `Questions? Email us at hello@northernautomation.ca`

**terms.html (Terms of Service)**
- `info@northernautomation.ca` — in the Contact Information section
- Line 50: `<p>info@northernautomation.ca</p>`
- **⚠️ Issue:** This is inconsistent with the homepage which uses `hello@`. Two different addresses for the same business.

**privacy.html (Privacy Policy)**
- No email address present in the Contact section
- **⚠️ Issue:** The Contact section has a physical address but no email, leaving visitors with no way to reach Northern Automation with privacy inquiries. This is a compliance gap (PIPEDA / CASL).

**hvac-demo.html**
- No email addresses found.

**404.html**
- No email addresses found.

---

### 2.2 n8n Automated Emails

**NA-STRIPE-001 — Payment Webhook**
- Trigger: Customer completes Stripe checkout
- Email: "Welcome to Northern Automation — Complete Your Setup"
- **From:** `dave@northernautomation.ca`
- **To:** Customer's email (dynamic from Stripe)
- **Body footer:** Links to `hello@northernautomation.ca`
- **⚠️ Issue:** From address is `dave@` (a personal founder alias), not a role-based address. Looks informal for an automated welcome email from a SaaS product.

**NA-ONBOARD-001 — Client Onboarding**
- Trigger: Client submits onboarding form
- Email: "Your AI Receptionist Is Being Set Up"
- **From:** `dave@northernautomation.ca`
- **To:** Client's email (dynamic from form)
- **Body footer:** Links to `hello@northernautomation.ca`
- **⚠️ Issue:** Same as above — personal name as sender on an automated provisioning email.

---

### 2.3 Stripe Communications

Stripe-native emails (receipts, payment confirmations) are controlled by the Stripe dashboard settings, not by n8n. Those settings were not changed during setup, so Stripe is likely sending receipts from its default address (`receipts@stripe.com` or a Stripe-branded address) with Northern Automation's business name. **Stripe receipt emails do not currently use a northernautomation.ca from address.** This is standard for Stripe and acceptable.

**Note:** Stripe dashboard allows configuring a custom reply-to address for receipts. This has not been configured.

---

### 2.4 SMTP Infrastructure

- **Provider:** Google Workspace (smtp.gmail.com, port 465, SSL)
- **Sending account:** `dave@northernautomation.ca`
- **Auth method:** App password (stored as n8n SMTP credential named "SMTP account")
- **Receiving:** No inbound email routing has been configured or verified for role-based aliases

---

## PART 3: INCONSISTENCIES & ISSUES

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| 1 | `dave@` is the From address on all automated emails — a personal alias, not a role-based one | n8n workflows | Medium |
| 2 | Homepage uses `hello@`, Terms uses `info@` — two different public-facing addresses for the same business | index.html vs terms.html | Medium |
| 3 | Privacy policy has no contact email | privacy.html | High — PIPEDA/CASL compliance gap |
| 4 | Stripe receipts have no custom reply-to set | Stripe dashboard | Low |
| 5 | No `noreply@` or `no-reply@` alias in use — clients could reply to `dave@` and expect a human response to automated emails | n8n workflows | Low-Medium |

---

## PART 4: RECOMMENDED EMAIL ALIAS STRUCTURE

For a professional AI agency sending automated communications and maintaining a public presence, the following alias structure is recommended. All aliases should be set up in Google Workspace as aliases or groups, all routing to Dave's inbox.

### Recommended Aliases

| Alias | Purpose | Priority |
|-------|---------|----------|
| `hello@northernautomation.ca` | **Primary public contact** — homepage, social, general inquiries | ✅ Already in use — keep |
| `support@northernautomation.ca` | Client support, onboarding questions, post-sale issues | High — create now |
| `noreply@northernautomation.ca` | From address on all automated transactional emails (welcome, setup confirmation) | High — create now |
| `billing@northernautomation.ca` | Stripe reply-to, payment questions | Medium |
| `info@northernautomation.ca` | Legal/compliance contact (terms, privacy policy) | ✅ Already in use — keep, but standardize |

### Rationalized Setup (Minimum Viable, Professional)

If keeping it simple, the minimum clean setup is:

1. **`hello@`** — public contact on website and all human-reachable surfaces
2. **`noreply@`** — From address on all automated n8n emails so clients don't reply into a void
3. **`info@`** — Legal pages only (terms, privacy) — satisfies compliance requirement for identifiable contact

That's three addresses, clearly scoped, and routes everything to Dave while looking clean and intentional.

### Recommended Changes (When Ready to Implement)

1. Change `fromEmail` in NA-STRIPE-001 from `dave@` → `noreply@northernautomation.ca`
2. Change `fromEmail` in NA-ONBOARD-001 from `dave@` → `noreply@northernautomation.ca`
3. Update body footer links in both emails from `hello@` → `support@northernautomation.ca` (so clients know where to go for help)
4. Standardize terms.html to use `info@northernautomation.ca` (already there — just keep consistent)
5. Add email to privacy.html Contact section: `info@northernautomation.ca`
6. Set `hello@northernautomation.ca` as reply-to on Stripe receipts in Stripe dashboard
7. Keep homepage footer as `hello@northernautomation.ca` — correct for public-facing contact

---

## PART 5: QUICK REFERENCE — CURRENT STATE VS. RECOMMENDED

| Surface | Current Email | Recommended |
|---------|--------------|-------------|
| Homepage footer | `hello@` | ✅ Keep |
| success.html | `hello@` | Consider `support@` once active |
| terms.html | `info@` | ✅ Keep, standardize |
| privacy.html | *(missing)* | Add `info@` |
| Welcome email From | `dave@` | Change to `noreply@` |
| Welcome email body footer | `hello@` | Change to `support@` |
| Onboarding email From | `dave@` | Change to `noreply@` |
| Onboarding email body footer | `hello@` | Change to `support@` |
| Stripe receipts reply-to | *(not set)* | Set to `hello@` in Stripe dashboard |

---

*No changes were made during this audit. All recommendations are staged for Dave's approval before implementation.*
