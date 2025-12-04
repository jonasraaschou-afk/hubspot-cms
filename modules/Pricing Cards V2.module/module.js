(function() {
  'use strict';

  // Initialize all pricing modules on the page
  const pricingModules = document.querySelectorAll('.kl-pricing-v2');

  pricingModules.forEach(function(module) {
    initPricingModule(module);
  });

  function initPricingModule(module) {
    // Get configuration from JSON
    const configElement = module.querySelector('[data-pricing-config]');
    if (!configElement) return;

    const config = JSON.parse(configElement.textContent);

    // Get all interactive elements
    const volumeSlider = module.querySelector('[data-volume-slider]');
    const volumeDisplay = module.querySelector('[data-volume-display]');
    const sliderFill = module.querySelector('[data-slider-fill]');
    const billingToggle = module.querySelector('[data-billing-toggle]');
    const monthlyLabel = module.querySelector('[data-billing="monthly"]');
    const yearlyLabel = module.querySelector('[data-billing="yearly"]');
    const cards = module.querySelectorAll('.kl-pricing-v2__card');

    // State
    let currentVolume = parseInt(volumeSlider.value);
    let isYearly = false;

    // Initialize
    updatePricing();
    updateSliderFill();

    // Event listeners
    volumeSlider.addEventListener('input', function() {
      currentVolume = parseInt(this.value);
      updateVolumeDisplay();
      updateSliderFill();
      updatePricing();
    });

    billingToggle.addEventListener('change', function() {
      isYearly = this.checked;
      toggleBillingLabels();
      updatePricing();
    });

    // Label click handlers
    monthlyLabel.addEventListener('click', function() {
      billingToggle.checked = false;
      isYearly = false;
      toggleBillingLabels();
      updatePricing();
    });

    yearlyLabel.addEventListener('click', function() {
      billingToggle.checked = true;
      isYearly = true;
      toggleBillingLabels();
      updatePricing();
    });

    // Functions
    function updateVolumeDisplay() {
      // Format number with thousand separators
      volumeDisplay.textContent = currentVolume.toLocaleString('da-DK');
    }

    function updateSliderFill() {
      const percent = (currentVolume / parseInt(volumeSlider.max)) * 100;
      sliderFill.style.width = percent + '%';
    }

    function toggleBillingLabels() {
      if (isYearly) {
        monthlyLabel.classList.remove('kl-pricing-v2__toggle-label--active');
        yearlyLabel.classList.add('kl-pricing-v2__toggle-label--active');
      } else {
        monthlyLabel.classList.add('kl-pricing-v2__toggle-label--active');
        yearlyLabel.classList.remove('kl-pricing-v2__toggle-label--active');
      }
    }

    function updatePricing() {
      cards.forEach(function(card, index) {
        const planData = config.plans[index];
        if (!planData) return;

        // Calculate price based on volume
        let monthlyPrice = calculatePrice(planData, currentVolume);

        // Apply yearly discount if applicable
        let displayPrice = monthlyPrice;
        let yearlySavings = 0;

        if (isYearly) {
          const yearlyTotal = monthlyPrice * 12;
          const discountedYearly = yearlyTotal * (1 - config.yearlyDiscount / 100);
          displayPrice = Math.round(discountedYearly / 12);
          yearlySavings = Math.round(yearlyTotal - discountedYearly);
        }

        // Update price display
        const priceDisplay = card.querySelector('[data-price-display]');
        const priceAmount = priceDisplay.querySelector('.kl-pricing-v2__price-amount');
        const pricePeriod = priceDisplay.querySelector('.kl-pricing-v2__price-period');
        const savingsNote = card.querySelector('[data-yearly-savings]');
        const savingsAmount = savingsNote.querySelector('[data-savings-amount]');

        priceAmount.textContent = Math.round(displayPrice).toLocaleString('da-DK');
        pricePeriod.textContent = isYearly ? '/måned' : '/måned';

        // Show/hide savings note
        if (isYearly && yearlySavings > 0) {
          savingsAmount.textContent = yearlySavings.toLocaleString('da-DK');
          savingsNote.style.display = 'block';
        } else {
          savingsNote.style.display = 'none';
        }

        // Highlight appropriate card based on volume
        const isRecommended = currentVolume >= planData.minVolume && currentVolume <= planData.maxVolume;

        if (isRecommended) {
          card.classList.add('kl-pricing-v2__card--recommended');
          // Add pulsing animation
          card.style.animation = 'none';
          setTimeout(function() {
            card.style.animation = 'pricing-pulse 0.6s ease-out';
          }, 10);
        } else {
          card.classList.remove('kl-pricing-v2__card--recommended');
        }
      });
    }

    function calculatePrice(plan, volume) {
      // Base price + additional per-unit pricing
      let price = plan.basePrice;

      // If volume exceeds minimum, calculate additional costs
      if (volume > plan.minVolume && plan.pricePerUnit > 0) {
        const additionalUnits = volume - plan.minVolume;
        price += additionalUnits * plan.pricePerUnit;
      }

      return price;
    }
  }

  // Add animation keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pricing-pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.03);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(style);
})();
