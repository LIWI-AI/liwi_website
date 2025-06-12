// ================================
// CLEANUP FUNCTIONS
// ================================

function cleanupUnwantedElements() {
  // Remove any stray text nodes or debugging elements
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.parentNode === document.body && 
        node.textContent.trim() && 
        !node.parentNode.classList.contains('navbar') &&
        !node.parentNode.classList.contains('hero')) {
      textNodes.push(node);
    }
  }

  textNodes.forEach(node => {
    if (node.textContent.includes('getDocs') || 
        node.textContent.includes('console.log') ||
        node.textContent.includes('Firebase') ||
        node.parentNode === document.body) {
      node.remove();
    }
  });

  // Remove any unwanted divs or elements at the top
  document.querySelectorAll('body > *').forEach((el, index) => {
    if (index === 0 && 
        !el.id && 
        !el.classList.length && 
        el.tagName !== 'DIV' && 
        el.tagName !== 'NAV' && 
        el.tagName !== 'SECTION') {
      el.remove();
    }
  });
}

// ================================
// FIREBASE DATABASE CLASS
// ================================

class LiwiFirebaseDB {
  constructor() {
    this.db = window.firebaseDB;
    this.collection = window.firebaseCollection;
    this.addDoc = window.firebaseAddDoc;
    this.serverTimestamp = window.firebaseServerTimestamp;
    this.query = window.firebaseQuery;
    this.where = window.firebaseWhere;
    this.getDocs = window.firebaseGetDocs;
    this.initialized = window.firebaseInitialized || false;
  }

  // Check if Firebase is ready
  isReady() {
    return this.initialized && this.db && this.collection && this.addDoc;
  }

  // Save beta notification signup
  async saveBetaSignup(email, name = null) {
    try {
      if (!this.isReady()) {
        throw new Error('Firebase is not initialized properly');
      }

      // Check if email already exists
      const exists = await this.checkEmailExists('betaSignups', email);
      if (exists) {
        return { 
          success: false, 
          error: 'You are already signed up for beta notifications!' 
        };
      }

      const docRef = await this.addDoc(this.collection(this.db, 'betaSignups'), {
        email: email.toLowerCase().trim(),
        name: name ? name.trim() : null,
        signupDate: this.serverTimestamp(),
        notificationSent: false,
        source: 'website',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });

      console.log('✅ Beta signup saved with ID:', docRef.id);
      
      return { 
        success: true, 
        message: 'Amazing! You\'re on the list for our June 20th beta launch! 🚀',
        id: docRef.id 
      };
    } catch (error) {
      console.error('❌ Error saving beta signup:', error);
      return { 
        success: false, 
        error: 'Sorry, there was an error. Please try again or contact support.' 
      };
    }
  }

  // Save contact form submission
  async saveContactMessage(name, email, subject, message) {
    try {
      if (!this.isReady()) {
        throw new Error('Firebase is not initialized properly');
      }

      const docRef = await this.addDoc(this.collection(this.db, 'contactMessages'), {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: subject.trim(),
        message: message.trim(),
        submittedAt: this.serverTimestamp(),
        status: 'new',
        replied: false,
        source: 'website',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });

      console.log('✅ Contact message saved with ID:', docRef.id);
      return { 
        success: true, 
        message: 'Thank you! We\'ll get back to you within 24 hours. 📧',
        id: docRef.id 
      };
    } catch (error) {
      console.error('❌ Error saving contact message:', error);
      return { 
        success: false, 
        error: 'Sorry, there was an error sending your message. Please try again or email us directly.' 
      };
    }
  }

  // Check if email already exists
  async checkEmailExists(collectionName, email) {
    try {
      if (!this.isReady()) {
        return false; // If Firebase isn't ready, assume email doesn't exist
      }

      const q = this.query(
        this.collection(this.db, collectionName), 
        this.where('email', '==', email.toLowerCase().trim())
      );
      const querySnapshot = await this.getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('❌ Error checking email:', error);
      return false; // On error, assume email doesn't exist
    }
  }
}

// ================================
// FORM HANDLING FUNCTIONS
// ================================

