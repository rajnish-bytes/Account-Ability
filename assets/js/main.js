// Main JavaScript functions for Account Ability website

// Initialize AOS with enhanced settings for smoother animations
function initAOS() {
  AOS.init({
    duration: 800,
    once: false,
    offset: 100,
    easing: 'ease-out-cubic',
    delay: 100,
    mirror: true // whether elements should animate out while scrolling past them
  });
}

// Register GSAP ScrollTrigger plugin globally
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);
}

// Document ready function to initialize all components
document.addEventListener('DOMContentLoaded', function () {
  // Initialize animations
  initAOS();
  initGSAP();

  // Create particles for hero section
  const particlesContainer = document.getElementById('particles-js');
  if (particlesContainer) {
    createParticles(particlesContainer);
  }

  // Create 3D grid effect
  const gridContainer = document.getElementById('grid3d');
  if (gridContainer) {
    create3DGrid(gridContainer);
  }

  // Initialize dashboard hover effect
  const dashboard = document.getElementById('dashboard-mockup');
  if (dashboard) {
    initDashboardEffect(dashboard);
  }

  // Initialize testimonial slider
  initTestimonialSlider();

  // Initialize case study tabs
  initCaseStudyTabs();

  // Initialize data visualizations
  initDataVisualizations();

  // Add data-chart class to chart elements
  document.querySelectorAll('svg:not(.fa-icon)').forEach(svg => {
    if (svg.querySelector('path, circle, rect')) {
      svg.classList.add('data-chart');

      // Try to detect chart type
      const chartType = detectChartType(svg);
      if (chartType) {
        svg.dataset.chartType = chartType;
      }
    }
  });

  // Add data-visualization-section class to appropriate sections
  document.querySelectorAll('section').forEach(section => {
    if (section.querySelector('.data-chart') ||
      section.innerHTML.includes('Data Insights') ||
      section.innerHTML.includes('Real-Time Performance')) {
      section.classList.add('data-visualization-section');
    }
  });

  // Add scroll-based progress bar
  addScrollProgressBar();

  // Add parallax sections
  initParallaxSections();

  // Initialize counters to animate on scroll
  initCounters();

  // Initialize countdown timer
  initCountdownTimer();
});

// Create particle network for hero section
function createParticles(container) {
  const particleCount = 50;
  const particlesHTML = Array(particleCount).fill().map(() => {
    const size = Math.random() * 4 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const opacity = Math.random() * 0.5 + 0.1;
    const animationDuration = Math.random() * 20 + 10;
    const animationDelay = Math.random() * 10;

    return `<div class="absolute w-${size} h-${size} rounded-full bg-white opacity-${opacity}" 
                  style="left:${x}%; top:${y}%; animation: float ${animationDuration}s infinite ${animationDelay}s;"></div>`;
  }).join('');

  container.innerHTML = particlesHTML;
}

// Create 3D grid effect for hero section
function create3DGrid(container) {
  const gridHTML = `
        <div class="w-full h-full opacity-10" 
             style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); 
                    background-size: 40px 40px; 
                    transform: perspective(1000px) rotateX(60deg) scale(2); 
                    transform-origin: center center;">
        </div>
    `;
  container.innerHTML = gridHTML;
}

// Initialize 3D hover effect for dashboard mockup
function initDashboardEffect(dashboard) {
  dashboard.addEventListener('mousemove', (e) => {
    const rect = dashboard.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Calculate rotation based on mouse position
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 5;
    const rotateX = -((mouseY - centerY) / (rect.height / 2)) * 5;

    // Apply transform with smooth transition
    dashboard.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  });

  dashboard.addEventListener('mouseleave', () => {
    dashboard.style.transform = 'perspective(1000px) rotateY(-10deg) rotateX(5deg)';
  });
}

// Initialize modern testimonial slider with Swiper
function initTestimonialSlider() {
  // Check if Swiper exists
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper not loaded. Falling back to basic slider.');
    return initBasicTestimonialSlider();
  }

  // Initialize Swiper for testimonials with cards effect
  const testimonialSwiper = new Swiper(".testimonialSwiper", {
    effect: "slide", // Changed from cards effect to standard slide
    grabCursor: true,
    loop: true,
    initialSlide: 0, // Explicitly start with first slide
    loopedSlides: 1, // Help ensure proper loop behavior
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 3
    },
    // Fixed direction for correct sliding
    direction: "horizontal",
    // Standard slider settings for reliable behavior
    watchSlidesProgress: false,
    virtualTranslate: false,
    speed: 600,
    slidesPerView: 1,
    centeredSlides: true,
    on: {
      init: function (swiper) {
        console.log("Swiper testimonials initialized");
        // Ensure we're showing the first slide
        setTimeout(() => {
          swiper.slideTo(0, 0, false);
        }, 100);
      },
      afterInit: function (swiper) {
        // Double-check proper initialization
        swiper.slideTo(0, 0, false);
      }
    }
  });

  // Apply fade-in animation to slides
  const slides = document.querySelectorAll('.swiper-slide');
  slides.forEach((slide, index) => {
    slide.style.opacity = '0';
    slide.style.transform = 'translateY(20px)';
    slide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    setTimeout(() => {
      slide.style.opacity = '1';
      slide.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
  });

  // Ensure starting at first slide after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      testimonialSwiper.slideTo(0, 0);
      console.log('Forced slide reset to first slide');
    }, 500);
  });

  return testimonialSwiper;
}

