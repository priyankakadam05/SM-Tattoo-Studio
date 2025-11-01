// SM Tattoo Studio - JavaScript for interactivity and animations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initBookingForm();
    initARFeature();
    initGalleryHover();
});

// Header scroll effect
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navList.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navList.classList.remove('active');
            });
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .service-card, .gallery-item, .aftercare-item, .testimonial-card');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });
}

// Booking form handling
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(bookingForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const tattooType = formData.get('tattooType');
            const date = formData.get('date');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !tattooType || !date) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For now, we'll just show a success message
            showNotification(`Thank you, ${name}! Your appointment request has been received. We'll contact you at ${email} to confirm.`, 'success');
            
            // Reset form
            bookingForm.reset();
            
            // Reset floating labels
            const formGroups = bookingForm.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                const label = group.querySelector('label');
                const input = group.querySelector('input, select, textarea');
                
                if (input && label) {
                    if (input.value) {
                        label.style.top = '-10px';
                        label.style.fontSize = '0.8rem';
                        label.style.backgroundColor = 'var(--bg-card)';
                        label.style.padding = '0 5px';
                        label.style.color = 'var(--accent-gold)';
                    } else {
                        label.style.top = '15px';
                        label.style.fontSize = '1rem';
                        label.style.backgroundColor = 'transparent';
                        label.style.padding = '0';
                        label.style.color = 'var(--text-gray)';
                    }
                }
            });
        });
        
        // Floating label effect
        const formGroups = bookingForm.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Check on page load if there's already content
                if (input.value) {
                    label.style.top = '-10px';
                    label.style.fontSize = '0.8rem';
                    label.style.backgroundColor = 'var(--bg-card)';
                    label.style.padding = '0 5px';
                    label.style.color = 'var(--accent-gold)';
                }
                
                input.addEventListener('focus', function() {
                    label.style.top = '-10px';
                    label.style.fontSize = '0.8rem';
                    label.style.backgroundColor = 'var(--bg-card)';
                    label.style.padding = '0 5px';
                    label.style.color = 'var(--accent-gold)';
                });
                
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        label.style.top = '15px';
                        label.style.fontSize = '1rem';
                        label.style.backgroundColor = 'transparent';
                        label.style.padding = '0';
                        label.style.color = 'var(--text-gray)';
                    }
                });
            }
        });
    }
}

// AR Feature placeholder
function initARFeature() {
    const tryArBtn = document.getElementById('tryArBtn');
    
    if (tryArBtn) {
        tryArBtn.addEventListener('click', function() {
            showNotification('AR feature will be implemented in the next version!', 'info');
        });
    }
}

// Gallery hover effects
function initGalleryHover() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = 'var(--border-radius)';
    notification.style.zIndex = '10000';
    notification.style.maxWidth = '400px';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    notification.style.transition = 'all 0.3s ease';
    notification.style.transform = 'translateX(150%)';
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
            notification.style.color = 'white';
            break;
        case 'error':
            notification.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
            notification.style.color = 'white';
            break;
        case 'info':
        default:
            notification.style.backgroundColor = 'var(--bg-card)';
            notification.style.color = 'var(--text-light)';
            notification.style.border = '1px solid var(--accent-gold)';
            break;
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Allow manual dismissal
    notification.addEventListener('click', function() {
        this.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 300);
    });
}

// Hero video controls
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
    // Ensure video plays correctly
    heroVideo.addEventListener('loadedmetadata', function() {
        this.play().catch(error => {
            console.log('Video autoplay failed:', error);
        });
    });
    
    // Fallback for browsers that don't support autoplay
    const playVideo = () => {
        heroVideo.play().catch(error => {
            // If autoplay is blocked, show a play button
            console.log('Autoplay blocked, showing fallback');
        });
    };
    
    // Try to play when user interacts with the page
    document.addEventListener('click', playVideo, { once: true });
    document.addEventListener('scroll', playVideo, { once: true });
}

// Add structured data for SEO
function addStructuredData() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TattooParlor",
        "name": "SM Tattoo Studio",
        "description": "Professional tattoo studio in Worli, Mumbai offering custom tattoos, piercing, cover-ups, home services, and tattoo training courses.",
        "url": "https://smtattoostudio.com",
        "telephone": "+91-98765-43210",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Worli",
            "addressLocality": "Mumbai",
            "addressRegion": "Maharashtra",
            "postalCode": "400018",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "19.0176",
            "longitude": "72.8212"
        },
        "openingHours": [
            "Mo-Sa 11:00-20:00",
            "Su 12:00-18:00"
        ],
        "priceRange": "$$",
        "image": "https://images.unsplash.com/photo-1611439697836-560f3eaa3a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
    });
    
    document.head.appendChild(script);
}

// Initialize structured data
addStructuredData();
// script.js - Complete JavaScript for SM Tattoo Studio

// Header scroll behavior
const header = document.getElementById('header');
let lastScrollY = window.scrollY;
let ticking = false;