// Enhanced Email Signup with Firebase
async function handleBetaSignup() {
  const emailInput = document.getElementById('email-input');
  const notifyBtn = document.getElementById('notify-btn');
  const email = emailInput.value.trim();
  
  // Validation
  if (!email) {
    showNotification('Please enter your email address', 'error');
    emailInput.focus();
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Please enter a valid email address', 'error');
    emailInput.focus();
    return;
  }

  // Show loading state
  const originalText = notifyBtn.textContent;
  notifyBtn.textContent = 'Saving...';
  notifyBtn.disabled = true;
  emailInput.disabled = true;

  try {
    // Check if Firebase DB is available
    if (!window.liwiDB) {
      throw new Error('Database connection not available');
    }

    // Save to Firebase
    const result = await window.liwiDB.saveBetaSignup(email);
    
    if (result.success) {
      showNotification(result.message, 'success');
      emailInput.value = '';
      createCelebrationEffect();
      
      // Track successful signup
      if (typeof gtag !== 'undefined') {
        gtag('event', 'beta_signup', {
          event_category: 'engagement',
          event_label: 'email_signup'
        });
      }
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('❌ Beta signup error:', error);
    showNotification('Something went wrong. Please try again or contact us directly.', 'error');
  } finally {
    // Reset button state
    notifyBtn.textContent = originalText;
    notifyBtn.disabled = false;
    emailInput.disabled = false;
  }
}

// Enhanced Contact Form with Firebase
async function handleContactSubmission(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const submitBtn = form.querySelector('button[type="submit"]');
  
  const name = formData.get('name')?.trim();
  const email = formData.get('email')?.trim();
  const subject = formData.get('subject')?.trim();
  const message = formData.get('message')?.trim();
  
  // Validation
  if (!name || !email || !subject || !message) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (name.length < 2) {
    showNotification('Please enter a valid name', 'error');
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }

  if (subject.length < 3) {
    showNotification('Please enter a more descriptive subject', 'error');
    return;
  }

  if (message.length < 10) {
    showNotification('Please provide a more detailed message', 'error');
    return;
  }

  // Show loading state
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  // Disable form inputs
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => input.disabled = true);

  try {
    // Check if Firebase DB is available
    if (!window.liwiDB) {
      throw new Error('Database connection not available');
    }

    // Save to Firebase
    const result = await window.liwiDB.saveContactMessage(name, email, subject, message);
    
    if (result.success) {
      showNotification(result.message, 'success');
      form.reset();
      
      // Track successful contact
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form', {
          event_category: 'engagement',
          event_label: 'form_submission'
        });
      }
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('❌ Contact form error:', error);
    showNotification('Failed to send message. Please try again or email us directly at myliwiai@gmail.com', 'error');
  } finally {
    // Reset button and form state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Re-enable form inputs
    inputs.forEach(input => input.disabled = false);
  }
}

// ================================
// ANIMATION FUNCTIONS
// ================================

