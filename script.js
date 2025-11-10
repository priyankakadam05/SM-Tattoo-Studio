// SM Tattoo Studio - Mobile Optimized JavaScript
const API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
    ? 'http://localhost:4000'  // Local development
    : 'https://sm-tattoo-studio-2.onrender.com';  // Production

console.log('Using API URL:', API_URL);

class SMTattooStudio {
    constructor() {
        this.init();
    }

    init() {
        this.setupHeader();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupForms();
        this.setupAnimations();
        this.setupGallery();
        this.setupResizeHandler();
    }

    // Header scroll behavior
    setupHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        // ✅ Active Menu Highlighter
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll(".nav-link");
const mobileLinks = document.querySelectorAll(".mobile-nav-link");

navLinks.forEach(link => {
    if(link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});

mobileLinks.forEach(link => {
    if(link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});


        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    header.classList.add('header--hidden');
                } else {
                    header.classList.remove('header--hidden');
                }
            } else {
                header.classList.remove('scrolled', 'header--hidden');
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        updateHeader(); // Initial call
    }

    

    // Mobile menu functionality
    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const nav = document.querySelector('.nav');
        
        if (!navToggle || !nav) return;

        // Create mobile menu structure if it doesn't exist
        let mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.id = 'mobile-menu';
            mobileMenu.className = 'mobile-menu';
            
            const navList = document.querySelector('.nav-list');
            if (navList) {
                const mobileNav = document.createElement('div');
                mobileNav.className = 'mobile-nav';
                
                // Clone and modify nav links for mobile
                const links = navList.querySelectorAll('.nav-link');
                links.forEach(link => {
                    const mobileLink = link.cloneNode(true);
                    mobileLink.classList.add('mobile-nav-link');
                    mobileNav.appendChild(mobileLink);
                });
                
                mobileMenu.appendChild(mobileNav);
            }
            
            // Add social icons
            const socialIcons = document.createElement('div');
            socialIcons.className = 'mobile-social';
            socialIcons.innerHTML = `
                <a href="https://wa.me/919022125968" target="_blank" class="social-icon" aria-label="WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                </a>
                <a href="https://www.instagram.com/smtattoo_studio" target="_blank" class="social-icon" aria-label="Instagram">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="https://youtube.com/@sagarpathade-w7m" target="_blank" class="social-icon" aria-label="YouTube">
                    <i class="fab fa-youtube"></i>
                </a>
            `;
            mobileMenu.appendChild(socialIcons);
            