function updateHeader() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.classList.add('header--scrolled');
        
        if (currentScrollY > lastScrollY) {
            // Scrolling down
            header.classList.add('header--hidden');
        } else {
            // Scrolling up
            header.classList.remove('header--hidden');
        }
    } else {
        header.classList.remove('header--scrolled', 'header--hidden');
    }
    
    lastScrollY = currentScrollY;
}

// Throttle scroll events for performance
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateHeader();
            ticking = false;
        });
        ticking = true;
    }
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', !isExpanded);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// Close mobile menu when clicking on a link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger && mobileMenu) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
});

// Gallery filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Reflow masonry layout
            setTimeout(() => {
                if (typeof Masonry !== 'undefined') {
                    masonry.layout();
                }
            }, 300);
        });
    });
}

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

// Initialize lightbox if elements exist
if (lightbox) {
    let currentImageIndex = 0;
    const galleryImages = [];
    
    // Populate gallery images array
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const type = item.querySelector('.gallery-type')?.textContent || '';
        const artist = item.querySelector('.gallery-artist')?.textContent || '';
        
        galleryImages.push({
            src: img.src,
            alt: img.alt,
            type: type,
            artist: artist
        });
        
        // Add click event to gallery items
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    function openLightbox(index) {
        currentImageIndex = index;
        const image = galleryImages[index];
        
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxTitle.textContent = image.type;
        lightboxDescription.textContent = By ${image.artist};
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        openLightbox(currentImageIndex);
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentImageIndex);
    }
    
    // Event listeners for lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
        }
    });
    
    // Close lightbox when clicking on backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Form validation and submission
const bookingForm = document.getElementById('booking-form');
const contactForm = document.getElementById('contact-form');

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff6b6b';
        } else {
            input.style.borderColor = '';
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.style.borderColor = '#ff6b6b';
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(input.value)) {
                isValid = false;
                input.style.borderColor = '#ff6b6b';
            }
        }
    });
    
    return isValid;
}

function showSuccessMessage(message) {
    // Create success toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent);
        color: var(--bg);
        padding: 1rem 2rem;
        border-radius: var(--radius);
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 4000);
}

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(bookingForm)) {
            // Simulate form submission
            const formData = new FormData(bookingForm);
            console.log('Booking form submitted:', Object.fromEntries(formData));
            
            // Show success message
            showSuccessMessage('Thank you! Your booking request has been received. We will contact you shortly.');
            
            // Reset form
            bookingForm.reset();
        } else {
            alert('Please fill in all required fields correctly.');
        }
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(contactForm)) {
            // Simulate form submission
            const formData = new FormData(contactForm);
            console.log('Contact form submitted:', Object.fromEntries(formData));
            
            // Show success message
            showSuccessMessage('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        } else {
            alert('Please fill in all required fields correctly.');
        }
    });
}

// Reviews carousel
const reviewsTrack = document.getElementById('reviews-track');
const carouselDots = document.querySelectorAll('.carousel-dot');

if (reviewsTrack && carouselDots.length > 0) {
    let currentSlide = 0;
    const totalSlides = 3; // Assuming 3 slides
    
    function goToSlide(index) {
        currentSlide = index;
        reviewsTrack.style.transform = translateX(-${currentSlide * 100}%);
        
        // Update dots
        carouselDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Auto-play carousel
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);
}

// Load more functionality for gallery
const loadMoreBtn = document.getElementById('load-more');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // Simulate loading more items
        const newItems = [
            { category: 'realism', src: 'placeholder-tattoo7.jpg', alt: 'Additional realism tattoo', type: 'Realism', artist: 'By Marcus Chen' },
            { category: 'watercolor', src: 'placeholder-tattoo8.jpg', alt: 'Additional watercolor tattoo', type: 'Watercolor', artist: 'By Sophia Laurent' },
            { category: 'geometric', src: 'placeholder-tattoo9.jpg', alt: 'Additional geometric tattoo', type: 'Geometric', artist: 'By Kai Thompson' }
        ];
        
        newItems.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-category', item.category);
            
            galleryItem.innerHTML = `
                <img src="${item.src}" alt="${item.alt}" loading="lazy">
                <div class="gallery-overlay">
                    <div class="gallery-type">${item.type}</div>
                    <div class="gallery-artist">${item.artist}</div>
                    <div class="gallery-actions">
                        <button class="gallery-action" aria-label="Zoom">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </button>
                        <button class="gallery-action" aria-label="Info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('gallery-grid').appendChild(galleryItem);
        });
        
        // Hide load more button after loading all items (simulated)
        loadMoreBtn.style.display = 'none';
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize page with header state
document.addEventListener('DOMContentLoaded', () => {
    updateHeader();
    
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // If image is already loaded (cached)
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
    
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.service-card, .gallery-item, .artist-card, .course-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleY = (x - centerX) / 25;
        const angleX = (centerY - y) / 25;
        
        card.style.transform = perspective(1000 px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});