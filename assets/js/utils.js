// Core utilities and helper functions for the website

// Toggle mobile menu visibility
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuButton = document.querySelector('[aria-controls="mobile-menu"]');

  if (mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.remove('hidden');
    menuButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  } else {
    mobileMenu.classList.add('hidden');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Re-enable scrolling
  }
}

// Sticky header implementation with debouncing
function initStickyHeader() {
  const header = document.querySelector('header');
  let lastScrollTop = 0;
  let ticking = false;

  function updateHeaderState() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Add sticky class when scrolling down
    if (scrollTop > 50) {
      header.classList.add('bg-white', 'shadow-md', 'py-2');
      header.classList.remove('py-4');
    } else {
      header.classList.remove('bg-white', 'shadow-md', 'py-2');
      header.classList.add('py-4');
    }

    // Hide/show header when scrolling down/up
    if (scrollTop > lastScrollTop && scrollTop > 300) {
      // Scrolling down
      header.classList.add('-translate-y-full');
    } else {
      // Scrolling up
      header.classList.remove('-translate-y-full');
    }

    lastScrollTop = scrollTop;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  });
}

// Smooth scroll to section when clicking on navigation links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        toggleMobileMenu();
      }

      const targetId = this.getAttribute('href');

      if (targetId === '#' || targetId === '#top') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Offset for header height
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without page reload
        history.pushState(null, null, targetId);
      }
    });
  });
}

// Form validation and submission handling
function initFormHandlers() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        // Clear previous error state
        field.classList.remove('border-red-500');
        const errorMessage = field.parentElement.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();

        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('border-red-500');

          // Add error message
          const message = document.createElement('p');
          message.classList.add('text-red-500', 'text-xs', 'mt-1', 'error-message');
          message.innerText = 'This field is required';
          field.parentElement.appendChild(message);
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            field.classList.add('border-red-500');

            // Add error message
            const message = document.createElement('p');
            message.classList.add('text-red-500', 'text-xs', 'mt-1', 'error-message');
            message.innerText = 'Please enter a valid email address';
            field.parentElement.appendChild(message);
          }
        }
      });

      if (!isValid) return;

      // Show loading state
      const submitButton = form.querySelector('[type="submit"]');
      const originalText = submitButton.innerText;
      submitButton.disabled = true;
      submitButton.innerText = 'Submitting...';

      // Form data
      const formData = new FormData(form);
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      // Simulate form submission (replace with actual endpoint)
      setTimeout(() => {
        console.log('Form submitted:', formObject);

        // Success message
        form.innerHTML = `
                    <div class="p-4 bg-green-50 rounded-lg">
                        <h3 class="text-green-800 font-bold text-lg mb-2">Thank you!</h3>
                        <p class="text-green-700">Your submission has been received. We will be in touch soon.</p>
                    </div>
                `;

        // Reset form after delay if needed
        // setTimeout(() => {
        //     form.reset();
        //     form.innerHTML = originalForm;
        //     initFormHandlers(); // Re-initialize handlers
        // }, 5000);
      }, 1500);
    });
  });
}

// Initialize dropdown menus
function initDropdowns() {
  const dropdownButtons = document.querySelectorAll('[data-dropdown-toggle]');

  dropdownButtons.forEach(button => {
    const targetId = button.getAttribute('data-dropdown-toggle');
    const dropdown = document.getElementById(targetId);

    if (!dropdown) return;

    button.addEventListener('click', (e) => {
      e.stopPropagation();

      // Close other open dropdowns
      document.querySelectorAll('[data-dropdown].block').forEach(openDropdown => {
        if (openDropdown !== dropdown) {
          openDropdown.classList.remove('block');
          openDropdown.classList.add('hidden');
        }
      });

      // Toggle current dropdown
      dropdown.classList.toggle('hidden');
      dropdown.classList.toggle('block');

      // Update aria attributes
      const expanded = !dropdown.classList.contains('hidden');
      button.setAttribute('aria-expanded', expanded);
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('[data-dropdown]:not(.hidden)').forEach(dropdown => {
      dropdown.classList.add('hidden');
      dropdown.classList.remove('block');

      // Update aria attributes on buttons
      const buttonId = dropdown.id;
      const button = document.querySelector(`[data-dropdown-toggle="${buttonId}"]`);
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  });
}

// Initialize tabs functionality
function initTabs() {
  const tabButtons = document.querySelectorAll('[role="tab"]');

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      const tabsContainer = this.closest('[role="tablist"]').parentElement;
      const targetId = this.getAttribute('aria-controls');

      // Deactivate all tabs
      tabsContainer.querySelectorAll('[role="tab"]').forEach(tab => {
        tab.setAttribute('aria-selected', 'false');
        tab.classList.remove('border-primary', 'text-primary');
        tab.classList.add('border-transparent', 'text-gray-500');
      });

      // Hide all tab panels
      tabsContainer.querySelectorAll('[role="tabpanel"]').forEach(panel => {
        panel.classList.add('hidden');
      });

      // Activate current tab
      this.setAttribute('aria-selected', 'true');
      this.classList.add('border-primary', 'text-primary');
      this.classList.remove('border-transparent', 'text-gray-500');

      // Show current tab panel
      document.getElementById(targetId).classList.remove('hidden');
    });
  });
}

// Helper function for counters with animation
function initCounters() {
  const counterElements = document.querySelectorAll('.counter-value');

  // Use Intersection Observer for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.dataset.target) || 0;
        const duration = parseFloat(entry.target.dataset.duration) || 2000;
        const prefix = entry.target.dataset.prefix || '';
        const suffix = entry.target.dataset.suffix || '';
        const decimalPlaces = entry.target.dataset.decimals || 0;

        let startTime;
        let currentValue = 0;

        function animateCounter(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);

          currentValue = progress * target;
          entry.target.textContent = `${prefix}${currentValue.toFixed(decimalPlaces)}${suffix}`;

          if (progress < 1) {
            window.requestAnimationFrame(animateCounter);
          }
        }

        window.requestAnimationFrame(animateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  counterElements.forEach(counter => {
    observer.observe(counter);
  });
}