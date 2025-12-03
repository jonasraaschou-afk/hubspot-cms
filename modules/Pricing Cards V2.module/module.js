(function() {
  'use strict';

  // Find all pricing toggles on the page
  const pricingToggles = document.querySelectorAll('.kl-pricing-v2__toggle-input');

  pricingToggles.forEach(function(toggle) {
    const container = toggle.closest('.kl-pricing-v2');
    if (!container) return;

    const monthlyLabel = container.querySelector('.kl-pricing-v2__toggle-label[data-billing="monthly"]');
    const yearlyLabel = container.querySelector('.kl-pricing-v2__toggle-label[data-billing="yearly"]');
    const monthlyPrices = container.querySelectorAll('.kl-pricing-v2__price[data-billing="monthly"]');
    const yearlyPrices = container.querySelectorAll('.kl-pricing-v2__price[data-billing="yearly"]');

    // Function to switch pricing display
    function switchPricing(showYearly) {
      // Update labels
      if (showYearly) {
        monthlyLabel.classList.remove('kl-pricing-v2__toggle-label--active');
        yearlyLabel.classList.add('kl-pricing-v2__toggle-label--active');
      } else {
        monthlyLabel.classList.add('kl-pricing-v2__toggle-label--active');
        yearlyLabel.classList.remove('kl-pricing-v2__toggle-label--active');
      }

      // Update prices with fade animation
      monthlyPrices.forEach(function(price) {
        if (showYearly) {
          price.style.display = 'none';
        } else {
          price.style.display = 'block';
        }
      });

      yearlyPrices.forEach(function(price) {
        if (showYearly) {
          price.style.display = 'block';
        } else {
          price.style.display = 'none';
        }
      });
    }

    // Toggle event listener
    toggle.addEventListener('change', function() {
      switchPricing(this.checked);
    });

    // Label click handlers
    monthlyLabel.addEventListener('click', function() {
      toggle.checked = false;
      switchPricing(false);
    });

    yearlyLabel.addEventListener('click', function() {
      toggle.checked = true;
      switchPricing(true);
    });
  });
})();
