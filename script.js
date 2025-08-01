// ====================================
// LIWI LANDING PAGE JAVASCRIPT
// ====================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ====================================
  // INITIALIZE LUCIDE ICONS
  // ====================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ====================================
  // DOM ELEMENT REFERENCES
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
  
  // FAQ and Modal elements
  const faqItems = document.querySelectorAll('.faq-item');
  const termsLink = document.getElementById('terms-link');
  const privacyLink = document.getElementById('privacy-link');
  const termsModal = document.getElementById('terms-modal');
  const privacyModal = document.getElementById('privacy-modal');
  const termsClose = document.getElementById('terms-close');
  const privacyClose = document.getElementById('privacy-close');

  // ====================================
  // UTILITY FUNCTIONS
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

  // ====================================
  // MOBILE MENU FUNCTIONALITY
  // ====================================
  function initializeMobileMenu() {
    if (!menuToggle || !navMenu) return;

    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      
      // Change icon
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      
      // Re-initialize icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });

    // Close menu when clicking nav links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!header.contains(event.target)) {
        closeMenu();
      }
    });

    // Keyboard navigation for mobile menu
    menuToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });

    // Close menu function
    function closeMenu() {
      navMenu.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon.setAttribute('data-lucide', 'menu');
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }

  // ====================================
  // HEADER SCROLL EFFECTS
  // ====================================
  function initializeHeaderEffects() {
    const handleScroll = debounce(function() {
      const currentScrollY = window.scrollY;
      
      // Hide header when scrolling down
      if (currentScrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, 10);

    window.addEventListener('scroll', handleScroll);
  }

  // ====================================
  // SMOOTH SCROLLING NAVIGATION
  // ====================================
  function initializeSmoothScrolling() {
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const headerHeight = header.offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });

      // Keyboard navigation
      link.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          menuToggle.focus();
        }
      });
    });
  }

  // ====================================
  // INTERSECTION OBSERVER ANIMATIONS
  // ====================================
  function initializeScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, index * 100);
        }
      });
    }, observerOptions);

    // Observe fade-in elements
    animatedElements.forEach((el, index) => {
      el.style.animationDelay = `${index * 50}ms`;
      observer.observe(el);
    });
  }

  // ====================================
  // ANIMATED COUNTERS FOR STATS
  // ====================================
  function initializeCounterAnimations() {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
      statsObserver.observe(stat);
    });

    function animateCounter(element) {
      const target = element.textContent.trim();
      const isPercentage = target.includes('%');
      const isPlus = target.includes('+');
      const numericValue = parseInt(target.replace(/[^\d]/g, ''));
      
      if (isNaN(numericValue)) return;
      
      let current = 0;
      const increment = numericValue / 50; // 50 steps for smooth animation
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          current = numericValue;
          clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (displayValue >= 1000) {
          displayValue = Math.floor(displayValue / 1000) + 'K';
        }
        
        element.textContent = displayValue + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
      }, 30);
    }
  }

  // ====================================
  // PHONE MOCKUP INTERACTIONS
  // ====================================
  function initializePhoneInteractions() {
    phoneMockups.forEach(phone => {
      phone.addEventListener('mouseenter', function() {
        if (window.innerWidth > 768) { // Only on desktop
          this.style.transform = this.classList.contains('phone-mockup') 
            ? 'rotateY(-5deg) rotateX(2deg) scale(1.08)' 
            : 'rotateY(-2deg) rotateX(1deg) scale(1.05)';
        }
      });
      
      phone.addEventListener('mouseleave', function() {
        if (window.innerWidth > 768) { // Only on desktop
          this.style.transform = this.classList.contains('phone-mockup')
            ? 'rotateY(-15deg) rotateX(5deg) scale(1)'
            : 'rotateY(-10deg) rotateX(2deg) scale(1)';
        }
      });
    });
  }

  // ====================================
  // COMPARISON TABLE ANIMATIONS
  // ====================================
  function initializeComparisonAnimations() {
    const comparisonObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
        }
      });
    }, { threshold: 0.3 });

    comparisonRows.forEach(row => {
      comparisonObserver.observe(row);
    });
  }

  // ====================================
  // FEATURE CARDS ANIMATIONS
  // ====================================
  function initializeFeatureAnimations() {
    const featuresObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 150);
        }
      });
    }, { threshold: 0.2 });

    featureCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      featuresObserver.observe(card);
    });
  }

  // ====================================
  // FLOW STEPS ANIMATIONS
  // ====================================
  function initializeFlowAnimations() {
    const flowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-step');
          }, 200);
        }
      });
    }, { threshold: 0.3 });

    flowSteps.forEach((step, index) => {
      // Add initial styles for animation
      step.style.opacity = '0';
      step.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
      step.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      
      flowObserver.observe(step);
    });

    // Add CSS class for animated state
    if (!document.querySelector('#flow-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'flow-animation-styles';
      style.textContent = `
        .animate-step {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ====================================
  // FAQ FUNCTIONALITY
  // ====================================
  function initializeFAQ() {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', function() {
          // Close other open items
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
              otherItem.classList.remove('active');
            }
          });
          
          // Toggle current item
          item.classList.toggle('active');
        });

        // Keyboard accessibility
        question.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
          }
        });
      }
    });
  }

  // ====================================
  // MODAL FUNCTIONALITY
  // ====================================
  function initializeModals() {
    // Terms of Service Modal
    if (termsLink && termsModal) {
      termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(termsModal);
      });
    }

    // Privacy Policy Modal
    if (privacyLink && privacyModal) {
      privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(privacyModal);
      });
    }

    // Close button functionality
    if (termsClose) {
      termsClose.addEventListener('click', function() {
        closeModal(termsModal);
      });
    }

    if (privacyClose) {
      privacyClose.addEventListener('click', function() {
        closeModal(privacyModal);
      });
    }

    // Close modal when clicking outside
    [termsModal, privacyModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            closeModal(modal);
          }
        });
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (termsModal && termsModal.classList.contains('active')) {
          closeModal(termsModal);
        }
        if (privacyModal && privacyModal.classList.contains('active')) {
          closeModal(privacyModal);
        }
      }
    });
  }

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus management
      const closeButton = modal.querySelector('.modal-close');
      if (closeButton) {
        closeButton.focus();
      }
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  function initializeBadgeEffects() {
    badges.forEach(badge => {
      badge.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
        this.style.boxShadow = '0 10px 25px rgba(126, 208, 230, 0.3)';
      });
      
      badge.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
      });
    });
  }

  // ====================================
  // RESPONSIVE BEHAVIOR
  // ====================================
  function handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    // Adjust phone mockup transforms for mobile
    phoneMockups.forEach(phone => {
      if (isMobile) {
        phone.style.transform = 'none';
      } else {
        phone.style.transform = phone.classList.contains('phone-mockup')
          ? 'rotateY(-15deg) rotateX(5deg)'
          : 'rotateY(-10deg) rotateX(2deg)';
      }
    });
  }

  // ====================================
  // IMAGE ERROR HANDLING
  // ====================================
  function initializeImageErrorHandling() {
    allImages.forEach(img => {
      img.addEventListener('error', function() {
        // Hide broken images gracefully
        if (this.alt.includes('Logo')) {
          this.style.display = 'none';
          const textLogo = this.nextElementSibling;
          if (textLogo && textLogo.classList.contains('logo-text')) {
            textLogo.style.display = 'block';
          }
        } else {
          // For other images, show a placeholder
          this.style.background = 'linear-gradient(135deg, #f3f4f6, #e5e7eb)';
          this.style.display = 'flex';
          this.style.alignItems = 'center';
          this.style.justifyContent = 'center';
          this.style.color = '#9ca3af';
          this.style.fontSize = '0.875rem';
          this.textContent = 'Image not available';
        }
      });
    });
  }

  // ====================================
  // IMAGE PRELOADING
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

    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  // ====================================
  // INITIALIZATION FUNCTION
  // ====================================
  function initialize() {
    // Initialize all components
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
    initializeModals();
    initializeImageErrorHandling();
    preloadImages();

    // Set up resize handler
    window.addEventListener('resize', throttle(handleResize, 250));
    handleResize(); // Initial call

    // Console welcome message
    console.log(`
      🎉 Welcome to Liwi!
      
      Your AI English tutor is ready to help you master the language.
      
      Built with ❤️ by the Liwi team
      Visit: https://myliwi.com
    `);

    // Dispatch ready event
    setTimeout(() => {
      const event = new CustomEvent('liwiPageReady', {
        detail: {
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      });
      window.dispatchEvent(event);
    }, 1000);
  }

  // ====================================
  // START THE APPLICATION
  // ====================================
  initialize();
});