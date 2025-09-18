# Account Ability Website Documentation

## Project Structure

The Account Ability website has been reorganized into a more maintainable structure with proper separation of concerns. This document outlines the current structure and provides guidance for future maintenance.

```
/
├── index.html            # Main HTML file
├── README.md             # Project documentation
├── assets/               # All static assets organized by type
│   ├── css/              # CSS stylesheets
│   │   └── styles.css    # Main stylesheet with all styles
│   ├── js/               # JavaScript files
│   │   ├── main.js       # Main JavaScript initialization
│   │   ├── animations.js # Animation-related functions
│   │   ├── utils.js      # Utility functions
│   │   ├── forms.js      # Form handling and validation
│   │   ├── webinar.js    # Webinar-specific functionality
│   │   └── tailwind-config.js # Tailwind configuration
│   ├── images/           # Image files (to be populated)
│   │   └── ...           # Various site images
│   └── fonts/            # Font files (if using custom fonts)
```

## Code Organization

### HTML Structure

The `index.html` file contains the main content structure for the website. It uses a modern, semantic HTML5 approach with properly organized sections. The head section includes references to external stylesheets and scripts.

### CSS Structure

CSS has been organized into a single `styles.css` file with logical sections:

1. **Base styles and imports** - Font imports and global styles
2. **Animations** - All keyframe animations
3. **Component Styles** - Specific styles for UI components
4. **Swiper Slider Styles** - Custom styling for testimonial sliders
5. **Utility Classes** - Reusable utility classes
6. **Section-specific Styles** - Styles for specific sections
7. **Animation Classes** - Classes that apply animations
8. **Button Styles** - Custom button styling

### JavaScript Modules

JavaScript has been organized into functional modules:

1. **main.js** - Contains the main initialization code and document-ready functions
   - Sets up event listeners
   - Initializes components
   - Orchestrates other modules

2. **animations.js** - Contains animation-related functionality
   - Data visualization animations
   - Chart animations
   - Visual effects

3. **utils.js** - Contains utility functions
   - Mobile menu toggle
   - Sticky header
   - Smooth scrolling
   - Form validation
   - Dropdowns
   - Tab functionality
   - Counters

4. **forms.js** - Handles form processing
   - Form validation
   - AJAX form submission
   - Multi-step forms
   - Error handling
   - Success messages

5. **webinar.js** - Contains webinar-specific functionality
   - Registration form
   - Countdown timer
   - Speaker information
   - FAQ toggles
   - Social sharing

6. **tailwind-config.js** - Contains Tailwind CSS configuration
   - Custom colors
   - Typography settings
   - Animation settings
   - Component extensions

## Maintenance Guidelines

### Adding New Features

When adding new features:

1. Identify which module the functionality belongs in
2. Add new functions to the appropriate file
3. Initialize the feature in main.js if needed
4. Add any new CSS to the appropriate section of styles.css

### Image Assets

Images should be:

1. Optimized for web (compressed, appropriate format)
2. Stored in the `assets/images/` directory
3. Referenced with relative paths from HTML

### Future Improvements

Potential improvements for the future:

1. Further modularize CSS into component-specific files
2. Add a build process with Webpack or Parcel
3. Implement a CSS preprocessor like SASS
4. Create a component library for reusable UI elements
5. Implement image optimization as part of the build process