            document.body.appendChild(mobileMenu);
        }

        const toggleMenu = (e) => {
            e?.stopPropagation();
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle body scroll
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            
            // Add backdrop for mobile
            if (mobileMenu.classList.contains('active')) {
                this.addBackdrop();
            } else {
                this.removeBackdrop();
            }
        };

        const closeMenu = () => {
            if (mobileMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                this.removeBackdrop();
            }
        };

        // Event listeners
        navToggle.addEventListener('click', toggleMenu);
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        // Close on link click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mobile-nav-link')) {
                closeMenu();
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }

    addBackdrop() {
        let backdrop = document.getElementById('mobile-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'mobile-backdrop';
            backdrop.style.cssText = `
                position: fixed;
                top: var(--header-height);
                left: 0;
                width: 100%;
                height: calc(100vh - var(--header-height));
                background: rgba(0, 0, 0, 0.5);
                z-index: 998;
                backdrop-filter: blur(2px);
            `;
            backdrop.addEventListener('click', () => this.closeMobileMenu());
            document.body.appendChild(backdrop);
        }
    }

    removeBackdrop() {
        const backdrop = document.getElementById('mobile-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }

    closeMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (navToggle && mobileMenu && mobileMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            this.removeBackdrop();
        }
    }

    // Smooth scrolling
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '#!') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
    }

    // Form handling
    setupForms() {
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Form validation on blur
        document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Select elements
        document.querySelectorAll('.form-select').forEach(select => {
            select.addEventListener('change', () => this.validateField(select));
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        if (this.validateForm(form)) {
            this.submitForm(form);
        }
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Clear previous errors
        this.clearFieldError(field);

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }

        if (!isValid) {
            this.showFieldError(field, message);
        } else {
            field.style.borderColor = '#22c55e';
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            font-weight: 500;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
async submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    form.classList.add('loading');

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        
        const response = await fetch(`${API_URL}/api/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to submit form");
        }

        const result = await response.json();
        
        this.showToast('Thank you for your message! We will get back to you soon.', 'success');
        form.reset();
        
        // Reset field borders
        form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(field => {
            field.style.borderColor = '';
        });
        
    } catch (error) {
        console.error('Form submission error:', error);
        this.showToast('There was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset form state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.classList.remove('loading');
    }
}

    // Toast notifications
    showToast(message, type = 'success') {
        // Remove existing toasts
        document.querySelectorAll('.toast-message').forEach(toast => toast.remove());

        const toast = document.createElement('div');
        const backgroundColor = type === 'success' ? '#10B981' : '#EF4444';
        const icon = type === 'success' ? '✓' : '⚠';
        
        toast.className = 'toast-message';
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-text">${message}</span>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: min(90%, 400px);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 500;
            font-size: 0.95rem;
        `;
        
        // Mobile positioning
        if (window.innerWidth <= 768) {
            toast.style.top = '80px';
            toast.style.right = '10px';
            toast.style.left = '10px';
            toast.style.maxWidth = 'calc(100% - 20px)';
            toast.style.transform = 'translateY(-100px)';
        }
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = window.innerWidth <= 768 ? 'translateY(0)' : 'translateX(0)';
        });
        
        // Auto remove
        setTimeout(() => {
            toast.style.transform = window.innerWidth <= 768 ? 'translateY(-100px)' : 'translateX(400px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    // Scroll animations
    setupAnimations() {
        // Use Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with data-animate attribute
        document.querySelectorAll('.service-card, .gallery-item, .testimonial-card, .about-teaser').forEach(el => {
            observer.observe(el);
        });

        // Add animation delay for staggered effects
        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.style.animationDelay = $;{index * 0.1}s;
        });
    }

    // Gallery functionality
    setupGallery() {
        this.setupGalleryFilters();
        this.setupImageLoading();
    }

    setupGalleryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (filterButtons.length === 0 || galleryItems.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter items
                const filterValue = button.dataset.filter;
                
                galleryItems.forEach(item => {
                    const matches = filterValue === 'all' || item.dataset.category === filterValue;
                    item.style.display = matches ? 'block' : 'none';
                    
                    // Add fade effect
                    if (matches) {
                        item.style.animation = 'fadeIn 0.5s ease';
                    }
                });

                // Show message if no items match
                const visibleItems = document.querySelectorAll('.gallery-item[style="display: block"]');
                this.showGalleryMessage(visibleItems.length === 0);
            });
        });
    }

    showGalleryMessage(show) {
        let message = document.getElementById('gallery-no-results');
        
        if (show && !message) {
            message = document.createElement('div');
            message.id = 'gallery-no-results';
            message.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No tattoos found</h3>
                    <p>Try selecting a different filter to see more artwork.</p>
                </div>
            `;
            document.querySelector('.gallery-grid').appendChild(message);
        } else if (!show && message) {
            message.remove();
        }
    }

    setupImageLoading() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Handle window resize
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
        
        // Adjust any other responsive behaviors here
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SMTattooStudio();
});

// Add CSS for animations and enhancements
const injectStyles = () => {
    const styles = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error-message {
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            font-weight: 500;
        }

        .loading {
            position: relative;
            opacity: 0.7;
            pointer-events: none;
        }

        .loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #D4AF37;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .fa-spin {
            animation: spin 1s linear infinite;
        }

        /* Touch improvements for mobile */
        @media (max-width: 768px) {
            .btn, .nav-link, .filter-btn {
                -webkit-tap-highlight-color: transparent;
                touch-action: manipulation;
            }
            
            .gallery-item {
                cursor: pointer;
            }
        }

        /* Focus styles for accessibility */
        .btn:focus-visible,
        .nav-link:focus-visible,
        .filter-btn:focus-visible {
            outline: 2px solid var(--accent-primary);
            outline-offset: 2px;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
};

// Inject styles
injectStyles();

// Service Worker for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // You can register a service worker here for offline functionality
        console.log('Service Worker support detected');
    });
}

//header hide on scroll down and show on scroll up
let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll) {
        // 🔽 Scroll Down → hide
        header.classList.add("hide");
    } else {
        // 🔼 Scroll Up → show
        header.classList.remove("hide");
    }

    lastScroll = currentScroll;
});