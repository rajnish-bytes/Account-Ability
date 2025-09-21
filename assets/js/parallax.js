// Parallax effects for the website

// Enhanced parallax sections with GSAP
function initEnhancedParallaxSections() {
  // Check if we're on mobile (screen width less than 768px)
  const isMobile = window.innerWidth < 768;

  // Only apply parallax effects on desktop (non-mobile) screens
  if (isMobile) {
    console.log('Mobile detected: Enhanced parallax effects disabled');
    return; // Exit the function early on mobile devices
  }

  const parallaxSections = document.querySelectorAll('section');

  // Create a ScrollTrigger for each section
  parallaxSections.forEach(section => {
    const sectionId = section.id || `section-${Math.random().toString(36).substr(2, 9)}`;
    if (!section.id) section.id = sectionId;

    // Find parallax elements in the section
    const parallaxElements = section.querySelectorAll('.morphing-blob, .animate-float, .float-circle');
    const bgElements = section.querySelectorAll('.bg-gradient-to-br, .bg-gradient-to-r');
    const textElements = section.querySelectorAll('h1, h2, h3, .gradient-text');

    // Apply enhanced parallax with GSAP
    if (parallaxElements.length > 0) {
      parallaxElements.forEach((element, index) => {
        const speed = 0.2 + (index * 0.05);
        const direction = index % 2 === 0 ? 1 : -1;

        gsap.to(element, {
          y: direction * 50 * speed,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            toggleActions: "play none none reverse"
          }
        });

        // Add subtle rotation for more dimension
        gsap.to(element, {
          rotate: direction * 5 * speed,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    }

    // Enhance background elements with reveal effects
    if (bgElements.length > 0) {
      bgElements.forEach(element => {
        gsap.fromTo(element,
          { opacity: 0.3 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'center center',
              scrub: true,
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }

    // Add subtle text animations on scroll
    if (textElements.length > 0) {
      textElements.forEach(element => {
        gsap.fromTo(element,
          { textShadow: '0px 0px 0px rgba(255, 255, 255, 0)' },
          {
            textShadow: '0px 0px 8px rgba(255, 255, 255, 0.3)',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              end: 'center center',
              scrub: true
            }
          }
        );
      });
    }

    // Add 3D rotation to the entire section for depth
    gsap.to(section, {
      rotationX: 0.5,
      rotationY: 0.5,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

// Initialize parallax sections with GSAP ScrollTrigger
function initParallaxSections() {
  // Register ScrollTrigger plugin with GSAP
  gsap.registerPlugin(ScrollTrigger);

  // Check if we're on mobile (screen width less than 768px)
  const isMobile = window.innerWidth < 768;

  // Only apply parallax effects on desktop (non-mobile) screens
  if (isMobile) {
    console.log('Mobile detected: Parallax effects disabled');
    return; // Exit the function early on mobile devices
  }

  // Create parallax effect specifically for the hero section
  const heroSection = document.getElementById('hero-section');
  if (heroSection) {
    const parallaxElements = heroSection.querySelectorAll('.parallax-element');

    // Create a ScrollTrigger for the hero section
    if (parallaxElements.length > 0) {
      ScrollTrigger.create({
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: self => {
          // Update parallax positions based on scroll progress
          parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed || 0.2);
            const direction = element.dataset.direction || 'vertical';

            // Calculate movement distance based on scroll progress
            if (direction === 'vertical') {
              gsap.set(element, {
                y: self.progress * -100 * speed,
                force3D: true
              });
            }
            else if (direction === 'horizontal') {
              gsap.set(element, {
                x: self.progress * -50 * speed,
                force3D: true
              });
            }
            else if (direction === 'both') {
              gsap.set(element, {
                y: self.progress * -100 * speed,
                x: self.progress * -25 * (speed / 2),
                force3D: true
              });
            }
          });
        }
      });

      // Additional rotation effect for certain elements
      heroSection.querySelectorAll('#grid3d').forEach(grid => {
        ScrollTrigger.create({
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: self => {
            const gridInner = grid.querySelector('div');
            if (gridInner) {
              const baseRotation = 60;
              const scrollRotation = self.progress * 5;
              gsap.set(gridInner, {
                rotateX: baseRotation + scrollRotation,
                y: -200 + (self.progress * -50),
                scale: 2,
                force3D: true
              });
            }
          }
        });
      });
    }

    // Create a "sticky" effect for the hero section with the next section overlapping it
    const heroContent = heroSection.querySelector('.hero-section');
    if (heroContent) {
      ScrollTrigger.create({
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,  // Improves performance by pre-pinning
        scrub: 1,  // Smooths out the scrubbing effect (value between 0.1-10)
        onUpdate: self => {
          // Keep the hero content in place with enhanced effects
          const progress = self.progress;
          gsap.set(heroContent, {
            opacity: 1 - (progress * 0.8),
            y: progress * 30,  // Slight movement as it fades
            filter: `blur(${progress * 1}px)`,  // Progressive blur effect
            force3D: true
          });

          // Add class to body to indicate active parallax scrolling
          if (progress > 0) {
            document.documentElement.classList.add('parallax-scrolling');
          } else {
            document.documentElement.classList.remove('parallax-scrolling');
          }
        }
      });
    }

    // Add mouse-based parallax for enhanced interactivity
    initMouseParallax(heroSection);
  }

  // Create overlapping effect for the pain points section
  const painPointsSection = document.getElementById('pain-points-section');
  if (painPointsSection) {
    ScrollTrigger.create({
      trigger: painPointsSection,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onEnter: () => {
        // Add subtle box shadow when entering to enhance depth
        gsap.to(painPointsSection, {
          boxShadow: '0 -15px 30px rgba(0,0,0,0.2)',
          duration: 0.5
        });
      },
      onUpdate: self => {
        // Move the section up from below with enhanced effect
        const progress = self.progress;
        const translateY = (1 - progress) * 100;
        const clipPathProgress = progress * 100;

        // Apply multiple transforms for smoother motion
        gsap.set(painPointsSection, {
          y: translateY,
          clipPath: `inset(${Math.max(0, 8 - clipPathProgress * 0.1)}% 0 0 0)`,
          boxShadow: `0 -${5 + progress * 15}px ${10 + progress * 20}px rgba(0,0,0,${0.1 + progress * 0.1})`,
          force3D: true
        });

        // Also adjust the curved shape
        const curveElement = painPointsSection.querySelector('.absolute');
        if (curveElement) {
          gsap.set(curveElement, {
            height: 50 - (progress * 30),
            opacity: 1 - (progress * 0.5)
          });
        }
      }
    });
  }

  // Handle other sections with simpler parallax effects
  document.querySelectorAll('section:not(#hero-section):not(#pain-points-section)').forEach(section => {
    const parallaxElements = section.querySelectorAll('.parallax-element');
    if (parallaxElements.length > 0) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: self => {
          parallaxElements.forEach((element, index) => {
            const speed = parseFloat(element.dataset.speed || 0.1 + (index * 0.05));
            gsap.set(element, {
              y: self.progress * -50 * speed,
              force3D: true
            });
          });
        }
      });
    }
  });
}

// Add mouse-based parallax effect for interactive movement
function initMouseParallax(section) {
  if (!section) return;

  // Check if we're on mobile (screen width less than 768px)
  const isMobile = window.innerWidth < 768;

  // Only apply mouse parallax effects on desktop (non-mobile) screens
  if (isMobile) {
    console.log('Mobile detected: Mouse parallax effects disabled');
    return; // Exit the function early on mobile devices
  }

  const parallaxElements = section.querySelectorAll('.parallax-element');
  if (parallaxElements.length === 0) return;

  // Track mouse movement within the section
  section.addEventListener('mousemove', (e) => {
    // Calculate mouse position relative to the center of the section
    const rect = section.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate the offset from center (normalized from -1 to 1)
    const offsetX = (mouseX - centerX) / centerX;
    const offsetY = (mouseY - centerY) / centerY;

    // Apply parallax effect to each element based on mouse position
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.speed || 0.2) * 15;
      const direction = element.dataset.direction || 'both';

      // Apply different movement based on direction attribute
      if (direction === 'vertical' || direction === 'both') {
        gsap.to(element, {
          y: offsetY * speed,
          duration: 1.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      if (direction === 'horizontal' || direction === 'both') {
        gsap.to(element, {
          x: offsetX * speed,
          duration: 1.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      // Special effects for certain elements
      if (element.id === 'grid3d') {
        const gridInner = element.querySelector('div');
        if (gridInner) {
          gsap.to(gridInner, {
            rotateY: offsetX * 5,
            rotateX: 60 + (offsetY * 3),
            duration: 1.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      }

      // Special effect for dashboard
      if (element.classList.contains('dashboard-3d')) {
        gsap.to(element.querySelector('#dashboard-mockup'), {
          rotateY: -12 + (offsetX * 8),
          rotateX: 5 + (offsetY * 5),
          duration: 1.5,
          ease: 'power2.out',
          transformPerspective: 1200,
          overwrite: 'auto'
        });
      }
    });
  });

  // Reset when mouse leaves the section
  section.addEventListener('mouseleave', () => {
    parallaxElements.forEach(element => {
      const direction = element.dataset.direction || 'both';

      // Smoothly return to scroll-based position
      gsap.to(element, {
        x: direction === 'vertical' ? 0 : null,
        y: direction === 'horizontal' ? 0 : null,
        duration: 1,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      // Reset special elements
      if (element.id === 'grid3d') {
        const gridInner = element.querySelector('div');
        if (gridInner) {
          gsap.to(gridInner, {
            rotateY: 0,
            rotateX: 60,
            duration: 1,
            ease: 'power2.out'
          });
        }
      }

      if (element.classList.contains('dashboard-3d')) {
        gsap.to(element.querySelector('#dashboard-mockup'), {
          rotateY: -12,
          rotateX: 5,
          duration: 1,
          ease: 'power2.out'
        });
      }
    });
  });
}

// Add cursor spotlight effect (modern UI enhancement)
function createSpotlight() {
  // Check if we're on mobile (screen width less than 768px)
  const isMobile = window.innerWidth < 768;

  // Only apply spotlight effects on desktop (non-mobile) screens
  if (isMobile) {
    console.log('Mobile detected: Spotlight effects disabled');
    return null; // Don't create spotlight on mobile
  }

  const spotlight = document.createElement('div');
  spotlight.classList.add('cursor-spotlight', 'fixed', 'pointer-events-none', 'z-50',
    'opacity-0', 'w-[300px]', 'h-[300px]', 'rounded-full');
  spotlight.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(255,255,255,0) 70%)';
  spotlight.style.transform = 'translate(-50%, -50%)';
  document.body.appendChild(spotlight);

  gsap.to(spotlight, {
    opacity: 1,
    duration: 0.5
  });

  return spotlight;
}