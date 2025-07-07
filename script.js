// Enhanced JavaScript for the landing page with improved responsive features
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu?.contains(e.target) && !hamburger?.contains(e.target)) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Improved smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced navbar background change on scroll with performance optimization
    let ticking = false;
    function updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(244, 228, 188, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(196, 30, 58, 0.15)';
            } else {
                navbar.style.background = 'rgba(244, 228, 188, 0.95)';
                navbar.style.boxShadow = '0 2px 8px rgba(196, 30, 58, 0.1)';
            }
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Responsive floating animations with reduced motion support
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const floatingItems = document.querySelectorAll('.floating-item');
    
    if (!prefersReducedMotion && window.innerWidth > 768) {
        floatingItems.forEach((item, index) => {
            const speed = parseFloat(item.getAttribute('data-speed')) || 1;
            let position = index * 100;
            
            function animate() {
                if (window.innerWidth > 768) { // Only animate on larger screens
                    position += speed * 0.3;
                    const y = Math.sin(position * 0.01) * 25;
                    const x = Math.cos(position * 0.01) * 15;
                    const rotation = Math.sin(position * 0.005) * 20;
                    item.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
                }
                requestAnimationFrame(animate);
            }
            animate();
        });
    } else {
        // Hide floating items on mobile or if reduced motion is preferred
        floatingItems.forEach(item => {
            item.style.display = 'none';
        });
    }

    // Enhanced counter animation with Intersection Observer
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/[0-9]/g, '');
                animateCounter(counter, target, suffix, 2000);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-number').forEach(counter => {
        counterObserver.observe(counter);
    });

    function animateCounter(element, target, suffix, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        }
        updateCounter();
    }

    // Enhanced intersection observer for animations with responsive considerations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }, {
        threshold: window.innerWidth < 768 ? 0.1 : 0.2,
        rootMargin: window.innerWidth < 768 ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
    });

    // Apply animations to elements with staggered timing
    document.querySelectorAll('.feature, .btec-feature-block, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        fadeObserver.observe(el);
    });

    // Enhanced form handling with better validation and UX
    const form = document.querySelector('#consultationForm');
    if (form) {
        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Đang gửi...';
            submitBtn.disabled = true;
            
            // Enhanced validation
            if (!validateForm(data)) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24h.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    function validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        
        clearFieldError(field);
        
        switch (field.name) {
            case 'name':
                if (!value || value.length < 2) {
                    showFieldError(field, 'Vui lòng nhập họ tên hợp lệ (ít nhất 2 ký tự)');
                    return false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) {
                    showFieldError(field, 'Vui lòng nhập email hợp lệ');
                    return false;
                }
                break;
            case 'phone':
                const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
                if (!value || !phoneRegex.test(value)) {
                    showFieldError(field, 'Vui lòng nhập số điện thoại hợp lệ');
                    return false;
                }
                break;
            case 'program':
                if (!value) {
                    showFieldError(field, 'Vui lòng chọn ngành học quan tâm');
                    return false;
                }
                break;
        }
        return true;
    }

    function showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--imperial-red);
            font-size: 0.85rem;
            margin-top: 5px;
            animation: slideIn 0.3s ease;
        `;
        
        field.style.borderColor = 'var(--imperial-red)';
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    function clearErrors(event) {
        clearFieldError(event.target);
    }

    function validateForm(data) {
        let isValid = true;
        const form = document.querySelector('#consultationForm');
        const fields = form.querySelectorAll('input[required], select[required]');
        
        fields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Enhanced notification system with better mobile support
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Đóng thông báo">&times;</button>
            </div>
        `;
        
        // Enhanced responsive styles
        const isMobile = window.innerWidth < 768;
        notification.style.cssText = `
            position: fixed;
            top: ${isMobile ? '20px' : '100px'};
            right: ${isMobile ? '10px' : '20px'};
            left: ${isMobile ? '10px' : 'auto'};
            background: ${getNotificationColor(type)};
            color: white;
            padding: ${isMobile ? '1rem 1.5rem' : '1.5rem 2rem'};
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateY(-100%);
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: ${isMobile ? 'none' : '400px'};
            border: 2px solid rgba(255, 255, 255, 0.2);
            font-size: ${isMobile ? '0.9rem' : '1rem'};
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0) scale(1)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            closeNotification(notification);
        });
        
        // Auto remove after 6 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                closeNotification(notification);
            }
        }, 6000);

        // Touch/swipe to dismiss on mobile
        if (isMobile) {
            let startY = 0;
            notification.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
            });
            
            notification.addEventListener('touchmove', (e) => {
                const currentY = e.touches[0].clientY;
                const diff = startY - currentY;
                if (diff > 50) {
                    closeNotification(notification);
                }
            });
        }
    }

    function closeNotification(notification) {
        notification.style.transform = 'translateY(-100%) scale(0.8)';
        setTimeout(() => notification.remove(), 400);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    function getNotificationColor(type) {
        switch (type) {
            case 'success': return 'linear-gradient(135deg, #27ae60, #2ecc71)';
            case 'error': return 'linear-gradient(135deg, #e74c3c, #c0392b)';
            case 'warning': return 'linear-gradient(135deg, #f39c12, #e67e22)';
            default: return 'linear-gradient(135deg, #3498db, #2980b9)';
        }
    }

    // Enhanced scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, var(--imperial-red), var(--golden-yellow), var(--imperial-blue));
        z-index: 10001;
        transition: width 0.1s ease;
        box-shadow: 0 2px 4px rgba(196, 30, 58, 0.3);
    `;
    document.body.appendChild(progressBar);
    
    let progressTicking = false;
    function updateProgress() {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(scrolled, 100) + '%';
        progressTicking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!progressTicking) {
            requestAnimationFrame(updateProgress);
            progressTicking = true;
        }
    });

    // Responsive utilities
    function handleResize() {
        const isMobile = window.innerWidth < 768;
        
        // Hide floating elements on mobile
        floatingItems.forEach(item => {
            item.style.display = isMobile ? 'none' : 'block';
        });
        
        // Adjust intersection observer thresholds
        if (fadeObserver.root) {
            fadeObserver.disconnect();
            // Reinitialize with new settings if needed
        }
        
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Throttled resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

    // Touch event improvements for better mobile interaction
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });

    // Keyboard navigation improvements
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Focus management for accessibility
    navLinks.forEach(link => {
        link.addEventListener('focus', () => {
            if (window.innerWidth < 768 && !navMenu?.classList.contains('active')) {
                hamburger?.click();
            }
        });
    });

    // Enhanced lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Performance optimization - preload critical resources
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Preload critical images
            ['assets/Logo-Btec.png', 'assets/brand-01.png'].forEach(src => {
                const img = new Image();
                img.src = src;
            });
        });
    }

    // Traditional Easter Egg with touch support
    let keySequence = [];
    const dragonSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];
    let touchSequence = [];
    let touchStartY = 0;

    document.addEventListener('keydown', (e) => {
        keySequence.push(e.code);
        if (keySequence.length > dragonSequence.length) {
            keySequence.shift();
        }
        
        if (keySequence.join(',') === dragonSequence.join(',')) {
            createDragonAnimation();
            showNotification('🐉 Long vương hiện thân! Chúc bạn thành công trong việc học tập! 🐉', 'success');
            keySequence = [];
        }
    });

    // Touch version of dragon sequence
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 50) {
            touchSequence.push(diff > 0 ? 'up' : 'down');
            if (touchSequence.length > 6) touchSequence.shift();
            
            if (touchSequence.join(',') === 'up,up,down,down,up,down') {
                createDragonAnimation();
                showNotification('🐉 Long vương hiện thân! (Touch version) 🐉', 'success');
                touchSequence = [];
            }
        }
    }, { passive: true });

    function createDragonAnimation() {
        const dragon = document.createElement('div');
        dragon.innerHTML = '🐉';
        dragon.style.cssText = `
            position: fixed;
            font-size: ${window.innerWidth < 768 ? '3rem' : '4rem'};
            z-index: 10000;
            top: 50%;
            left: -100px;
            animation: dragonFly 3s ease-in-out forwards;
            pointer-events: none;
        `;
        
        const dragonKeyframes = `
            @keyframes dragonFly {
                0% { 
                    left: -100px; 
                    transform: translateY(-50%) rotate(0deg) scale(1);
                }
                25% { 
                    left: 25vw; 
                    transform: translateY(-80%) rotate(10deg) scale(1.2);
                }
                50% { 
                    left: 50vw; 
                    transform: translateY(-50%) rotate(-5deg) scale(1.5);
                }
                75% { 
                    left: 75vw; 
                    transform: translateY(-30%) rotate(15deg) scale(1.2);
                }
                100% { 
                    left: calc(100vw + 100px); 
                    transform: translateY(-50%) rotate(0deg) scale(1);
                }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = dragonKeyframes;
        document.head.appendChild(style);
        
        document.body.appendChild(dragon);
        
        setTimeout(() => {
            dragon.remove();
            style.remove();
        }, 3000);
    }

    // Initialize
    handleResize();
});

// Add enhanced notification styles with responsive considerations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 15px;
        font-weight: 600;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
        flex-shrink: 0;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .field-error {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (max-width: 768px) {
        .notification-content {
            gap: 10px;
            font-size: 0.9rem;
        }
        
        .notification-content i {
            font-size: 1.2rem;
        }
        
        .notification-close {
            width: 20px;
            height: 20px;
            font-size: 1.2rem;
        }
    }
    
    @media (max-width: 480px) {
        .notification-content {
            flex-direction: column;
            text-align: center;
            gap: 8px;
        }
        
        .notification-close {
            align-self: flex-end;
            margin: -10px -5px 0 0;
        }
    }
`;
document.head.appendChild(notificationStyles);
