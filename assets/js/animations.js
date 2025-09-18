// Animation and visualization JavaScript functions

// Add scroll progress bar
function addScrollProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.classList.add('fixed', 'top-0', 'left-0', 'h-1', 'bg-primary', 'z-50', 'transition-all', 'duration-300');
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (window.scrollY / scrollTotal) * 100;
    progressBar.style.width = `${scrollProgress}%`;

    // Show/hide the progress bar
    if (window.scrollY > 100) {
      progressBar.style.opacity = '1';
    } else {
      progressBar.style.opacity = '0';
    }
  });
}

// Initialize data visualizations
function initDataVisualizations() {
  // Use Intersection Observer for better performance
  const visObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find all chart elements within the section
        const charts = entry.target.querySelectorAll('.data-chart');
        charts.forEach(chart => {
          animateChart(chart);
        });

        // Animate dashboard elements with staggered timing
        const dashboardElements = entry.target.querySelectorAll('.dashboard-card');
        dashboardElements.forEach((element, index) => {
          setTimeout(() => {
            element.classList.add('active');
          }, index * 150);
        });

        visObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  // Observe visualization sections
  document.querySelectorAll('.data-visualization-section').forEach(section => {
    visObserver.observe(section);
  });

  // Add data-visualization-section class to the visualization section
  const vizSection = document.querySelector('section:has(.interactive-dashboard)');
  if (vizSection) {
    vizSection.classList.add('data-visualization-section');
  }

  // Also observe the existing Dynamic Data Visualization Section
  document.querySelectorAll('section').forEach(section => {
    if (section.innerHTML.includes('Data Insights') ||
      section.innerHTML.includes('Performance Analytics')) {
      section.classList.add('data-visualization-section');
      visObserver.observe(section);
    }
  });
}

// Animated chart rendering based on chart type
function animateChart(chartElement) {
  // Get chart type from data attribute or class
  const chartType = chartElement.dataset.chartType || detectChartType(chartElement);

  switch (chartType) {
    case 'line':
      animateLineChart(chartElement);
      break;
    case 'bar':
      animateBarChart(chartElement);
      break;
    case 'pie':
      animatePieChart(chartElement);
      break;
    case 'area':
      animateAreaChart(chartElement);
      break;
    case 'gauge':
      animateGaugeChart(chartElement);
      break;
    default:
      // Default animation for unknown chart types
      chartElement.classList.add('animated');
      break;
  }

  // Add interactive elements
  addChartInteractions(chartElement, chartType);
}

// Detect chart type based on content
function detectChartType(chartElement) {
  const html = chartElement.innerHTML.toLowerCase();

  if (html.includes('path d="m') || html.includes('stroke-dasharray')) {
    return 'line';
  } else if (html.includes('rect') && !html.includes('circle')) {
    return 'bar';
  } else if (html.includes('circle') && html.includes('stroke-dashoffset')) {
    return 'gauge';
  } else if (html.includes('pie')) {
    return 'pie';
  } else if (html.includes('polygon') ||
    (html.includes('path') && html.includes('fill') && !html.includes('none'))) {
    return 'area';
  }

  return 'generic';
}

// Add interactive elements to charts
function addChartInteractions(chartElement, chartType) {
  // Add hover effects to data points
  const dataPoints = chartElement.querySelectorAll('.chart-point, circle');
  dataPoints.forEach(point => {
    // Skip if it's a structural circle (like gauge background)
    if (point.getAttribute('r') > 10) return;

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.classList.add('chart-tooltip', 'hidden', 'absolute', 'bg-dark', 'text-white', 'py-1', 'px-2',
      'rounded', 'text-xs', 'pointer-events-none', 'z-50', 'transform', '-translate-x-1/2',
      '-translate-y-full', 'opacity-0', 'transition-opacity');

    // Get data values from attributes or generate sample ones
    const value = point.dataset.value || Math.floor(Math.random() * 100);
    const label = point.dataset.label || 'Data point';

    tooltip.innerHTML = `<strong>${label}:</strong> ${value}`;
    document.body.appendChild(tooltip);

    // Hover effects
    point.addEventListener('mouseenter', () => {
      // Expand point
      const currentR = parseFloat(point.getAttribute('r'));
      point.setAttribute('r', currentR * 1.8);
      point.style.zIndex = '10';

      // Show tooltip
      const rect = point.getBoundingClientRect();
      tooltip.style.left = rect.left + 'px';
      tooltip.style.top = (rect.top - 10) + 'px';
      tooltip.classList.remove('hidden', 'opacity-0');
      tooltip.classList.add('opacity-100');
    });

    point.addEventListener('mouseleave', () => {
      // Restore point
      const currentR = parseFloat(point.getAttribute('r'));
      point.setAttribute('r', currentR / 1.8);
      point.style.zIndex = '';

      // Hide tooltip
      tooltip.classList.add('opacity-0');
      setTimeout(() => {
        tooltip.classList.add('hidden');
      }, 300);
    });
  });
}

