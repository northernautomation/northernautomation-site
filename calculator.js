/* ============================================================
   Northern Automation — Revenue Loss Calculator

   Usage: add data attributes to the .calculator section:
     data-calc-missed="10"   missed calls per week (default 10)
     data-calc-value="500"   avg job value in $ (default 500)
     data-calc-close="30"    close rate % (default 30)

   Required IDs in the HTML:
     #calcMissed       range input
     #calcMissedVal    display span for missed calls value
     #calcValue        number input for job value
     #calcClose        range input
     #calcCloseVal     display span for close rate value
     #calcMonthly      output span for monthly lost revenue
     #calcAnnual       output span for annual lost revenue
     #calcComparison   output span for the "leaving $X on the table" figure
   ============================================================ */

(function () {
  'use strict';

  function formatCurrency(n) {
    return '$' + Math.round(n).toLocaleString('en-CA');
  }

  function initCalculator() {
    var section = document.querySelector('.calculator');
    if (!section) return;

    // Read defaults from data attributes (fall back to spec defaults)
    var defaultMissed = parseInt(section.dataset.calcMissed, 10) || 10;
    var defaultValue  = parseInt(section.dataset.calcValue,  10) || 500;
    var defaultClose  = parseInt(section.dataset.calcClose,  10) || 30;

    var sliderMissed = document.getElementById('calcMissed');
    var valMissed    = document.getElementById('calcMissedVal');
    var inputValue   = document.getElementById('calcValue');
    var sliderClose  = document.getElementById('calcClose');
    var valClose     = document.getElementById('calcCloseVal');
    var outMonthly   = document.getElementById('calcMonthly');
    var outAnnual    = document.getElementById('calcAnnual');
    var outCompare   = document.getElementById('calcComparison');

    // Guard — if elements are missing, bail silently
    if (!sliderMissed || !inputValue || !sliderClose) return;

    // Set initial values
    sliderMissed.value = defaultMissed;
    inputValue.value   = defaultValue;
    sliderClose.value  = defaultClose;

    function recalc() {
      var missed    = parseInt(sliderMissed.value, 10)  || 0;
      var jobValue  = parseFloat(inputValue.value)      || 0;
      var closeRate = parseInt(sliderClose.value, 10)   || 0;

      // Update display labels
      if (valMissed) valMissed.textContent = missed + ' calls/wk';
      if (valClose)  valClose.textContent  = closeRate + '%';

      // Clamp job value to a sane minimum so output isn't $0
      if (jobValue < 0) { jobValue = 0; inputValue.value = 0; }

      // Monthly missed calls (4.33 weeks/month)
      var missedPerMonth = missed * 4.33;
      var monthly = missedPerMonth * (closeRate / 100) * jobValue;
      var annual  = monthly * 12;

      // Amount they're leaving on the table vs $197/mo plan
      var leaving = monthly - 197;

      if (outMonthly) outMonthly.textContent = formatCurrency(monthly);
      if (outAnnual)  outAnnual.textContent  = formatCurrency(annual);

      if (outCompare) {
        if (leaving > 0) {
          outCompare.textContent = formatCurrency(leaving) + '/mo';
        } else {
          outCompare.textContent = 'more than covered';
        }
      }
    }

    // Attach listeners
    sliderMissed.addEventListener('input', recalc);
    sliderClose.addEventListener('input', recalc);
    inputValue.addEventListener('input', recalc);

    // Enforce min on blur so users can't type a negative
    inputValue.addEventListener('blur', function () {
      if (parseFloat(inputValue.value) < 0 || isNaN(parseFloat(inputValue.value))) {
        inputValue.value = defaultValue;
        recalc();
      }
    });

    // Run on load
    recalc();
  }

  // Init after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
  } else {
    initCalculator();
  }

})();
