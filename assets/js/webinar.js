// Webinar registration and management functionality

// Initialize webinar-specific functionality
function initWebinarPage() {
  initCountdownTimer();
  setupRegistrationForm();
  setupSpeakerBios();
  initWebinarFAQs();
  initWebinarShareButtons();
}

// Set up the webinar registration form with validation
function setupRegistrationForm() {
  const webinarForm = document.querySelector('.webinar-registration-form');
  if (!webinarForm) return;

  // Add custom validation for webinar form
  webinarForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate required fields
    let isValid = true;
    const requiredFields = webinarForm.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      // Reset previous error state
      field.classList.remove('border-red-500');
      const errorMessage = field.parentElement.querySelector('.error-message');
      if (errorMessage) errorMessage.remove();

      // Check if field is empty
      if (!field.value.trim()) {
        isValid = false;

        // Add error styling
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

          // Add error styling
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
    const submitButton = webinarForm.querySelector('[type="submit"]');
    const originalText = submitButton.innerText;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="animate-spin inline-block mr-2">⟳</span> Registering...';

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      // Show thank you message
      const formContainer = webinarForm.parentElement;
      const thankYouMessage = document.createElement('div');
      thankYouMessage.classList.add('bg-green-50', 'p-8', 'rounded-lg', 'text-center');

      const formData = new FormData(webinarForm);
      const email = formData.get('email');

      thankYouMessage.innerHTML = `
                <div class="mb-4 flex justify-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>
                <h3 class="text-2xl font-bold text-green-800 mb-2">Registration Confirmed!</h3>
                <p class="text-green-700 mb-4">Your spot for the upcoming webinar has been reserved.</p>
                <p class="text-sm text-green-600">We've sent a confirmation email to <strong>${email || 'your email address'}</strong> with all the details.</p>
                <div class="mt-6">
                    <button type="button" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition" onclick="addToCalendar()">Add to Calendar</button>
                </div>
            `;

      // Replace form with thank you message with animation
      webinarForm.style.opacity = '0';
      webinarForm.style.transform = 'translateY(20px)';
      webinarForm.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

      setTimeout(() => {
        webinarForm.remove();
        formContainer.appendChild(thankYouMessage);

        // Animate thank you message in
        thankYouMessage.style.opacity = '0';
        thankYouMessage.style.transform = 'translateY(20px)';
        thankYouMessage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
          thankYouMessage.style.opacity = '1';
          thankYouMessage.style.transform = 'translateY(0)';
        }, 10);
      }, 500);
    }, 1500);
  });

  // Add focus and blur event handlers for form fields
  webinarForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('focus', function () {
      this.parentElement.querySelector('label')?.classList.add('text-primary');
      this.classList.add('border-primary');
    });

    field.addEventListener('blur', function () {
      this.parentElement.querySelector('label')?.classList.remove('text-primary');
      this.classList.remove('border-primary');
    });
  });
}

// Countdown timer functionality for webinar page
function initCountdownTimer() {
  const countdown = document.querySelector('.webinar-countdown');
  if (!countdown) return;

  // Get target date from data attribute or default to September 28, 2025
  let targetDateStr = countdown.dataset.date;
  let targetDate;

  if (targetDateStr) {
    targetDate = new Date(targetDateStr);
  } else {
    // Default to September 28, 2025 at 6pm Eastern Time
    targetDate = new Date('2025-09-28T18:00:00-04:00');
  }

  // Update countdown every second
  function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      // Webinar has started or passed
      countdown.innerHTML = `
                <div class="bg-red-50 p-4 rounded-lg text-center">
                    <p class="text-red-800 font-medium">This webinar has already started or passed.</p>
                    <p class="text-sm text-red-600 mt-2">Check our schedule for upcoming webinars.</p>
                </div>
            `;
      return;
    }

    // Calculate days, hours, minutes, seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Update countdown elements
    const daysElement = countdown.querySelector('[data-unit="days"]');
    const hoursElement = countdown.querySelector('[data-unit="hours"]');
    const minutesElement = countdown.querySelector('[data-unit="minutes"]');
    const secondsElement = countdown.querySelector('[data-unit="seconds"]');

    if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
    if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
    if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
    if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
  }

  // Initial update
  updateCountdown();

  // Update countdown every second
  const countdownInterval = setInterval(updateCountdown, 1000);

  // Store interval ID for cleanup if needed
  countdown.dataset.intervalId = countdownInterval;
}