// Flowing Letters Canvas Animation
function initLettersAnimation() {
  const canvas = document.getElementById('letters-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Letters and symbols focused on English learning
  const elements = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '?', '!', '.', ',', ';', ':', '"', "'", '-', '★', '☆', '✦', '✧', '✩', '🎯', '💬', '📚', '🚀'
  ];

  const letters = [];
  const letterCount = window.innerWidth > 768 ? 80 : 50;

  // Initialize letters
  for (let i = 0; i < letterCount; i++) {
    letters.push({
      char: elements[Math.floor(Math.random() * elements.length)],
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1,
      size: Math.random() * 20 + 12,
      opacity: Math.random() * 0.4 + 0.1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      hue: 240 + Math.random() * 60
    });
  }

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;

  canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Touch interaction for mobile
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches[0]) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  });

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    letters.forEach(letter => {
      // Update position
      letter.x += letter.vx;
      letter.y += letter.vy;
      letter.rotation += letter.rotationSpeed;

      // Wrap around screen
      if (letter.x < -50) letter.x = canvas.width + 50;
      if (letter.x > canvas.width + 50) letter.x = -50;
      if (letter.y < -50) letter.y = canvas.height + 50;
      if (letter.y > canvas.height + 50) letter.y = -50;

      // Mouse interaction
      const dx = mouseX - letter.x;
      const dy = mouseY - letter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        letter.vx += (dx / distance) * force * 0.1;
        letter.vy += (dy / distance) * force * 0.1;
        letter.opacity = Math.min(0.8, letter.opacity + force * 0.3);
      }

      // Draw letter
      ctx.save();
      ctx.translate(letter.x, letter.y);
      ctx.rotate(letter.rotation);
      ctx.font = `${letter.size}px 'Poppins', Arial, sans-serif`;
      ctx.fillStyle = `hsl(${letter.hue}, 70%, ${60 + Math.random() * 20}%)`;
      ctx.globalAlpha = letter.opacity;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter.char, 0, 0);
      ctx.restore();

      // Pulsing effect
      letter.opacity += Math.sin(Date.now() * 0.002 + letter.x * 0.01) * 0.005;
      letter.opacity = Math.max(0.1, Math.min(0.5, letter.opacity));
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// Countdown Timer to June 20, 2025
function initCountdown() {
  const targetDate = new Date('2025-06-20T00:00:00');
  
  function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');

      if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
      if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    } else {
      // Launch day reached!
      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');

      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      
      // Update launch info
      const launchInfo = document.querySelector('.launch-info h3');
      if (launchInfo) {
        launchInfo.textContent = '🎉 Liwi is Now Live!';
      }
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Testimonials Animation
function initTestimonialsAnimation() {
  const track = document.getElementById('testimonials-track');
  if (!track) return;

  // Clone testimonials for seamless loop
  const testimonials = track.children;
  const testimonialsArray = Array.from(testimonials);
  
  // Clone all testimonials and append them
  testimonialsArray.forEach(testimonial => {
    const clone = testimonial.cloneNode(true);
    track.appendChild(clone);
  });

  // Pause animation on hover
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

// App Preview Animations
function initAppPreviewAnimations() {
  const mockups = document.querySelectorAll('.phone-mockup');
  
  // Intersection Observer for mockup animations
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  };

  const mockupObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);

  mockups.forEach(mockup => {
    mockupObserver.observe(mockup);
  });

  // Add interactive effects to mockups
  mockups.forEach(mockup => {
    mockup.addEventListener('mouseenter', () => {
      mockup.style.transform = 'scale(1.05) rotateY(5deg)';
      mockup.style.transition = 'transform 0.3s ease';
    });

    mockup.addEventListener('mouseleave', () => {
      mockup.style.transform = 'scale(1) rotateY(0deg)';
    });
  });
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// ================================
// NAVIGATION FUNCTIONS
// ================================

function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active section tracking
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    [...navLinks, ...mobileNavLinks].forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll function
  function smoothScrollTo(targetId) {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  // Desktop navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-section');
      if (targetId) {
        smoothScrollTo(targetId);
      }
    });
  });

  // Mobile navigation
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-section');
      if (targetId) {
        smoothScrollTo(targetId);
        closeMobileMenu();
      }
    });
  });

  // Mobile menu toggle
  function toggleMobileMenu() {
    if (mobileMenuBtn && mobileMenuOverlay) {
      mobileMenuBtn.classList.toggle('active');
      mobileMenuOverlay.classList.toggle('active');
      document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
    }
  }

  function closeMobileMenu() {
    if (mobileMenuBtn && mobileMenuOverlay) {
      mobileMenuBtn.classList.remove('active');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Close mobile menu when clicking overlay
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });
  }

  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}

// ================================
// LEGAL MODAL FUNCTIONS
// ================================

function showPrivacyPolicy() {
  const modal = document.getElementById('privacy-modal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function showTermsOfService() {
  const modal = document.getElementById('terms-modal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeLegalModal() {
  const privacyModal = document.getElementById('privacy-modal');
  const termsModal = document.getElementById('terms-modal');
  
  if (privacyModal) privacyModal.style.display = 'none';
  if (termsModal) termsModal.style.display = 'none';
  
  document.body.style.overflow = '';
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
  const privacyModal = document.getElementById('privacy-modal');
  const termsModal = document.getElementById('terms-modal');
  
  if (privacyModal && event.target === privacyModal) {
    closeLegalModal();
  }
  if (termsModal && event.target === termsModal) {
    closeLegalModal();
  }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLegalModal();
  }
});

// ================================
// FORM INITIALIZATION FUNCTIONS
// ================================

function initEmailSignup() {
  const notifyBtn = document.getElementById('notify-btn');
  const emailInput = document.getElementById('email-input');

  if (notifyBtn) {
    notifyBtn.addEventListener('click', handleBetaSignup);
  }

  if (emailInput) {
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleBetaSignup();
      }
    });
  }
}

function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmission);
  }
}

// ================================
// HELPER FUNCTIONS
// ================================