// Animation function for line charts
function animateLineChart(chartElement) {
  // Find path elements for line and area
  const paths = chartElement.querySelectorAll('path');
  const linePath = Array.from(paths).find(path =>
    path.getAttribute('fill') === 'none' ||
    path.classList.contains('chart-line')
  );

  const areaPath = Array.from(paths).find(path =>
    path.getAttribute('fill') !== 'none' &&
    !path.classList.contains('chart-line') &&
    !path.classList.contains('gauge-progress')
  );

  // Animate line with dasharray if not already animated
  if (linePath && !linePath.style.animation) {
    const length = linePath.getTotalLength ? linePath.getTotalLength() : 1000;
    linePath.style.strokeDasharray = length;
    linePath.style.strokeDashoffset = length;

    const animation = linePath.animate(
      [
        { strokeDashoffset: length },
        { strokeDashoffset: 0 }
      ],
      {
        duration: 1500,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );

    // Animate area fill after line completes
    if (areaPath) {
      areaPath.style.opacity = '0';
      animation.onfinish = () => {
        areaPath.animate(
          [
            { opacity: 0 },
            { opacity: 0.2 }
          ],
          {
            duration: 800,
            easing: 'ease-out',
            fill: 'forwards'
          }
        );
      };
    }
  }

  // Animate data points
  const points = chartElement.querySelectorAll('.chart-point, circle[r="3"], circle[r="4"]');
  points.forEach((point, index) => {
    point.style.opacity = '0';

    setTimeout(() => {
      point.animate(
        [
          { opacity: 0, r: 0 },
          { opacity: 1, r: point.getAttribute('r') }
        ],
        {
          duration: 300,
          easing: 'ease-out',
          fill: 'forwards',
          delay: index * 100 // Staggered animation
        }
      );
    }, 1000); // Start after line has begun animating
  });
}

// Animation function for bar charts
function animateBarChart(chartElement) {
  // Find all bar elements (rectangles)
  const bars = chartElement.querySelectorAll('rect:not(.bg-rect)');

  bars.forEach((bar, index) => {
    // Save original height and y position
    const originalHeight = parseFloat(bar.getAttribute('height')) || 0;
    const originalY = parseFloat(bar.getAttribute('y')) || 0;

    // Start from zero height
    bar.setAttribute('height', '0');
    bar.setAttribute('y', originalY + originalHeight);

    // Animate to full height
    setTimeout(() => {
      bar.animate(
        [
          { height: 0, y: originalY + originalHeight },
          { height: originalHeight, y: originalY }
        ],
        {
          duration: 1000,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards'
        }
      );
    }, index * 100); // Stagger animation
  });
}

// Animation function for pie/donut charts
function animatePieChart(chartElement) {
  // Find all path elements that make up the pie segments
  const segments = chartElement.querySelectorAll('path:not(.bg-circle)');

  segments.forEach((segment, index) => {
    // Get original end angle from data or guess based on position
    const endAngle = segment.dataset.endAngle || (index + 1) * (360 / segments.length);
    const startAngle = segment.dataset.startAngle || (index) * (360 / segments.length);

    // Create animation for each segment growing from 0 to full angle
    if (segment.nodeName === 'path') {
      // For SVG paths, we need to animate the d attribute
      // This requires more complex path generation
      const center = { x: 50, y: 50 }; // Assuming viewBox is 100x100
      const radius = 40;

      // Make segments appear in sequence
      setTimeout(() => {
        segment.style.opacity = '1';
        segment.style.transform = 'scale(1.1)';
        setTimeout(() => {
          segment.style.transform = 'scale(1)';
        }, 200);
      }, index * 150);
    }
  });
}

// Animation function for area charts
function animateAreaChart(chartElement) {
  // Area charts are similar to line charts but focus on the area fill
  const paths = chartElement.querySelectorAll('path');

  paths.forEach((path, index) => {
    // Skip if it's not a data path
    if (path.classList.contains('grid-line')) return;

    // Start with zero height/opacity
    path.style.opacity = '0';
    const originalPath = path.getAttribute('d');

    // Set initial state - compress to bottom
    // This is a simplification; proper implementation would modify path data
    path.style.transform = 'scaleY(0.1) translateY(90%)';
    path.style.opacity = '0.3';

    // Animate to full height/opacity
    setTimeout(() => {
      path.animate(
        [
          { transform: 'scaleY(0.1) translateY(90%)', opacity: 0.3 },
          { transform: 'scaleY(1) translateY(0)', opacity: 1 }
        ],
        {
          duration: 1200,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards'
        }
      );
    }, index * 200); // Stagger for multiple areas
  });
}

// Animation function for gauge charts
function animateGaugeChart(chartElement) {
  // Find the gauge progress path and indicator
  const gaugePath = chartElement.querySelector('.gauge-progress, path[stroke-dasharray]');
  const indicator = chartElement.querySelector('circle:not([r="54"])');

  if (gaugePath) {
    // Get the dasharray and dashoffset values
    const dashArray = parseFloat(gaugePath.getAttribute('stroke-dasharray')) || 157;
    const initialOffset = dashArray; // Start from empty

    // Get target value from data attribute or class
    const container = chartElement.closest('.flex, .grid');
    const counterElement = container ? container.querySelector('.counter-value') : null;
    const targetValue = counterElement ?
      parseFloat(counterElement.dataset.target) / 100 : 0.75;

    const targetOffset = dashArray * (1 - targetValue);

    // Animate the gauge filling
    gaugePath.animate(
      [
        { strokeDashoffset: initialOffset },
        { strokeDashoffset: targetOffset }
      ],
      {
        duration: 2000,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );

    // Animate the indicator if present
    if (indicator) {
      // Calculate the path for the indicator to follow
      // This is complex and depends on the gauge's geometry
      // For simplicity, we'll just fade it in
      indicator.style.opacity = '0';

      setTimeout(() => {
        indicator.animate(
          [
            { opacity: 0 },
            { opacity: 1 }
          ],
          {
            duration: 300,
            fill: 'forwards'
          }
        );
      }, 1000);
    }
  }
}