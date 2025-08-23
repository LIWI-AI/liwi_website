// ====================================
// LIWI LANDING PAGE JAVASCRIPT - ENHANCED VERSION
// Professional, Clean, and Feature-Rich
// ====================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ====================================
  // INITIALIZE LUCIDE ICONS
  // ====================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ====================================
  // DOM ELEMENT REFERENCES - ENHANCED
  // ====================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const animatedElements = document.querySelectorAll('.fade-in');
  const statNumbers = document.querySelectorAll('.stat-number');
  const phoneMockups = document.querySelectorAll('.phone-mockup, .step-phone');
  const comparisonRows = document.querySelectorAll('.table-row');
  const featureCards = document.querySelectorAll('.feature-card');
  const flowSteps = document.querySelectorAll('.flow-step');
  const badges = document.querySelectorAll('.badge');
  const allImages = document.querySelectorAll('img');
  
  // FAQ and other elements (removed modal elements)
  const faqItems = document.querySelectorAll('.faq-item');

  // Enhanced elements for professional features
  const hoverLiftElements = document.querySelectorAll('.hover-lift');
  const shadowElements = document.querySelectorAll('.shadow-professional');
  const pureWhiteElements = document.querySelectorAll('.bg-pure-white');

  // ====================================
  // ENHANCED UTILITY FUNCTIONS
  // ====================================
  
  // Debounce function for performance optimization
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for performance optimization
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Enhanced intersection observer with better performance
  function createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      ...options
    };
    
    return new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          callback(entry, index);
        }
      });
    }, defaultOptions);
  }

  // Professional background enforcement
  function enforcePureWhiteBackground() {
    // Ensure all body and html elements have pure white background
    document.documentElement.style.backgroundColor = '#ffffff';
    document.body.style.backgroundColor = '#ffffff';
    
    // Apply to all pure white elements
    pureWhiteElements.forEach(element => {
      element.style.backgroundColor = '#ffffff';
    });
  }

  // Enhanced spacing utilities
  function applyProfessionalSpacing() {
    // Add extra spacing between major sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      if (index > 0) { // Skip first section (hero)
        section.style.marginTop = 'var(--space-16)';
      }
    });

    // Ensure containers have proper spacing
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
      container.style.paddingLeft = 'var(--space-6)';
      container.style.paddingRight = 'var(--space-6)';
    });
  }

  // ====================================
  // ENHANCED MOBILE MENU FUNCTIONALITY
  // ====================================
  function initializeMobileMenu() {
    if (!menuToggle || !navMenu) return;

    // Enhanced mobile menu toggle with smooth animations
    menuToggle.addEventListener('click', function() {
      const isActive = navMenu.classList.contains('active');
      
      if (isActive) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    function openMenu() {
      navMenu.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      
      // Update icon with smooth transition
      const icon = menuToggle.querySelector('i');
      icon.style.transform = 'rotate(90deg)';
      setTimeout(() => {
        icon.setAttribute('data-lucide', 'x');
        icon.style.transform = 'rotate(0deg)';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }, 150);
    }

    function closeMenu() {
      navMenu.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
      
      // Update icon with smooth transition
      const icon = menuToggle.querySelector('i');
      icon.style.transform = 'rotate(-90deg)';
      setTimeout(() => {
        icon.setAttribute('data-lucide', 'menu');
        icon.style.transform = 'rotate(0deg)';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }, 150);
    }

    // Close menu when clicking nav links with smooth transition
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function(e) {
        // Add smooth transition before closing
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
          closeMenu();
        }, 100);
      });
    });

    // Enhanced outside click detection
    document.addEventListener('click', function(event) {
      if (!header.contains(event.target) && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Enhanced keyboard navigation
    menuToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });

    // Escape key to close menu
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  // ====================================
  // ENHANCED HEADER SCROLL EFFECTS
  // ====================================
  function initializeHeaderEffects() {
    let lastScrollY = window.scrollY;
    let isHeaderVisible = true;

    const handleScroll = throttle(function() {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;
      
      // Enhanced header behavior with smooth transitions
      if (currentScrollY > 100) {
        if (scrollDifference > 5 && isHeaderVisible) {
          // Scrolling down - hide header
          header.style.transform = 'translateY(-100%)';
          header.style.opacity = '0';
          isHeaderVisible = false;
        } else if (scrollDifference < -5 && !isHeaderVisible) {
          // Scrolling up - show header with enhanced background
          header.style.transform = 'translateY(0)';
          header.style.opacity = '1';
          header.style.backgroundColor = '#ffffff';
          header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
          header.style.backdropFilter = 'blur(10px)';
          isHeaderVisible = true;
        }
      } else {
        // At top of page - ensure header is visible and clean
        header.style.transform = 'translateY(0)';
        header.style.opacity = '1';
        header.style.backgroundColor = '#ffffff';
        header.style.boxShadow = 'none';
        header.style.backdropFilter = 'none';
        isHeaderVisible = true;
      }
      
      lastScrollY = currentScrollY;
    }, 16); // 60fps

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // ====================================
  // ENHANCED SMOOTH SCROLLING NAVIGATION
  // ====================================
  function initializeSmoothScrolling() {
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href.startsWith('#')) return;
        
        e.preventDefault();
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          // Enhanced smooth scrolling with easing
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 32; // Extra spacing
          
          // Close mobile menu if open
          if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
          }
          
          // Smooth scroll with custom easing
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Add visual feedback
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = 'scale(1)';
          }, 150);
        }
      });

      // Enhanced keyboard navigation
      link.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // ====================================
  // ENHANCED INTERSECTION OBSERVER ANIMATIONS
  // ====================================
  function initializeScrollAnimations() {
    const observer = createIntersectionObserver((entry, index) => {
      setTimeout(() => {
        entry.target.classList.add('animate');
        // Add extra professional styling on animation
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
      }, index * 150); // Staggered animation
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    });

    // Enhanced fade-in elements with better performance
    animatedElements.forEach((el, index) => {
      // Set initial state
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.transitionDelay = `${index * 50}ms`;
      
      observer.observe(el);
    });
  }

  // ====================================
  // ENHANCED ANIMATED COUNTERS FOR STATS
  // ====================================
  function initializeCounterAnimations() {
    const statsObserver = createIntersectionObserver((entry) => {
      animateCounter(entry.target);
    }, { 
      threshold: 0.5,
      rootMargin: '0px'
    });

    statNumbers.forEach(stat => {
      statsObserver.observe(stat);
    });

    function animateCounter(element) {
      const target = element.textContent.trim();
      const isPercentage = target.includes('%');
      const isPlus = target.includes('+');
      const hasK = target.includes('K');
      
      let numericValue = parseInt(target.replace(/[^\d]/g, ''));
      if (hasK) numericValue *= 1000;
      
      if (isNaN(numericValue)) return;
      
      let current = 0;
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const increment = numericValue / steps;
      const stepDuration = duration / steps;
      
      // Enhanced counter animation with easing
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          current = numericValue;
          clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        
        // Format large numbers
        if (displayValue >= 1000) {
          displayValue = Math.floor(displayValue / 1000) + 'K';
        }
        
        element.textContent = displayValue + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
        
        // Add pulsing effect during animation
        element.style.transform = `scale(${1 + Math.sin(current / numericValue * Math.PI) * 0.05})`;
      }, stepDuration);
      
      // Reset scale after animation
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, duration + 100);
    }
  }

  // ====================================
  // ENHANCED PHONE MOCKUP INTERACTIONS
  // ====================================
  function initializePhoneInteractions() {
    phoneMockups.forEach(phone => {
      // Enhanced hover effects with better performance
      phone.addEventListener('mouseenter', function() {
        if (window.innerWidth > 768) { // Only on desktop
          this.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          this.style.transform = this.classList.contains('phone-mockup') 
            ? 'rotateY(-5deg) rotateX(2deg) scale(1.08) translateZ(0)' 
            : 'rotateY(-2deg) rotateX(1deg) scale(1.05) translateZ(0)';
          this.style.filter = 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15))';
        }
      });
      
      phone.addEventListener('mouseleave', function() {
        if (window.innerWidth > 768) { // Only on desktop
          this.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          this.style.transform = this.classList.contains('phone-mockup')
            ? 'rotateY(-15deg) rotateX(5deg) scale(1) translateZ(0)'
            : 'rotateY(-10deg) rotateX(2deg) scale(1) translateZ(0)';
          this.style.filter = 'none';
        }
      });

      // Add subtle floating animation
      if (window.innerWidth > 768) {
        phone.style.animation = 'float 6s ease-in-out infinite';
      }
    });

    // Add floating keyframes if not exists
    if (!document.querySelector('#floating-animation')) {
      const style = document.createElement('style');
      style.id = 'floating-animation';
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: rotateY(-15deg) rotateX(5deg) translateY(0px) translateZ(0); }
          50% { transform: rotateY(-15deg) rotateX(5deg) translateY(-10px) translateZ(0); }
        }
        
        @media (max-width: 768px) {
          @keyframes float { 
            0%, 100% { transform: none; }
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ====================================
  // ENHANCED COMPARISON TABLE ANIMATIONS
  // ====================================
  function initializeComparisonAnimations() {
    const comparisonObserver = createIntersectionObserver((entry, index) => {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#fefefe';
        
        // Add subtle highlight effect
        entry.target.addEventListener('mouseenter', function() {
          this.style.backgroundColor = 'rgba(126, 208, 230, 0.03)';
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
        });
        
        entry.target.addEventListener('mouseleave', function() {
          this.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#fefefe';
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = 'none';
        });
      }, index * 100);
    }, { 
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    });

    comparisonRows.forEach(row => {
      // Set initial state
      row.style.opacity = '0';
      row.style.transform = 'translateY(30px)';
      row.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      row.style.backgroundColor = '#ffffff';
      
      comparisonObserver.observe(row);
    });
  }

  // ====================================
  // ENHANCED FEATURE CARDS ANIMATIONS
  // ====================================
  function initializeFeatureAnimations() {
    const featuresObserver = createIntersectionObserver((entry, index) => {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.backgroundColor = '#ffffff';
        
        // Add enhanced hover effects
        entry.target.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-12px)';
          this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
          this.style.borderColor = 'rgba(126, 208, 230, 0.3)';
          
          // Animate icon
          const icon = this.querySelector('.feature-icon');
          if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
          }
        });
        
        entry.target.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          this.style.borderColor = '#e5e7eb';
          
          // Reset icon
          const icon = this.querySelector('.feature-icon');
          if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
          }
        });
      }, index * 200);
    }, { 
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    });

    featureCards.forEach((card, index) => {
      // Enhanced initial state
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px)';
      card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.backgroundColor = '#ffffff';
      card.style.borderColor = '#e5e7eb';
      
      // Enhanced icon transitions
      const icon = card.querySelector('.feature-icon');
      if (icon) {
        icon.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
      
      featuresObserver.observe(card);
    });
  }

  // ====================================
  // ENHANCED FLOW STEPS ANIMATIONS
  // ====================================
  function initializeFlowAnimations() {
    const flowObserver = createIntersectionObserver((entry, index) => {
      setTimeout(() => {
        entry.target.classList.add('animate-step');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        
        // Add background color enforcement
        entry.target.style.backgroundColor = 'transparent';
        
        // Enhance step number animation
        const stepNumber = entry.target.querySelector('.step-number');
        if (stepNumber) {
          stepNumber.style.transform = 'scale(1.1)';
          setTimeout(() => {
            stepNumber.style.transform = 'scale(1)';
          }, 300);
        }
      }, 300);
    }, { 
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });

    flowSteps.forEach((step, index) => {
      // Enhanced initial styles for animation
      step.style.opacity = '0';
      step.style.transform = index % 2 === 0 ? 'translateX(-60px)' : 'translateX(60px)';
      step.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
      step.style.backgroundColor = 'transparent';
      
      // Enhanced step number styling
      const stepNumber = step.querySelector('.step-number');
      if (stepNumber) {
        stepNumber.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
      
      flowObserver.observe(step);
    });

    // Enhanced CSS class for animated state
    if (!document.querySelector('#flow-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'flow-animation-styles';
      style.textContent = `
        .animate-step {
          opacity: 1 !important;
          transform: translateX(0) !important;
          background-color: transparent !important;
        }
        
        .flow-step {
          background-color: transparent !important;
        }
        
        .step-content {
          background-color: transparent !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ====================================
  // ENHANCED FAQ FUNCTIONALITY - Fixed Animation
  // ====================================
  function initializeFAQ() {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const content = item.querySelector('.faq-answer-content');
      
      if (question && answer && content) {
        // Ensure white background
        item.style.backgroundColor = '#ffffff';
        question.style.backgroundColor = '#ffffff';
        answer.style.backgroundColor = '#ffffff';
        
        question.addEventListener('click', function() {
          const isActive = item.classList.contains('active');
          
          // Close other open items with smooth animation
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
              otherItem.classList.remove('active');
              const otherAnswer = otherItem.querySelector('.faq-answer');
              if (otherAnswer) {
                otherAnswer.style.maxHeight = '0';
              }
            }
          });
          
          // Toggle current item with enhanced animation
          if (isActive) {
            item.classList.remove('active');
            answer.style.maxHeight = '0';
          } else {
            item.classList.add('active');
            // Calculate the actual height needed
            const contentHeight = content.scrollHeight;
            answer.style.maxHeight = (contentHeight + 32) + 'px'; // Add padding
            
            // Ensure smooth animation
            setTimeout(() => {
              if (item.classList.contains('active')) {
                answer.style.maxHeight = '500px'; // Fallback to large height
              }
            }, 300);
          }
          
          // Add visual feedback to question
          question.style.transform = 'scale(0.98)';
          setTimeout(() => {
            question.style.transform = 'scale(1)';
          }, 150);
        });

        // Enhanced keyboard accessibility
        question.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
          }
        });

        // Set initial transition styles
        answer.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        question.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Ensure proper initial state
        answer.style.backgroundColor = '#ffffff';
        content.style.backgroundColor = '#ffffff';
      }
    });
  }

  // ====================================
  // ENHANCED MODAL FUNCTIONALITY - REMOVED (Direct page navigation)
  // ====================================
  // Modal functionality removed as we now navigate directly to separate pages
  // Terms of Service: termsofservice/
  // Privacy Policy: privacypolicy/

  // ====================================
  // ENHANCED BADGE EFFECTS
  // ====================================
  function initializeBadgeEffects() {
    badges.forEach(badge => {
      // Ensure white background
      badge.style.backgroundColor = '#ffffff';
      badge.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      
      badge.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px) scale(1.05)';
        this.style.boxShadow = '0 12px 30px rgba(126, 208, 230, 0.25)';
        this.style.backgroundColor = '#fefefe';
        this.style.borderColor = 'rgba(126, 208, 230, 0.4)';
      });
      
      badge.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        this.style.backgroundColor = '#ffffff';
        this.style.borderColor = 'rgba(126, 208, 230, 0.3)';
      });

      // Add click effect
      badge.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
      });

      badge.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-4px) scale(1.05)';
      });
    });
  }

  // ====================================
  // ENHANCED RESPONSIVE BEHAVIOR
  // ====================================
  function handleResize() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;
    
    // Enhanced responsive adjustments
    phoneMockups.forEach(phone => {
      if (isMobile) {
        phone.style.transform = 'none';
        phone.style.animation = 'none';
      } else {
        phone.style.transform = phone.classList.contains('phone-mockup')
          ? 'rotateY(-15deg) rotateX(5deg)'
          : 'rotateY(-10deg) rotateX(2deg)';
        phone.style.animation = 'float 6s ease-in-out infinite';
      }
    });

    // Adjust spacing for different screen sizes
    applyProfessionalSpacing();
    
    // Ensure pure white background across all screen sizes
    enforcePureWhiteBackground();

    // Adjust navigation for tablets
    if (isTablet && !isMobile) {
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.style.padding = 'var(--space-3) var(--space-5)';
        link.style.fontSize = '0.9375rem';
      });
    }
  }

  // ====================================
  // ENHANCED IMAGE ERROR HANDLING
  // ====================================
  function initializeImageErrorHandling() {
    allImages.forEach(img => {
      img.addEventListener('error', function() {
        // Enhanced error handling with better UX
        if (this.alt.includes('Logo')) {
          this.style.display = 'none';
          const textLogo = this.nextElementSibling;
          if (textLogo && (textLogo.classList.contains('logo-text') || textLogo.classList.contains('footer-logo-text'))) {
            textLogo.style.display = 'block';
            textLogo.style.background = 'linear-gradient(135deg, #7ed0e6, #daacda, #7064ac)';
            textLogo.style.webkitBackgroundClip = 'text';
            textLogo.style.backgroundClip = 'text';
            textLogo.style.color = 'transparent';
          }
        } else {
          // Enhanced placeholder for other images
          this.style.background = 'linear-gradient(135deg, #f8f9fa, #e9ecef)';
          this.style.display = 'flex';
          this.style.alignItems = 'center';
          this.style.justifyContent = 'center';
          this.style.color = '#9ca3af';
          this.style.fontSize = '0.875rem';
          this.style.fontWeight = '500';
          this.style.border = '2px dashed #e5e7eb';
          this.style.borderRadius = '0.5rem';
          this.textContent = '📱 Image Loading...';
          
          // Add retry mechanism
          setTimeout(() => {
            const originalSrc = this.src;
            this.src = '';
            this.src = originalSrc;
          }, 2000);
        }
      });

      // Add loading state
      img.addEventListener('load', function() {
        this.style.opacity = '0';
        this.style.transition = 'opacity 0.3s ease-in-out';
        setTimeout(() => {
          this.style.opacity = '1';
        }, 50);
      });
    });
  }

  // ====================================
  // ENHANCED IMAGE PRELOADING
  // ====================================
  function preloadImages() {
    const images = [
      'assets/images/liwi_logo.png',
      'assets/images/splashscreenpage.JPG',
      'assets/images/leveltestpage.JPG',
      'assets/images/interestselectingpage.JPG',
      'assets/images/allsetpage.JPG',
      'assets/images/aitutorpage.JPG',
      'assets/images/homescreenpage.JPG',
      'assets/images/progresspage.jpg'
    ];

    images.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        console.log(`✓ Preloaded: ${src}`);
      };
      img.onerror = () => {
        console.warn(`⚠ Failed to preload: ${src}`);
      };
      
      // Staggered loading to prevent overwhelming the browser
      setTimeout(() => {
        img.src = src;
      }, index * 100);
    });
  }

  // ====================================
  // PROFESSIONAL PERFORMANCE MONITORING
  // ====================================
  function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
      const loadTime = performance.now();
      console.log(`📊 Page loaded in ${Math.round(loadTime)}ms`);
      
      // Track Core Web Vitals
      if ('web-vital' in window) {
        // This would integrate with web-vitals library if available
        console.log('📈 Core Web Vitals tracking initialized');
      }
    });

    // Monitor scroll performance
    let scrollCount = 0;
    const scrollHandler = throttle(() => {
      scrollCount++;
      if (scrollCount % 100 === 0) {
        console.log(`📜 Smooth scrolling: ${scrollCount} events processed`);
      }
    }, 100);
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  // ====================================
  // ENHANCED ACCESSIBILITY FEATURES
  // ====================================
  function initializeAccessibilityFeatures() {
    // Enhanced focus management
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-navigation');
    });

    // Add CSS for keyboard navigation
    if (!document.querySelector('#accessibility-styles')) {
      const style = document.createElement('style');
      style.id = 'accessibility-styles';
      style.textContent = `
        .keyboard-navigation *:focus {
          outline: 3px solid #7ed0e6 !important;
          outline-offset: 2px !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
        
        @media (prefers-contrast: high) {
          * {
            border-color: #000000 !important;
            color: #000000 !important;
          }
          
          .gradient-text {
            background: none !important;
            color: #000000 !important;
            -webkit-background-clip: unset !important;
            background-clip: unset !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Screen reader announcements
    function announceToScreenReader(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      
      document.body.appendChild(announcement);
      announcement.textContent = message;
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }

    // Announce page sections as they come into view
    const sectionObserver = createIntersectionObserver((entry) => {
      const section = entry.target;
      const heading = section.querySelector('h2');
      if (heading) {
        announceToScreenReader(`Entering section: ${heading.textContent}`);
      }
    }, {
      threshold: 0.5,
      rootMargin: '0px'
    });

    document.querySelectorAll('section').forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // ====================================
  // PROFESSIONAL UI ENHANCEMENTS
  // ====================================
  function initializeProfessionalUI() {
    // Add loading states to interactive elements
    const interactiveElements = document.querySelectorAll('.badge, .feature-card, .stat-item, .faq-item');
    
    interactiveElements.forEach(element => {
      element.addEventListener('click', function(e) {
        // Add subtle loading animation
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(126, 208, 230, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = (e.clientX - this.offsetLeft) + 'px';
        ripple.style.top = (e.clientY - this.offsetTop) + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 600);
      });
    });

    // Add ripple animation
    if (!document.querySelector('#ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Enhanced form styling (if any forms are added later)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.style.backgroundColor = '#ffffff';
      
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.style.backgroundColor = '#ffffff';
        input.style.border = '2px solid #e5e7eb';
        input.style.borderRadius = '0.5rem';
        input.style.padding = 'var(--space-3) var(--space-4)';
        input.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';
        
        input.addEventListener('focus', function() {
          this.style.borderColor = '#7ed0e6';
          this.style.boxShadow = '0 0 0 3px rgba(126, 208, 230, 0.1)';
          this.style.outline = 'none';
        });
        
        input.addEventListener('blur', function() {
          this.style.borderColor = '#e5e7eb';
          this.style.boxShadow = 'none';
        });
      });
    });
  }

  // ====================================
  // ENHANCED INITIALIZATION FUNCTION
  // ====================================
  function initialize() {
    console.log('🚀 Initializing Liwi Landing Page - Enhanced Version');
    
    // Force pure white background immediately
    enforcePureWhiteBackground();
    applyProfessionalSpacing();
    
    // Initialize all enhanced components
    initializeMobileMenu();
    initializeHeaderEffects();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeCounterAnimations();
    initializePhoneInteractions();
    initializeComparisonAnimations();
    initializeFeatureAnimations();
    initializeFlowAnimations();
    initializeBadgeEffects();
    initializeFAQ();
    // Modal functionality removed - direct page navigation
    initializeImageErrorHandling();
    initializePerformanceMonitoring();
    initializeAccessibilityFeatures();
    initializeProfessionalUI();
    preloadImages();

    // Enhanced resize handler with better performance
    const resizeHandler = debounce(handleResize, 250);
    window.addEventListener('resize', resizeHandler);
    handleResize(); // Initial call

    // Enhanced page visibility handling
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        // Re-enforce white background when page becomes visible
        enforcePureWhiteBackground();
        
        // Re-initialize icons if needed
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    });

    // Professional console welcome message
    console.log(`
      ✨ Welcome to Liwi - Enhanced Edition! ✨
      
      🎯 Your AI English tutor with professional design
      🎨 Pure white backgrounds enforced
      📐 Enhanced spacing and professional layout
      ⚡ Optimized performance and accessibility
      
      Built with ❤️ by the Liwi team
      Enhanced for professional excellence
      Visit: https://myliwi.com
    `);

    // Enhanced ready event with more details
    setTimeout(() => {
      const event = new CustomEvent('liwiPageReady', {
        detail: {
          timestamp: Date.now(),
          version: 'Enhanced 2.0',
          features: [
            'Pure White Backgrounds',
            'Professional Spacing',
            'Enhanced Animations',
            'Accessibility Improvements',
            'Performance Monitoring'
          ],
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          performance: {
            loadTime: performance.now(),
            elementsAnimated: animatedElements.length,
            componentsInitialized: 12
          }
        }
      });
      window.dispatchEvent(event);
      
      console.log('🎉 Liwi Enhanced Landing Page fully loaded and ready!');
    }, 1000);
  }

  // ====================================
  // START THE ENHANCED APPLICATION
  // ====================================
  initialize();

  // ====================================
  // ENHANCED ERROR HANDLING
  // ====================================
  window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.error);
    
    // Graceful degradation - ensure basic functionality
    if (!document.body.style.backgroundColor) {
      document.body.style.backgroundColor = '#ffffff';
    }
    
    // Re-initialize critical components
    setTimeout(() => {
      enforcePureWhiteBackground();
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 1000);
  });

  // ====================================
  // PROFESSIONAL CLEANUP
  // ====================================
  window.addEventListener('beforeunload', function() {
    console.log('👋 Liwi Enhanced Landing Page cleanup...');
    
    // Cleanup any ongoing animations or intervals
    document.querySelectorAll('*').forEach(element => {
      element.style.animation = 'none';
    });
  });
});