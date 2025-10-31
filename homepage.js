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