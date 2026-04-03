/* ============================================================
   Northern Automation — Shared Components
   Injects nav and footer into every page.
   Each HTML file needs:
     <div id="nav"></div>
     <div id="footer"></div>
     <script src="/components.js"></script>
   ============================================================ */

(function () {
  'use strict';

  /* ── NAV ── */
  const navHTML = `
<nav>
  <div class="nav-inner">
    <a href="/" class="logo">Northern<span>Automation</span></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="/#industries">Industries</a></li>
      <li><a href="/hvac-demo">Demo</a></li>
      <li><a href="/#pricing">Pricing</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
    <div class="nav-right">
      <a href="tel:+18888700764" class="nav-phone">1-888-870-0764</a>
      <a href="https://webhook.northernautomation.ca/webhook/checkout?plan=monthly"
         class="nav-cta"
         data-plausible-event-name="CTA Click">Start Free Trial</a>
      <button class="nav-hamburger" id="navHamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="nav-mobile-menu" id="navMobileMenu">
    <ul>
      <li><a href="/#industries">Industries</a></li>
      <li><a href="/hvac-demo">Demo</a></li>
      <li><a href="/#pricing">Pricing</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
    <a href="https://webhook.northernautomation.ca/webhook/checkout?plan=monthly"
       class="nav-cta"
       data-plausible-event-name="CTA Click">Start Free Trial</a>
  </div>
</nav>`;

  /* ── FOOTER ── */
  const footerHTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <a href="/" class="footer-logo">Northern<span>Automation</span></a>
      <p class="footer-tagline">Thunder Bay, Ontario, Canada</p>
      <p class="footer-tagline">Powered by AI. Built in Canada.</p>
      <br>
      <p><a href="tel:+18888700764">1-888-870-0764</a></p>
      <p><a href="mailto:hello@northernautomation.ca">hello@northernautomation.ca</a></p>
    </div>
    <div class="footer-col">
      <h4>Product</h4>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/#pricing">Pricing</a></li>
        <li><a href="/hvac-demo">Demo</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Industries</h4>
      <ul>
        <li><a href="/hvac">HVAC &amp; Plumbing</a></li>
        <li><a href="/dental">Dental Offices</a></li>
        <li><a href="/legal">Law Firms</a></li>
        <li><a href="/medical">Medical Clinics</a></li>
        <li><a href="/home-services">Home Services</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>&copy; 2026 Northern Automation. All rights reserved.</span>
    <span>
      <a href="/privacy.html">Privacy Policy</a>
      &nbsp;&middot;&nbsp;
      <a href="/terms.html">Terms of Service</a>
    </span>
  </div>
</footer>`;

  /* ── INJECT ── */
  const navEl = document.getElementById('nav');
  const footerEl = document.getElementById('footer');
  if (navEl) navEl.outerHTML = navHTML;
  if (footerEl) footerEl.outerHTML = footerHTML;

  /* ── HAMBURGER TOGGLE ── */
  // Elements are now in the DOM — attach listener
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on nav link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── ACTIVE NAV LINK ── */
  // Highlight the current page in the desktop nav
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(function (a) {
    const href = a.getAttribute('href');
    // Exact path match (skip hash links)
    if (href && !href.includes('#') && href !== '/') {
      const normalised = href.replace(/\.html$/, '');
      if (path === normalised || path === href) {
        a.style.color = 'var(--text)';
      }
    }
  });

  /* ── FAQ ACCORDION ── */
  // Delegated — works for FAQs on any page without extra scripts
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;
    const item = btn.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');
    // Close all open items first
    document.querySelectorAll('.faq-item.open').forEach(function (el) {
      el.classList.remove('open');
    });
    if (!isOpen) item.classList.add('open');
  });

})();