function createCelebrationEffect() {
  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * window.innerWidth}px;
        top: -10px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: fall 3s linear forwards;
      `;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti);
        }
      }, 3000);
    }, i * 100);
  }
}

function showNotification(message, type = 'success') {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll('.liwi-notification');
  existingNotifications.forEach(notification => {
    notification.remove();
  });

  const notification = document.createElement('div');
  notification.className = 'liwi-notification';
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 1rem;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.5s ease;
    max-width: 350px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;
    line-height: 1.4;
  `;
  
  notification.innerHTML = `
    <span style="font-size: 1.2rem; flex-shrink: 0;">${type === 'success' ? '✅' : '❌'}</span>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 5000);

  // Make notification clickable to dismiss
  notification.addEventListener('click', () => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  });
}

function initButtonInteractions() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0) scale(1)';
    });

    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'translateY(0) scale(0.98)';
    });

    btn.addEventListener('mouseup', () => {
      btn.style.transform = 'translateY(-2px) scale(1.02)';
    });
  });

  // Special effects for primary buttons
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      
      setTimeout(() => {
        if (btn.contains(ripple)) {
          btn.removeChild(ripple);
        }
      }, 600);
    });
  });
}

function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
    
    .btn {
      position: relative;
      overflow: hidden;
    }

    /* Check icon styling */
    .check-icon {
      color: #10b981;
      font-weight: bold;
      font-size: 1.2rem;
    }
  `;
  document.head.appendChild(style);
}

// ================================
// ERROR HANDLING
// ================================

function handleGlobalErrors() {
  window.addEventListener('error', (event) => {
    console.error('❌ Global error:', event.error);
    
    // Only show user-friendly errors for certain types
    if (event.error?.message?.includes('Firebase') || 
        event.error?.message?.includes('network') ||
        event.error?.message?.includes('fetch')) {
      showNotification('Connection issue detected. Please check your internet and try again.', 'error');
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
    
    // Handle Firebase-related promise rejections
    if (event.reason?.code?.includes('firestore') || 
        event.reason?.message?.includes('Firebase')) {
      showNotification('Database connection issue. Please try again.', 'error');
    }
  });
}

// ================================
// MAIN INITIALIZATION
// ================================

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Clean up any unwanted elements first
  cleanupUnwantedElements();
  
  // Initialize error handling
  handleGlobalErrors();
  
  // Initialize animations and UI
  initLettersAnimation();
  initCountdown();
  initNavigation();
  initTestimonialsAnimation();
  initAppPreviewAnimations();
  initScrollAnimations();
  initButtonInteractions();
  addDynamicStyles();
  
  // Initialize Firebase-dependent functions after a delay
  setTimeout(() => {
    if (window.firebaseDB && window.firebaseInitialized) {
      window.liwiDB = new LiwiFirebaseDB();
      initEmailSignup();
      initContactForm();
      console.log('✅ Liwi with Firebase initialized successfully!');
      
      // Test Firebase connection in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Development mode detected - Firebase test function available as testFirebaseConnection()');
      }
    } else {
      console.warn('⚠️ Firebase not fully loaded - some features may not work');
      // Still initialize forms with fallback behavior
      initEmailSignup();
      initContactForm();
      
      // Override functions to show appropriate messages
      window.handleBetaSignup = () => {
        showNotification('Service temporarily unavailable. Please email us at myliwiai@gmail.com', 'error');
      };
    }
    
    // Final cleanup after Firebase loads
    cleanupUnwantedElements();
  }, 1000);
  
  // Add loading animation
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    // Final cleanup after everything loads
    setTimeout(cleanupUnwantedElements, 2000);
  });

  // Add some easter eggs for engaged users
  let clickCount = 0;
  const heroLogo = document.querySelector('.hero-logo');
  if (heroLogo) {
    heroLogo.addEventListener('click', () => {
      clickCount++;
      if (clickCount === 5) {
        showNotification('🎉 You found an easter egg! Thanks for being so engaged with Liwi!', 'success');
        createCelebrationEffect();
        clickCount = 0;
      }
    });
  }

  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log(`📊 Page load time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
        }
      }, 0);
    });
  }
});

// Make key functions globally available for debugging
window.showPrivacyPolicy = showPrivacyPolicy;
window.showTermsOfService = showTermsOfService;
window.closeLegalModal = closeLegalModal;