// 🐲 EPIC DRAGON EASTER EGG - SIÊU HÙNG VĨ
class EpicDragonEasterEgg {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.setupAudio();
    }

    // Tạo âm thanh cho hiệu ứng
    setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    // Tạo âm thanh synthesized
    playSound(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Tạo hiệu ứng EPIC DRAGON
    createEpicDragonAnimation() {
        // Kích hoạt âm thanh rồng
        this.playDragonRoar();
        
        // Tạo overlay toàn màn hình
        const overlay = this.createDramaticOverlay();
        
        // Screen shake effect
        this.addScreenShake();
        
        // Tạo nhiều con rồng
        this.createMultipleDragons();
        
        // Lightning effects
        this.createLightningEffects();
        
        // Fire particles
        this.createFireParticles();
        
        // Epic text animation
        this.createEpicTextAnimation();
        
        // Cleanup sau 8 giây
        setTimeout(() => {
            overlay.remove();
            document.body.classList.remove('dragon-shake');
            this.cleanup();
        }, 8000);
    }

    // Âm thanh rồng gầm
    playDragonRoar() {
        if (!this.audioContext) return;
        
        // Tiếng gầm thấp và mạnh mẽ
        setTimeout(() => this.playSound(80, 1.5, 'sawtooth'), 0);
        setTimeout(() => this.playSound(120, 1.2, 'square'), 300);
        setTimeout(() => this.playSound(200, 0.8, 'triangle'), 600);
        
        // Tiếng sét
        setTimeout(() => this.playSound(1000, 0.1, 'white'), 1000);
        setTimeout(() => this.playSound(800, 0.1, 'white'), 1100);
        setTimeout(() => this.playSound(600, 0.2, 'white'), 1200);
    }

    // Tạo overlay dramatic
    createDramaticOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'dragon-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: linear-gradient(45deg, 
                rgba(196, 30, 58, 0.1) 0%, 
                rgba(0, 0, 0, 0.3) 30%, 
                rgba(255, 215, 0, 0.1) 60%, 
                rgba(0, 56, 147, 0.1) 100%);
            z-index: 9999;
            pointer-events: none;
            animation: dramaticOverlay 8s ease-in-out forwards;
        `;

        // CSS cho overlay
        const overlayStyles = `
            @keyframes dramaticOverlay {
                0% { opacity: 0; transform: scale(1); }
                10% { opacity: 1; transform: scale(1.02); }
                90% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.98); }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = overlayStyles;
        document.head.appendChild(styleSheet);

        document.body.appendChild(overlay);
        return overlay;
    }

    // Screen shake effect
    addScreenShake() {
        const shakeStyles = `
            @keyframes dragonShake {
                0%, 100% { transform: translateX(0) translateY(0); }
                10% { transform: translateX(-2px) translateY(-1px); }
                20% { transform: translateX(2px) translateY(1px); }
                30% { transform: translateX(-1px) translateY(-2px); }
                40% { transform: translateX(1px) translateY(2px); }
                50% { transform: translateX(-2px) translateY(1px); }
                60% { transform: translateX(2px) translateY(-1px); }
                70% { transform: translateX(-1px) translateY(2px); }
                80% { transform: translateX(1px) translateY(-2px); }
                90% { transform: translateX(-2px) translateY(-1px); }
            }
            .dragon-shake {
                animation: dragonShake 0.5s ease-in-out 3;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = shakeStyles;
        document.head.appendChild(styleSheet);

        document.body.classList.add('dragon-shake');
    }

    // Tạo nhiều con rồng với paths khác nhau
    createMultipleDragons() {
        const dragonEmojis = ['🐉', '🐲', '🐉', '🐲', '🐉'];
        const paths = [
            { start: { x: -150, y: '20%' }, end: { x: '120vw', y: '25%' }, duration: 4000 },
            { start: { x: -200, y: '40%' }, end: { x: '125vw', y: '35%' }, duration: 5000 },
            { start: { x: -100, y: '60%' }, end: { x: '115vw', y: '55%' }, duration: 4500 },
            { start: { x: -250, y: '30%' }, end: { x: '130vw', y: '45%' }, duration: 5500 },
            { start: { x: -180, y: '70%' }, end: { x: '110vw', y: '65%' }, duration: 4200 }
        ];

        dragonEmojis.forEach((emoji, index) => {
            setTimeout(() => {
                this.createSingleDragon(emoji, paths[index], index);
            }, index * 300);
        });
    }

    // Tạo từng con rồng
    createSingleDragon(emoji, path, index) {
        const dragon = document.createElement('div');
        dragon.innerHTML = emoji;
        dragon.className = `epic-dragon dragon-${index}`;
        
        const size = 4 + Math.random() * 3; // Random size từ 4-7rem
        const rotationSpeed = 1 + Math.random() * 2;
        
        dragon.style.cssText = `
            position: fixed;
            font-size: ${window.innerWidth < 768 ? size * 0.7 : size}rem;
            z-index: 10000 + ${index};
            top: ${path.start.y};
            left: ${path.start.x}px;
            pointer-events: none;
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) 
                    drop-shadow(0 0 40px rgba(196, 30, 58, 0.6));
            animation: dragonFly${index} ${path.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards,
                       dragonRotate${index} ${rotationSpeed}s linear infinite;
        `;

        // CSS cho từng con rồng
        const dragonKeyframes = `
            @keyframes dragonFly${index} {
                0% { 
                    left: ${path.start.x}px; 
                    top: ${path.start.y};
                    transform: scale(0.5) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                    transform: scale(1) rotate(${index * 45}deg);
                }
                25% { 
                    left: 20vw; 
                    top: calc(${path.start.y} + ${Math.sin(index) * 10}vh);
                    transform: scale(1.2) rotate(${index * 45 + 90}deg);
                }
                50% { 
                    left: 50vw; 
                    top: calc(${path.end.y} + ${Math.cos(index) * 8}vh);
                    transform: scale(1.5) rotate(${index * 45 + 180}deg);
                }
                75% { 
                    left: 80vw; 
                    top: calc(${path.end.y} + ${Math.sin(index + 1) * 6}vh);
                    transform: scale(1.3) rotate(${index * 45 + 270}deg);
                }
                100% { 
                    left: ${path.end.x}; 
                    top: ${path.end.y};
                    transform: scale(0.8) rotate(${index * 45 + 360}deg);
                    opacity: 0;
                }
            }
            
            @keyframes dragonRotate${index} {
                0% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) 
                            drop-shadow(0 0 40px rgba(196, 30, 58, 0.6)) hue-rotate(0deg); }
                50% { filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1)) 
                             drop-shadow(0 0 60px rgba(196, 30, 58, 0.8)) hue-rotate(180deg); }
                100% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) 
                              drop-shadow(0 0 40px rgba(196, 30, 58, 0.6)) hue-rotate(360deg); }
            }
        `;

        const style = document.createElement('style');
        style.textContent = dragonKeyframes;
        document.head.appendChild(style);

        document.body.appendChild(dragon);

        // Cleanup individual dragon
        setTimeout(() => {
            dragon.remove();
            style.remove();
        }, path.duration + 1000);
    }

    // Lightning effects
    createLightningEffects() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createLightningBolt();
            }, 1000 + i * 500);
        }
    }

    createLightningBolt() {
        const lightning = document.createElement('div');
        lightning.className = 'lightning-bolt';
        lightning.style.cssText = `
            position: fixed;
            top: 0;
            left: ${Math.random() * 100}vw;
            width: 3px;
            height: 100vh;
            background: linear-gradient(to bottom, 
                rgba(255, 255, 255, 1) 0%,
                rgba(173, 216, 230, 0.8) 30%,
                rgba(255, 215, 0, 0.6) 60%,
                transparent 100%);
            z-index: 10001;
            pointer-events: none;
            animation: lightningStrike 0.2s ease-out forwards;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
                        0 0 40px rgba(173, 216, 230, 0.6),
                        0 0 60px rgba(255, 215, 0, 0.4);
        `;

        const lightningStyles = `
            @keyframes lightningStrike {
                0% { opacity: 0; transform: scaleY(0); }
                20% { opacity: 1; transform: scaleY(1) scaleX(2); }
                40% { opacity: 0.7; transform: scaleY(0.8) scaleX(1); }
                60% { opacity: 1; transform: scaleY(1) scaleX(1.5); }
                100% { opacity: 0; transform: scaleY(0) scaleX(0.5); }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = lightningStyles;
        document.head.appendChild(styleSheet);

        document.body.appendChild(lightning);

        setTimeout(() => {
            lightning.remove();
            styleSheet.remove();
        }, 500);
    }

    // Fire particles effect
    createFireParticles() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.createFireParticle();
            }, Math.random() * 6000);
        }
    }

    createFireParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: ${5 + Math.random() * 10}px;
            height: ${5 + Math.random() * 10}px;
            background: radial-gradient(circle, 
                rgba(255, 100, 0, 1) 0%,
                rgba(255, 215, 0, 0.8) 40%,
                rgba(255, 0, 0, 0.6) 70%,
                transparent 100%);
            border-radius: 50%;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            z-index: 9998;
            pointer-events: none;
            animation: fireParticle ${2 + Math.random() * 3}s ease-out forwards;
            filter: blur(${Math.random() * 2}px);
        `;

        const particleStyles = `
            @keyframes fireParticle {
                0% { 
                    top: 100vh; 
                    opacity: 1; 
                    transform: scale(0.5) rotate(0deg);
                }
                50% { 
                    top: 50vh; 
                    opacity: 0.8; 
                    transform: scale(1) rotate(180deg);
                }
                100% { 
                    top: -50px; 
                    opacity: 0; 
                    transform: scale(0.2) rotate(360deg);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = particleStyles;
        document.head.appendChild(styleSheet);

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
            styleSheet.remove();
        }, 5000);
    }

    // Epic text animation
    createEpicTextAnimation() {
        const textContainer = document.createElement('div');
        textContainer.className = 'epic-text-container';
        textContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10002;
            pointer-events: none;
            text-align: center;
        `;

        const mainText = document.createElement('div');
        mainText.className = 'epic-main-text';
        mainText.innerHTML = '🐉 LONG VƯƠNG GIÁNG THẾ 🐉';
        mainText.style.cssText = `
            font-family: 'Ma Shan Zheng', cursive;
            font-size: ${window.innerWidth < 768 ? '2.5rem' : '4rem'};
            color: #FFD700;
            text-shadow: 
                0 0 10px rgba(255, 215, 0, 1),
                0 0 20px rgba(255, 215, 0, 0.8),
                0 0 30px rgba(196, 30, 58, 0.6),
                0 0 40px rgba(196, 30, 58, 0.4),
                3px 3px 0px rgba(0, 0, 0, 0.8);
            animation: epicTextMain 6s ease-in-out forwards;
            margin-bottom: 1rem;
        `;

        const subText = document.createElement('div');
        subText.className = 'epic-sub-text';
        subText.innerHTML = '⚡ CHÚC PHÚC CHO SĨ TỬ TRẠNG CODE ⚡';
        subText.style.cssText = `
            font-family: 'ZCOOL XiaoWei', cursive;
            font-size: ${window.innerWidth < 768 ? '1.2rem' : '2rem'};
            color: #FFFFFF;
            text-shadow: 
                0 0 5px rgba(255, 255, 255, 1),
                0 0 10px rgba(173, 216, 230, 0.8),
                0 0 15px rgba(0, 56, 147, 0.6),
                2px 2px 0px rgba(0, 0, 0, 0.8);
            animation: epicTextSub 6s ease-in-out forwards;
            animation-delay: 1s;
            opacity: 0;
        `;

        const textStyles = `
            @keyframes epicTextMain {
                0% { 
                    opacity: 0; 
                    transform: scale(0.3) rotateY(-90deg); 
                }
                20% { 
                    opacity: 1; 
                    transform: scale(1.2) rotateY(0deg); 
                }
                40% { 
                    transform: scale(1) rotateY(10deg); 
                }
                60% { 
                    transform: scale(1.1) rotateY(-5deg); 
                }
                80% { 
                    transform: scale(1) rotateY(0deg); 
                }
                100% { 
                    opacity: 0; 
                    transform: scale(0.8) rotateY(90deg); 
                }
            }
            
            @keyframes epicTextSub {
                0% { 
                    opacity: 0; 
                    transform: translateY(50px) scale(0.5); 
                }
                30% { 
                    opacity: 1; 
                    transform: translateY(0) scale(1.1); 
                }
                70% { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
                100% { 
                    opacity: 0; 
                    transform: translateY(-30px) scale(0.7); 
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = textStyles;
        document.head.appendChild(styleSheet);

        textContainer.appendChild(mainText);
        textContainer.appendChild(subText);
        document.body.appendChild(textContainer);

        setTimeout(() => {
            textContainer.remove();
            styleSheet.remove();
        }, 7000);
    }

    // Cleanup function
    cleanup() {
        // Remove any remaining elements
        document.querySelectorAll('.epic-dragon, .lightning-bolt, .epic-text-container').forEach(el => {
            el.remove();
        });
        
        // Remove temporary styles
        document.querySelectorAll('style').forEach(style => {
            if (style.textContent.includes('dragonFly') || 
                style.textContent.includes('lightning') || 
                style.textContent.includes('epicText')) {
                style.remove();
            }
        });
    }
}

// Tối ưu JavaScript với hiệu suất cao
class WebsiteOptimizer {
    constructor() {
        this.isMobile = window.innerWidth < 768;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.ticking = false;
        this.progressTicking = false;
        this.resizeTimeout = null;
        
        this.init();
    }
    
    init() {
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupFormHandling();
        this.setupIntersectionObservers();
        this.setupEventListeners();
        this.setupGalleryMarquee();
        this.setupEasterEgg();
        this.handleResize();
        
        // Performance optimization
        this.preloadCriticalResources();
    }
    
    // Mobile Navigation
    setupMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!hamburger || !navMenu) return;
        
        // Toggle mobile menu
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu on link click or outside click
        const closeMenu = () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        navLinks.forEach(link => link.addEventListener('click', closeMenu));
        
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
        
        // Focus management for accessibility
        navLinks.forEach(link => {
            link.addEventListener('focus', () => {
                if (this.isMobile && !navMenu.classList.contains('active')) {
                    hamburger.click();
                }
            });
        });
    }
    
    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
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
    }
    
    // Scroll Effects
    setupScrollEffects() {
        // Navbar background change
        const updateNavbar = () => {
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
            this.ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(updateNavbar);
                this.ticking = true;
            }
        });
        
        // Progress bar
        this.setupProgressBar();
    }
    
    setupProgressBar() {
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
        
        const updateProgress = () => {
            const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(scrolled, 100) + '%';
            this.progressTicking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!this.progressTicking) {
                requestAnimationFrame(updateProgress);
                this.progressTicking = true;
            }
        });
    }
    
    // Animations
    setupAnimations() {
        this.setupFloatingElements();
        this.setupFadeAnimations();
    }
    
    setupFloatingElements() {
        const isTabletOrMobile = window.innerWidth < 1075;
        if (this.prefersReducedMotion || isTabletOrMobile) {
            document.querySelectorAll('.floating-item').forEach(item => {
                item.style.display = 'none';
            });
            return;
        }
        
        const floatingItems = document.querySelectorAll('.floating-item');
        
        floatingItems.forEach((item, index) => {
            const speed = parseFloat(item.getAttribute('data-speed')) || 1;
            let position = index * 100;
            
            const animate = () => {
                if (window.innerWidth > 1075) {
                    position += speed * 0.3;
                    const y = Math.sin(position * 0.01) * 25;
                    const x = Math.cos(position * 0.01) * 15;
                    const rotation = Math.sin(position * 0.005) * 20;
                    item.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
                }
                requestAnimationFrame(animate);
            };
            animate();
        });
    }
    
    setupFadeAnimations() {
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
            threshold: this.isMobile ? 0.1 : 0.2,
            rootMargin: this.isMobile ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
        });

        document.querySelectorAll('.feature, .btec-feature-block, .testimonial-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            fadeObserver.observe(el);
        });
    }
    
    // Counter Animation
    setupIntersectionObservers() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent.replace(/\D/g, ''));
                    const suffix = counter.textContent.replace(/[0-9]/g, '');
                    this.animateCounter(counter, target, suffix, 2000);
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.stat-number').forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    animateCounter(element, target, suffix, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        };
        updateCounter();
    }
    
    // Form Handling
    setupFormHandling() {
        const form = document.querySelector('#consultationForm');
        if (!form) return;
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearErrors.bind(this));
        });

        form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }
    
    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        
        this.clearFieldError(field);
        
        const validators = {
            name: (v) => !v || v.length < 2 ? 'Vui lòng nhập họ tên hợp lệ (ít nhất 2 ký tự)' : null,
            email: (v) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !v || !emailRegex.test(v) ? 'Vui lòng nhập email hợp lệ' : null;
            },
            phone: (v) => {
                const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
                return !v || !phoneRegex.test(v) ? 'Vui lòng nhập số điện thoại hợp lệ' : null;
            },
            program: (v) => !v ? 'Vui lòng chọn ngành học quan tâm' : null
        };
        
        const validator = validators[field.name];
        if (validator) {
            const error = validator(value);
            if (error) {
                this.showFieldError(field, error);
                return false;
            }
        }
        return true;
    }
    
    showFieldError(field, message) {
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
    
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }
    
    clearErrors(event) {
        this.clearFieldError(event.target);
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Đang gửi...';
        submitBtn.disabled = true;
        
        if (!this.validateForm(form)) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Simulate form submission
        setTimeout(() => {
            this.showNotification('Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24h.', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
    
    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input[required], select[required]');
        
        fields.forEach(field => {
            if (!this.validateField({ target: field })) {
                isValid = false;
            }
        });

        return isValid;
    }
    
    // Notification System
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Đóng thông báo">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: ${this.isMobile ? '20px' : '100px'};
            right: ${this.isMobile ? '10px' : '20px'};
            left: ${this.isMobile ? '10px' : 'auto'};
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: ${this.isMobile ? '1rem 1.5rem' : '1.5rem 2rem'};
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateY(-100%);
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: ${this.isMobile ? 'none' : '400px'};
            border: 2px solid rgba(255, 255, 255, 0.2);
            font-size: ${this.isMobile ? '0.9rem' : '1rem'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateY(0) scale(1)';
        }, 100);
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));
        
        setTimeout(() => {
            if (notification.parentNode) {
                this.closeNotification(notification);
            }
        }, 6000);

        // Touch gestures for mobile
        if (this.isMobile) {
            this.setupTouchGestures(notification);
        }
    }
    
    setupTouchGestures(notification) {
        let startY = 0;
        notification.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        notification.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const diff = startY - currentY;
            if (diff > 50) {
                this.closeNotification(notification);
            }
        }, { passive: true });
    }
    
    closeNotification(notification) {
        notification.style.transform = 'translateY(-100%) scale(0.8)';
        setTimeout(() => notification.remove(), 400);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #27ae60, #2ecc71)',
            error: 'linear-gradient(135deg, #e74c3c, #c0392b)',
            warning: 'linear-gradient(135deg, #f39c12, #e67e22)',
            info: 'linear-gradient(135deg, #3498db, #2980b9)'
        };
        return colors[type] || colors.info;
    }
    
    // Gallery Marquee
    setupGalleryMarquee() {
        const marquee = document.querySelector('.gallery-marquee');
        if (!marquee) return;
        
        // Duplicate images multiple times to ensure no gaps
        if (!marquee.dataset.duplicated) {
            const originalContent = marquee.innerHTML;
            // Duplicate content 3 times for better coverage
            marquee.innerHTML = originalContent + originalContent + originalContent;
            marquee.dataset.duplicated = 'true';
        }
        
        // Pause animation on hover
        marquee.addEventListener('mouseenter', () => {
            marquee.style.animationPlayState = 'paused';
        });
        
        marquee.addEventListener('mouseleave', () => {
            marquee.style.animationPlayState = 'running';
        });
        
        // Pause on touch for mobile accessibility
        marquee.addEventListener('touchstart', () => {
            marquee.style.animationPlayState = 'paused';
        });
        
        marquee.addEventListener('touchend', () => {
            setTimeout(() => {
                marquee.style.animationPlayState = 'running';
            }, 1000);
        });
    }
    
    // Epic Easter Egg
