// Form processing and validation

// Initialize all forms with validation and AJAX submission
function initForms() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });

  // Add input validation listeners
  document.querySelectorAll('form input, form textarea, form select').forEach(field => {
    field.addEventListener('blur', validateField);
    field.addEventListener('input', () => {
      // Remove error state as user types
      if (field.classList.contains('error')) {
        field.classList.remove('error', 'border-red-500');
        const errorMsg = field.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
      }
    });
  });

  // Special handler for multi-step forms
  initMultiStepForms();
}

// Handle form submission with validation
function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const isValid = validateForm(form);

  if (!isValid) {
    scrollToFirstError(form);
    return;
  }

  // Check if this is a multi-step form and not on the last step
  if (form.classList.contains('multi-step-form')) {
    const currentStep = form.querySelector('.step-content:not(.hidden)');
    const nextStep = currentStep.nextElementSibling;

    if (nextStep && nextStep.classList.contains('step-content')) {
      goToNextStep(form);
      return;
    }
  }

  submitFormData(form);
}

// Validate an entire form
function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll('input, textarea, select');

  fields.forEach(field => {
    // Skip fields in hidden steps for multi-step forms
    const fieldContainer = field.closest('.step-content');
    if (fieldContainer && fieldContainer.classList.contains('hidden')) {
      return;
    }

    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

// Validate a single field
function validateField(field) {
  // Handle both direct field and event objects
  const element = field.target || field;

  // Skip validation for hidden fields or non-required empty fields
  if (element.type === 'hidden' || (!element.required && !element.value.trim())) {
    return true;
  }

  // Remove existing error messages
  const errorMessage = element.parentElement.querySelector('.error-message');
  if (errorMessage) errorMessage.remove();

  // Default validity is true
  let isValid = true;
  let message = '';

  // Empty required field
  if (element.required && !element.value.trim()) {
    isValid = false;
    message = 'This field is required';
  }
  // Email validation
  else if (element.type === 'email' && element.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(element.value.trim())) {
      isValid = false;
      message = 'Please enter a valid email address';
    }
  }
  // Phone validation
  else if (element.type === 'tel' && element.value.trim()) {
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
    if (!phoneRegex.test(element.value.trim())) {
      isValid = false;
      message = 'Please enter a valid phone number';
    }
  }
  // URL validation
  else if (element.type === 'url' && element.value.trim()) {
    try {
      new URL(element.value.trim());
    } catch (e) {
      isValid = false;
      message = 'Please enter a valid URL';
    }
  }
  // Password validation
  else if (element.type === 'password' && element.dataset.passwordValidation === 'true') {
    const minLength = parseInt(element.dataset.minLength || '8');
    if (element.value.length < minLength) {
      isValid = false;
      message = `Password must be at least ${minLength} characters`;
    }
  }
  // Password confirmation
  else if (element.dataset.confirmPassword) {
    const passwordField = document.getElementById(element.dataset.confirmPassword);
    if (passwordField && element.value !== passwordField.value) {
      isValid = false;
      message = 'Passwords do not match';
    }
  }
  // Min/max length
  else if (element.minLength || element.maxLength) {
    if (element.minLength && element.value.length < element.minLength) {
      isValid = false;
      message = `Must be at least ${element.minLength} characters`;
    }
    if (element.maxLength && element.value.length > element.maxLength) {
      isValid = false;
      message = `Cannot exceed ${element.maxLength} characters`;
    }
  }
  // Custom validation via data attributes
  else if (element.dataset.pattern) {
    const regex = new RegExp(element.dataset.pattern);
    if (!regex.test(element.value)) {
      isValid = false;
      message = element.dataset.patternMessage || 'Invalid format';
    }
  }

  // Update UI based on validation result
  if (!isValid) {
    element.classList.add('error', 'border-red-500');

    // Add error message
    const errorElement = document.createElement('p');
    errorElement.classList.add('text-red-500', 'text-xs', 'mt-1', 'error-message');
    errorElement.innerText = message;
    element.parentElement.appendChild(errorElement);
  } else {
    element.classList.remove('error', 'border-red-500');
  }

  return isValid;
}

// Scroll to first error in the form
function scrollToFirstError(form) {
  const firstError = form.querySelector('.error');
  if (firstError) {
    // Smooth scroll to error with offset for header
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const errorPosition = firstError.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

    window.scrollTo({
      top: errorPosition,
      behavior: 'smooth'
    });

    // Focus the field
    setTimeout(() => {
      firstError.focus();
    }, 500);
  }
}

// Submit form data via AJAX
function submitFormData(form) {
  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.innerText;
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="animate-spin inline-block mr-2">⟳</span> Submitting...';

  // Get form data
  const formData = new FormData(form);
  const formObject = {};
  formData.forEach((value, key) => {
    // Handle array inputs (checkboxes with same name)
    if (formObject[key] !== undefined) {
      if (!Array.isArray(formObject[key])) {
        formObject[key] = [formObject[key]];
      }
      formObject[key].push(value);
    } else {
      formObject[key] = value;
    }
  });

  // Determine submission endpoint
  const endpoint = form.getAttribute('action') || '/submit-form';
  const method = form.getAttribute('method')?.toUpperCase() || 'POST';

  // Detect if this is a newsletter signup form
  const isNewsletter = form.classList.contains('newsletter-form') ||
    form.querySelector('input[name="email"]') &&
    form.querySelectorAll('input, select, textarea').length <= 2;

  // AJAX request simulation (replace with actual implementation)
  setTimeout(() => {
    console.log('Form submitted:', formObject);

    // Different success message based on form type
    let successMessage;

    if (isNewsletter) {
      successMessage = `
                <div class="p-4 bg-green-50 rounded-lg text-center">
                    <svg class="w-6 h-6 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <p class="text-green-700">You're subscribed! Thank you for joining our newsletter.</p>
                </div>
            `;
    } else if (form.classList.contains('contact-form')) {
      successMessage = `
                <div class="p-6 bg-green-50 rounded-lg">
                    <h3 class="text-green-800 font-bold text-xl mb-2">Message Received!</h3>
                    <p class="text-green-700 mb-4">Thank you for reaching out. Our team will contact you shortly.</p>
                    <button type="button" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors" onclick="location.reload()">Send Another Message</button>
                </div>
            `;
    } else if (form.classList.contains('webinar-form')) {
      successMessage = `
                <div class="p-6 bg-green-50 rounded-lg">
                    <h3 class="text-green-800 font-bold text-xl mb-2">Registration Confirmed!</h3>
                    <p class="text-green-700 mb-4">You're all set for the webinar. Check your email for confirmation and calendar invite.</p>
                    <p class="text-sm text-green-600 mt-4">A confirmation email has been sent to ${formObject.email || 'your email address'}.</p>
                </div>
            `;
    } else {
      successMessage = `
                <div class="p-6 bg-green-50 rounded-lg">
                    <h3 class="text-green-800 font-bold text-xl mb-2">Thank You!</h3>
                    <p class="text-green-700">Your submission has been received. We will be in touch soon.</p>
                </div>
            `;
    }

    // Replace form with success message
    const formHeight = form.offsetHeight;
    const formContainer = document.createElement('div');
    formContainer.style.minHeight = `${formHeight}px`;
    formContainer.innerHTML = successMessage;
    formContainer.classList.add('flex', 'items-center', 'justify-center', 'transition-all', 'duration-500');

    form.parentElement.replaceChild(formContainer, form);

  }, 1500);
}

// Initialize multi-step form functionality
function initMultiStepForms() {
  const multiStepForms = document.querySelectorAll('.multi-step-form');

  multiStepForms.forEach(form => {
    const steps = form.querySelectorAll('.step-content');
    const progress = form.querySelector('.step-progress');

    // Create progress indicators if they don't exist
    if (steps.length > 1 && !progress) {
      const progressContainer = document.createElement('div');
      progressContainer.classList.add('step-progress', 'flex', 'justify-center', 'items-center', 'mb-8');

      steps.forEach((step, index) => {
        const isActive = index === 0;

        // Create step indicator
        const indicator = document.createElement('div');
        indicator.classList.add('step-indicator', 'flex', 'items-center');

        // Step number circle
        const circle = document.createElement('div');
        circle.classList.add('h-8', 'w-8', 'rounded-full', 'flex', 'items-center', 'justify-center', 'text-sm', 'font-medium', 'transition-colors');
        circle.classList.add(isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700');
        circle.textContent = (index + 1).toString();
        indicator.appendChild(circle);

        // Step label
        const label = document.createElement('span');
        label.classList.add('ml-2', 'text-sm', 'font-medium', 'hidden', 'sm:block', 'transition-colors');
        label.classList.add(isActive ? 'text-gray-900' : 'text-gray-500');
        label.textContent = step.dataset.title || `Step ${index + 1}`;
        indicator.appendChild(label);

        // Add to container
        progressContainer.appendChild(indicator);

        // Add separator line except for last step
        if (index < steps.length - 1) {
          const line = document.createElement('div');
          line.classList.add('flex-1', 'h-px', 'bg-gray-300', 'mx-4');
          progressContainer.appendChild(line);
        }
      });

      // Insert progress at the top of form
      form.insertBefore(progressContainer, form.firstChild);
    }

    // Initialize navigation buttons if not already present
    steps.forEach((step, index) => {
      const existingNavigation = step.querySelector('.step-navigation');

      if (!existingNavigation && steps.length > 1) {
        const navigation = document.createElement('div');
        navigation.classList.add('step-navigation', 'flex', 'justify-between', 'mt-8');

        // Previous button (except for first step)
        if (index > 0) {
          const prevButton = document.createElement('button');
          prevButton.type = 'button';
          prevButton.classList.add('px-4', 'py-2', 'border', 'border-gray-300', 'text-gray-700', 'rounded', 'hover:bg-gray-50', 'transition-colors', 'prev-step');
          prevButton.textContent = 'Previous';
          prevButton.addEventListener('click', () => goToPrevStep(form));
          navigation.appendChild(prevButton);
        } else {
          // Empty div for spacing
          const spacer = document.createElement('div');
          navigation.appendChild(spacer);
        }

        // Next/Submit button
        const nextButton = document.createElement('button');
        nextButton.classList.add('px-4', 'py-2', 'bg-primary', 'text-white', 'rounded', 'hover:bg-primary-dark', 'transition-colors');

        if (index === steps.length - 1) {
          // Last step - submit button
          nextButton.type = 'submit';
          nextButton.textContent = 'Submit';
        } else {
          // Next step button
          nextButton.type = 'button';
          nextButton.classList.add('next-step');
          nextButton.textContent = 'Next';
          nextButton.addEventListener('click', () => validateAndGoNext(form, step));
        }

        navigation.appendChild(nextButton);
        step.appendChild(navigation);
      }
    });

    // Show only first step initially
    steps.forEach((step, index) => {
      if (index === 0) {
        step.classList.remove('hidden');
      } else {
        step.classList.add('hidden');
      }
    });
  });
}

// Validate current step and move to next if valid
function validateAndGoNext(form, currentStep) {
  const fields = currentStep.querySelectorAll('input, select, textarea');
  let isValid = true;

  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  if (isValid) {
    goToNextStep(form);
  } else {
    scrollToFirstError(form);
  }
}

// Navigate to next step
function goToNextStep(form) {
  const steps = form.querySelectorAll('.step-content');
  const progressIndicators = form.querySelectorAll('.step-indicator');
  let currentIndex = -1;

  // Find current visible step
  steps.forEach((step, index) => {
    if (!step.classList.contains('hidden')) {
      currentIndex = index;
    }
  });

  if (currentIndex >= 0 && currentIndex < steps.length - 1) {
    // Hide current step
    steps[currentIndex].classList.add('hidden');

    // Show next step
    steps[currentIndex + 1].classList.remove('hidden');

    // Update progress indicators
    if (progressIndicators.length > 0) {
      // Update previous step indicator
      if (progressIndicators[currentIndex]) {
        const circle = progressIndicators[currentIndex].querySelector('div');
        const label = progressIndicators[currentIndex].querySelector('span');

        circle.classList.remove('bg-primary', 'text-white');
        circle.classList.add('bg-green-500', 'text-white');

        // Add check mark
        circle.innerHTML = `
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                `;
      }

      // Update new step indicator
      if (progressIndicators[currentIndex + 1]) {
        const circle = progressIndicators[currentIndex + 1].querySelector('div');
        const label = progressIndicators[currentIndex + 1].querySelector('span');

        circle.classList.remove('bg-gray-200', 'text-gray-700');
        circle.classList.add('bg-primary', 'text-white');

        if (label) {
          label.classList.remove('text-gray-500');
          label.classList.add('text-gray-900');
        }
      }
    }

    // Scroll to top of form
    const formTop = form.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({
      top: formTop,
      behavior: 'smooth'
    });
  }
}

// Navigate to previous step
function goToPrevStep(form) {
  const steps = form.querySelectorAll('.step-content');
  const progressIndicators = form.querySelectorAll('.step-indicator');
  let currentIndex = -1;

  // Find current visible step
  steps.forEach((step, index) => {
    if (!step.classList.contains('hidden')) {
      currentIndex = index;
    }
  });

  if (currentIndex > 0) {
    // Hide current step
    steps[currentIndex].classList.add('hidden');

    // Show previous step
    steps[currentIndex - 1].classList.remove('hidden');

    // Update progress indicators
    if (progressIndicators.length > 0) {
      // Update current step indicator
      if (progressIndicators[currentIndex]) {
        const circle = progressIndicators[currentIndex].querySelector('div');
        const label = progressIndicators[currentIndex].querySelector('span');

        circle.classList.remove('bg-primary', 'text-white');
        circle.classList.add('bg-gray-200', 'text-gray-700');
        circle.textContent = (currentIndex + 1).toString();

        if (label) {
          label.classList.remove('text-gray-900');
          label.classList.add('text-gray-500');
        }
      }

      // Update previous step indicator
      if (progressIndicators[currentIndex - 1]) {
        const circle = progressIndicators[currentIndex - 1].querySelector('div');
        const label = progressIndicators[currentIndex - 1].querySelector('span');

        if (circle.classList.contains('bg-green-500')) {
          circle.classList.remove('bg-green-500');
          circle.classList.add('bg-primary');
          circle.textContent = currentIndex.toString();
        }
      }
    }

    // Scroll to top of form
    const formTop = form.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({
      top: formTop,
      behavior: 'smooth'
    });
  }
}