// Fallback testimonial slider (for browsers without Swiper)
function initBasicTestimonialSlider() {
  const track = document.getElementById('testimonial-track');
  if (!track) return;

  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const indicators = document.querySelectorAll('.testimonial-indicator');
  const slideWidth = 100;
  let currentIndex = 0;

  // Update slide position
  function updateSlidePosition() {
    // For mobile, show one at a time; for desktop, apply different logic
    const isMobile = window.innerWidth < 1024;
    const offset = isMobile ? currentIndex * -100 : currentIndex * -33.333;
    track.style.transform = `translateX(${offset}%)`;

    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('bg-primary');
        indicator.classList.remove('bg-gray-300');
      } else {
        indicator.classList.remove('bg-primary');
        indicator.classList.add('bg-gray-300');
      }
    });
  }

  // Navigation buttons
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateSlidePosition();
    });

    nextBtn.addEventListener('click', () => {
      const maxIndex = Math.max(0, slides.length - (window.innerWidth < 1024 ? 1 : 3));
      currentIndex = Math.min(maxIndex, currentIndex + 1);
      updateSlidePosition();
    });
  }

  // Handle window resize
  window.addEventListener('resize', updateSlidePosition);
}

// Initialize case study tabs
function initCaseStudyTabs() {
  const tabs = document.querySelectorAll('.case-study-tab');
  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all tabs and panels
      document.querySelectorAll('.case-study-tab').forEach(t => {
        t.classList.remove('active', 'bg-primary', 'text-white');
        t.classList.add('text-primary', 'hover:bg-primary/5');
      });
      document.querySelectorAll('.case-study-panel').forEach(p => {
        p.classList.add('hidden');
      });

      // Activate clicked tab and corresponding panel
      tab.classList.add('active', 'bg-primary', 'text-white');
      tab.classList.remove('text-primary', 'hover:bg-primary/5');

      const targetPanel = document.getElementById(tab.dataset.tab);
      if (targetPanel) {
        targetPanel.classList.remove('hidden');
        targetPanel.classList.add('active');
      }
    });
  });
}

// FAQ Toggle Function with smoother animations
function toggleFAQ(element) {
  const content = element.nextElementSibling;
  const icon = element.querySelector('i');
  const parent = element.closest('.card-hover');

  // Close any other open FAQs
  document.querySelectorAll('.faq-content.active').forEach(item => {
    if (item !== content) {
      // Only process already open items that aren't the current one
      item.classList.remove('active');

      // Reset other icons with smooth animation
      const otherIcon = item.previousElementSibling.querySelector('i');
      otherIcon.classList.remove('fa-minus');
      otherIcon.classList.add('fa-plus');
      otherIcon.style.transform = 'rotate(0deg)';

      // Remove highlight from other cards
      const otherParent = item.previousElementSibling.closest('.card-hover');
      if (otherParent) otherParent.classList.remove('border-primary');
    }
  });

  // Toggle the current FAQ
  if (!content.classList.contains('active')) {
    // Open this FAQ
    content.classList.add('active');

    // Animate icon
    icon.classList.remove('fa-plus');
    icon.classList.add('fa-minus');
    icon.style.transform = 'rotate(180deg)';

    // Highlight this card
    if (parent) parent.classList.add('border-primary');
  } else {
    // Close this FAQ
    content.classList.remove('active');

    // Animate icon back
    icon.classList.remove('fa-minus');
    icon.classList.add('fa-plus');
    icon.style.transform = 'rotate(0deg)';

    // Remove highlight
    if (parent) parent.classList.remove('border-primary');
  }
}

// Initialize countdown timer for webinar
function initCountdownTimer() {
  // Countdown timer functionality
  const countdownElements = {
    days: document.getElementById('days-count'),
    hours: document.getElementById('hours-count'),
    minutes: document.getElementById('minutes-count'),
    seconds: document.getElementById('seconds-count')
  };

  // Check if countdown elements exist
  if (!countdownElements.days || !countdownElements.hours ||
    !countdownElements.minutes || !countdownElements.seconds) {
    return; // Exit if elements don't exist
  }

  // Set the webinar date (3 days from now)
  const now = new Date();
  const webinarDate = new Date(now);
  webinarDate.setDate(webinarDate.getDate() + 3);
  webinarDate.setHours(18, 0, 0, 0); // 6:00 PM

  function updateCountdown() {
    const currentTime = new Date();
    const difference = webinarDate - currentTime;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Update countdown elements if they exist
      if (countdownElements.days) countdownElements.days.textContent = days.toString().padStart(2, '0');
      if (countdownElements.hours) countdownElements.hours.textContent = hours.toString().padStart(2, '0');
      if (countdownElements.minutes) countdownElements.minutes.textContent = minutes.toString().padStart(2, '0');
      if (countdownElements.seconds) countdownElements.seconds.textContent = seconds.toString().padStart(2, '0');
    }
  }

  // Initial update
  updateCountdown();

  // Update countdown every second
  setInterval(updateCountdown, 1000);

  // Fix for absolute positioned elements scrolling down incorrectly
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const absoluteElements = section.querySelectorAll('.absolute');
    if (absoluteElements.length > 0) {
      // Make sure the section has position relative to contain absolute elements
      if (!section.classList.contains('relative')) {
        section.classList.add('relative');
      }

      // Add containing context to section
      section.style.contain = section.style.contain || 'paint layout';
    }
  });
}