setupEasterEgg() {
    this.epicDragon = new EpicDragonEasterEgg();
    
    let keySequence = [];
    let touchSequence = [];
    let touchStartY = 0;
    const dragonSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];

    document.addEventListener('keydown', (e) => {
        keySequence.push(e.code);
        if (keySequence.length > dragonSequence.length) {
            keySequence.shift();
        }
        
        if (keySequence.join(',') === dragonSequence.join(',')) {
            this.epicDragon.createEpicDragonAnimation();
            this.showNotification('🐉 EPIC DRAGON MODE ACTIVATED! 🐉', 'success');
            keySequence = [];
        }
    });

    // Touch version
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
                this.epicDragon.createEpicDragonAnimation();
                this.showNotification('🐉 EPIC DRAGON MODE - TOUCH VERSION! 🐉', 'success');
                touchSequence = [];
            }
        }
    }, { passive: true });
}
    
    // Event Listeners
    setupEventListeners() {
        // Touch events for better mobile interaction
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
        
        // Resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.handleResize(), 250);
        });
    }
    
    // Resize Handler
    handleResize() {
        this.isMobile = window.innerWidth < 768;
        
        // Hide floating elements on mobile/tablet
        const isTabletOrMobile = window.innerWidth < 1075;
        document.querySelectorAll('.floating-item').forEach(item => {
            item.style.display = isTabletOrMobile ? 'none' : 'block';
        });
        
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 1075) {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Performance Optimization
    preloadCriticalResources() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // Preload critical images
                const criticalImages = ['assets/Logo-Btec.png', 'assets/brand-01.png'];
                criticalImages.forEach(src => {
                    const img = new Image();
                    img.src = src;
                });
            });
        }
        
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
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteOptimizer();
});