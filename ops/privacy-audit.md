# Northern Automation — Privacy Audit: Business Address Exposure
**Prepared by:** George (AI Operator)  
**Date:** 2026-03-12  
**Scope:** Physical business address (697 Mountain Rd, Fort William First Nation, ON) across all public-facing site pages

---

## Summary

The registered business address was found on **2 pages** of the site. Per Dave's instruction, it must remain on Terms and Conditions (legal compliance requirement) and be removed from all other locations where it appears unnecessarily.

**Result:** Address removed from 1 page. Retained on 1 page. No other occurrences found.

---

## Full Site Scan Results

| File | Address Present? | Action |
|------|-----------------|--------|
| `terms.html` | ✅ Yes — Contact Information section (lines 64–65) | **Retained** — legally required |
| `privacy.html` | ✅ Yes — Contact section (lines 28–29) | **Removed** — not legally required |
| `index.html` | No | No action |
| `hvac-demo.html` | No | No action |
| `success.html` | No | No action |
| `404.html` | No | No action |

---

## What Was Changed

### `privacy.html` — Contact Section

**Before:**
```html
<h2>Contact</h2>
<p>Northern Automation<br>
697 Mountain Rd<br>
Fort William First Nation, ON</p>
```

**After:**
```html
<h2>Contact</h2>
<p>Northern Automation<br>
info@northernautomation.ca</p>
```

**Reason for removal:** The Privacy Policy Contact section only needs to provide a way to reach Northern Automation with privacy-related inquiries. A physical address is not required here and unnecessarily exposes the registered address on a non-legal page. Replaced with `info@northernautomation.ca`, which also closes the existing PIPEDA/CASL compliance gap noted in the site audit (privacy.html had no contact email at all).

---

## What Was Retained

### `terms.html` — Contact Information Section

```html
<h2>Contact Information</h2>
<p>
Northern Automation<br>
697 Mountain Rd<br>
Fort William First Nation, ON<br>
Canada
</p>
```

**Reason retained:** Terms and Conditions require an identifiable legal address for the contracting entity. This is a legal compliance requirement and the address remains here as instructed.

---

## Notes

- No footers, about pages, or other pages contained the address — only the two pages above.
- The address does not appear in any n8n workflows, email templates, or automation scripts.
- Change committed to git as part of this audit.

---

*Audit complete. One change applied. Terms and Conditions untouched.*