// Set up interactive speaker bios
function setupSpeakerBios() {
  const speakerCards = document.querySelectorAll('.speaker-card');
  if (!speakerCards.length) return;

  speakerCards.forEach(card => {
    // Add click event to show full bio
    card.addEventListener('click', function (e) {
      // Prevent default if this is a link
      if (e.target.tagName === 'A') return;

      // Get speaker info
      const speakerName = card.querySelector('.speaker-name')?.textContent || 'Speaker';
      const speakerRole = card.querySelector('.speaker-role')?.textContent || '';
      const speakerBio = card.querySelector('.speaker-bio')?.innerHTML || 'No bio available.';
      const speakerImage = card.querySelector('img')?.src || '';

      // Create modal
      const modal = document.createElement('div');
      modal.classList.add('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'p-4', 'bg-black/50');
      modal.setAttribute('id', 'speaker-modal');
      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.3s ease';

      modal.innerHTML = `
                <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto transform scale-95 transition-transform duration-300">
                    <div class="flex justify-between items-start p-4 border-b">
                        <h3 class="text-xl font-bold">${speakerName}</h3>
                        <button class="close-modal text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="p-6">
                        <div class="flex flex-col md:flex-row gap-6">
                            ${speakerImage ? `
                                <div class="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                                    <img src="${speakerImage}" alt="${speakerName}" class="w-full h-full object-cover">
                                </div>
                            ` : ''}
                            <div>
                                <p class="text-primary font-medium mb-3">${speakerRole}</p>
                                <div class="prose max-w-none">
                                    ${speakerBio}
                                </div>
                            </div>
                        </div>
                        <div class="mt-6 flex gap-3">
                            <a href="#" class="text-primary hover:text-primary-dark transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                            </a>
                            <a href="#" class="text-primary hover:text-primary-dark transition-colors">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            `;

      document.body.appendChild(modal);

      // Add event listener to close modal
      modal.querySelector('.close-modal').addEventListener('click', function () {
        closeModal(modal);
      });

      // Close when clicking outside
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          closeModal(modal);
        }
      });

      // Prevent scrolling on body
      document.body.style.overflow = 'hidden';

      // Show modal with animation
      setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.bg-white').style.transform = 'scale(1)';
      }, 10);
    });
  });

  // Function to close modal with animation
  function closeModal(modal) {
    modal.style.opacity = '0';
    modal.querySelector('.bg-white').style.transform = 'scale(0.95)';

    // Remove modal after animation
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

// Initialize webinar-specific FAQs
function initWebinarFAQs() {
  const faqItems = document.querySelectorAll('.webinar-faq');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = question.querySelector('svg, .faq-icon');

    // Add click event to toggle answer
    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('active');

      // Close all FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = '0';

        const otherIcon = otherItem.querySelector('svg, .faq-icon');
        if (otherIcon) {
          otherIcon.classList.remove('rotate-180');
        }
      });

      // Open/close current FAQ
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';

        if (icon) {
          icon.classList.add('rotate-180');
        }
      }
    });
  });
}

// Initialize webinar share buttons
function initWebinarShareButtons() {
  const shareButtons = document.querySelectorAll('.share-button');
  if (!shareButtons.length) return;

  shareButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const platform = button.dataset.platform;
      const shareUrl = window.location.href;
      const title = document.title;

      let url = '';

      switch (platform) {
        case 'twitter':
          url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
          break;
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          break;
        case 'linkedin':
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'email':
          url = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`I thought you might be interested in this webinar: ${shareUrl}`)}`;
          break;
      }

      if (url) {
        window.open(url, '_blank');
      }
    });
  });
}

// Add webinar to calendar function
function addToCalendar() {
  // Get webinar details from page or data attributes
  const webinarTitle = document.querySelector('.webinar-title')?.textContent || 'Webinar';
  const webinarDate = document.querySelector('.webinar-date')?.textContent;
  const webinarTime = document.querySelector('.webinar-time')?.textContent;

  // Parse date and time
  let startDate, endDate;

  if (webinarDate && webinarTime) {
    startDate = new Date(`${webinarDate} ${webinarTime}`);
    // Default webinar duration: 1 hour
    endDate = new Date(startDate.getTime() + (60 * 60 * 1000));
  } else {
    // Default to 3 days from now at 2pm
    startDate = new Date();
    startDate.setDate(startDate.getDate() + 3);
    startDate.setHours(14, 0, 0, 0);
    endDate = new Date(startDate.getTime() + (60 * 60 * 1000));
  }

  // Format for Google Calendar
  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(webinarTitle)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent('Click the link in your email to join the webinar.')}&location=${encodeURIComponent('Online')}`;

  // Open Google Calendar in new tab
  window.open(googleCalendarUrl, '_blank');
}