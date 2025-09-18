# Account Ability

**Build a 7-Figure Accounting Firm Without Burnout**

## Overview

Account Ability is a modern, responsive landing page and webinar registration platform for accounting firm owners. The site is designed to showcase strategies for scaling to a 7-figure firm without burnout or hiring full-time staff. It features a visually engaging hero section, interactive benefits, testimonials, instructor bios, and a registration system for live webinars.

## Features

- **Modern UI/UX**: Built with Tailwind CSS, Google Fonts, and Font Awesome for a clean, professional look.
- **Animated Hero Section**: GSAP and AOS power initial load and scroll-based animations for an attractive entrance.
- **Responsive Design**: Mobile-friendly layout with adaptive navigation and content sections.
- **Webinar Registration**: Countdown timer, registration form, and event details.
- **Interactive Sections**: Benefits, roadmap, testimonials, and instructor bios with animated cards and carousels.
- **Accessibility**: Skip links, ARIA labels, and accessible navigation.
- **Performance Enhancements**: Preloading critical resources, scroll progress bar, and optimized assets.

## Technologies Used

- **HTML5 & CSS3**: Semantic markup and custom styles.
- **Tailwind CSS**: Utility-first CSS framework via CDN.
- **Google Fonts**: Montserrat, Lora, Source Sans Pro for professional typography.
- **Font Awesome**: Icon library for UI elements.
- **GSAP**: Advanced JavaScript animations and scroll effects.
- **AOS (Animate On Scroll)**: Simple scroll-triggered animations.
- **Swiper.js**: Testimonial carousel and sliders.
- **JavaScript Modules**: Modular scripts for animations, forms, parallax, and more.

## Project Structure

```
Account Ability/
├── index.html                # Main landing page
├── assets/
│   ├── css/
│   │   └── styles.css        # Custom styles and utility classes
│   ├── js/
│   │   ├── animations.js     # Scroll progress bar, chart animations
│   │   ├── forms.js          # Registration form logic
│   │   ├── main.js           # Site initialization and core logic
│   │   ├── parallax.js       # Parallax and scroll effects
│   │   ├── tailwind-config.js# Tailwind custom config
│   │   ├── utils.js          # Utility functions
│   │   └── webinar.js        # Webinar-specific logic
│   └── images/               # Site images and icons
├── README.md                 # Project documentation
```

## How It Works

- **Animations**: On page load, hero section elements animate in sequence using GSAP for a cinematic effect. Scroll-based animations are handled by AOS and GSAP ScrollTrigger.
- **Responsive Layout**: The site adapts to all screen sizes, with mobile navigation and touch-friendly elements.
- **Webinar Registration**: Users can register for the webinar, view a countdown timer, and see event details.
- **Interactive Cards & Carousels**: Benefits, testimonials, and instructor sections use animated cards and Swiper.js for engaging content presentation.

## Getting Started

1. **Clone the repository** or download the source files.
2. **Open `index.html`** in your browser. All dependencies are loaded via CDN.
3. **Customize content** in `index.html` and assets as needed for your brand or event.

## Customization

- **Fonts**: Change Google Fonts in the `<head>` section of `index.html`.
- **Colors**: Update Tailwind config and CSS variables for your brand palette.
- **Animations**: Modify GSAP and AOS settings in the JS files for custom effects.
- **Content**: Edit HTML sections for your webinar, instructors, testimonials, and more.

## Accessibility

- Skip links and ARIA labels for improved navigation.
- Responsive and keyboard-friendly UI components.

## License

This project is for educational and demonstration purposes. For commercial use, please ensure you have rights to all assets and dependencies.
