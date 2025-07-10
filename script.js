// 🐲 3D Dragon Viewer Class
class Dragon3DViewer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.dragon = null;
        this.mixer = null;
        this.clock = null;
        this.container = null;
        this.isLoaded = false;
        this.THREE = null;
        this.GLTFLoader = null;
    }

    // Load THREE.js libraries using ES modules
    async loadThreeJS() {
        try {
            console.log('Loading Three.js ES modules...');
            
            // Dynamic import Three.js modules
            const THREE = await import('three');
            const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
            
            console.log('Three.js ES modules loaded successfully');
            return { THREE, GLTFLoader };
        } catch (error) {
            console.error('Failed to load Three.js ES modules:', error);
            throw error;
        }
    }

    async init(container) {
        this.container = container;
        
        // Load THREE.js libraries
        const { THREE, GLTFLoader } = await this.loadThreeJS();
        this.THREE = THREE;
        this.GLTFLoader = GLTFLoader;
        
        // Initialize clock
        this.clock = new THREE.Clock();
        
        // Setup scene
        this.scene = new THREE.Scene();
        
        // Setup camera với field of view rộng hơn
        this.camera = new THREE.PerspectiveCamera(
            90, // Tăng FOV để nhìn thấy toàn bộ rồng
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(300, 5, 300); // Xoay sang bên phải một chút
        this.camera.lookAt(0, 0, 2); // Nhìn vào vị trí của rồng
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            premultipliedAlpha: false,
            depth: true // Đảm bảo depth buffer
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); // Hoàn toàn trong suốt
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Tối ưu depth và rendering
        this.renderer.sortObjects = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        container.appendChild(this.renderer.domElement);
        
        // Setup lighting
        this.setupLighting();
        
        // Load dragon model
        await this.loadDragonModel();
        
        // Start animation loop
        this.animate();
    }

    setupLighting() {
        const { THREE } = this;
        
        // Bright ambient light để rồng không bị tối
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        
        // Main directional light (sáng hơn)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Additional directional light từ phía đối diện
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight2.position.set(-10, 10, -5);
        this.scene.add(directionalLight2);
        
        // Point lights for dramatic effect (sáng hơn)
        const redLight = new THREE.PointLight(0xff0000, 1.2, 30);
        redLight.position.set(-5, 3, 2);
        this.scene.add(redLight);
        
        const goldLight = new THREE.PointLight(0xffd700, 1, 25);
        goldLight.position.set(5, 3, -2);
        this.scene.add(goldLight);
        
        // Additional lights để chiếu sáng toàn diện
        const topLight = new THREE.PointLight(0xffffff, 0.8, 20);
        topLight.position.set(0, 10, 0);
        this.scene.add(topLight);
        
        const frontLight = new THREE.PointLight(0xffffff, 0.6, 15);
        frontLight.position.set(0, 0, 10);
        this.scene.add(frontLight);
    }

    async loadDragonModel() {
        try {
            console.log('Creating GLTFLoader...');
            const loader = new this.GLTFLoader();
            console.log('GLTFLoader created successfully');
            
            const modelPath = 'assets/models/chinese_dragon.glb';
            console.log('Loading dragon model from:', modelPath);
            
            const gltf = await new Promise((resolve, reject) => {
                loader.load(
                    modelPath,
                    resolve,
                    (progress) => {
                        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
                    },
                    (error) => {
                        console.error('Error loading model:', error);
                        reject(error);
                    }
                );
            });
            
            this.dragon = gltf.scene;
            
            // Scale and position the dragon (thu nhỏ rất nhiều)
            this.dragon.scale.set(0.2, 0.2, 0.2);
            this.dragon.position.set(0, 0, 2); // Đưa ra phía trước trang web
            this.dragon.rotation.y = Math.PI / 4;
            
            // Enable shadows và enhance materials
            this.dragon.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Enhance materials để sáng hơn
                    if (child.material) {
                        // Clone material để không ảnh hưởng original
                        child.material = child.material.clone();
                        
                        child.material.metalness = 0.2;
                        child.material.roughness = 0.3;
                        
                        // Tăng brightness
                        if (child.material.color) {
                            child.material.color.multiplyScalar(1.3);
                        }
                        
                        // Thêm emissive để tự phát sáng
                        if (child.material.emissive) {
                            child.material.emissive.multiplyScalar(0.3);
                        }
                        
                        // Cập nhật material
                        child.material.needsUpdate = true;
                    }
                }
            });
            
            this.scene.add(this.dragon);
            
            // Setup animations if available
            if (gltf.animations && gltf.animations.length > 0) {
                this.mixer = new this.THREE.AnimationMixer(this.dragon);
                
                gltf.animations.forEach((clip) => {
                    const action = this.mixer.clipAction(clip);
                    action.time = 9; // Bắt đầu từ giây thứ 7
                    action.play();
                });
            }
            
            this.isLoaded = true;
            console.log('Dragon model loaded successfully!');
            
        } catch (error) {
            console.error('Error loading dragon model:', error);
            console.log('Creating fallback dragon geometry...');
            
            // Create fallback dragon using basic geometry
            this.createFallbackDragon();
            this.isLoaded = true;
        }
    }

    // Create fallback dragon using basic Three.js geometry
    createFallbackDragon() {
        const { THREE } = this;
        const group = new THREE.Group();
        
        // Dragon body (elongated cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff3333,
            shininess: 100,
            emissive: 0x330000, // Thêm emissive để sáng hơn
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = Math.PI / 2;
        group.add(body);
        
        // Dragon head (sphere)
        const headGeometry = new THREE.SphereGeometry(0.6, 8, 6);
        const headMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff4444,
            shininess: 100,
            emissive: 0x440000,
            emissiveIntensity: 0.3
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.x = 2.5;
        group.add(head);
        
        // Dragon eyes
        const eyeGeometry = new THREE.SphereGeometry(0.1, 6, 4);
        const eyeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffd700,
            emissive: 0xffaa00,
            emissiveIntensity: 0.5
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(2.8, 0.2, 0.3);
        group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(2.8, 0.2, -0.3);
        group.add(rightEye);
        
        // Dragon wings
        const wingGeometry = new THREE.ConeGeometry(1, 2, 4);
        const wingMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xaa2222,
            transparent: true,
            opacity: 0.9,
            emissive: 0x220000,
            emissiveIntensity: 0.1
        });
        
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(0, 1.5, 1);
        leftWing.rotation.z = Math.PI / 4;
        group.add(leftWing);
        
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(0, 1.5, -1);
        rightWing.rotation.z = -Math.PI / 4;
        group.add(rightWing);
        
        // Dragon tail
        const tailGeometry = new THREE.ConeGeometry(0.2, 1.5, 6);
        const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
        tail.position.x = -2.5;
        tail.rotation.z = Math.PI / 2;
        group.add(tail);
        
        // Set dragon properties
        this.dragon = group;
        this.dragon.scale.set(0.2, 0.2, 0.2);
        this.dragon.position.set(0, 0, 2); // Đưa ra phía trước trang web
        this.dragon.rotation.y = Math.PI / 4;
        
        // Enable shadows
        group.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        this.scene.add(this.dragon);
        console.log('Fallback dragon created successfully!');
    }

    animate() {
        const delta = this.clock.getDelta();
        
        // Update animations
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Dragon animation (không xoay)
        if (this.dragon) {
            // Add floating motion với movement nhẹ nhàng hơn
            const time = Date.now() * 0.001;
            this.dragon.position.y = Math.sin(time) * 1; // Tăng amplitude vì camera xa hơn
            this.dragon.position.x = Math.sin(time * 0.7) * 0.8;
            this.dragon.position.z = 2 + Math.sin(time * 0.5) * 0.5; // Dao động ở phía trước
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }

    show() {
        if (this.container) {
            this.container.style.display = 'block';
            this.container.style.opacity = '0';
            
            // Fade in
            setTimeout(() => {
                this.container.style.transition = 'opacity 1s ease-in-out';
                this.container.style.opacity = '1';
                this.container.classList.add('active');
            }, 100);
        }
    }

    hide() {
        if (this.container) {
            this.container.style.transition = 'opacity 1s ease-in-out';
            this.container.style.opacity = '0';
            
            setTimeout(() => {
                this.container.style.display = 'none';
            }, 1000);
        }
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    onWindowResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}

// 🐲 EPIC DRAGON EASTER EGG - SIÊU HÙNG VĨ
class EpicDragonEasterEgg {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.dragon3D = null;
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

    // Tạo hiệu ứng EPIC DRAGON với 3D Model
    async createEpicDragonAnimation() {
        // Kích hoạt âm thanh rồng
        this.playDragonRoar();
        
        // Tạo overlay toàn màn hình
        const overlay = this.createDramaticOverlay();
        
        // Screen shake effect
        this.addScreenShake();
        
        // Tạo 3D Dragon thay vì emoji dragons
        await this.create3DDragon();
        
        // Lightning effects
        this.createLightningEffects();
        
        // Fire particles
        this.createFireParticles();
        
        // Epic text animation
        this.createEpicTextAnimation();
        
        // Cleanup sau 12 giây (tăng thời gian cho 3D dragon)
        setTimeout(() => {
            overlay.remove();
            document.body.classList.remove('dragon-shake');
            this.cleanup();
        }, 12000);
    }

    // Tạo 3D Dragon Scene
    async create3DDragon() {
        // Tạo container cho 3D scene
        const dragonContainer = document.createElement('div');
        dragonContainer.className = 'dragon-3d-container';
        dragonContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10002;
            pointer-events: none;
            display: block;
        `;

        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = '🐉 Đang triệu hồi Long Vương... 🐉';
        loadingDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #FFD700;
            font-size: 2rem;
            font-family: 'Ma Shan Zheng', cursive;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            z-index: 10003;
            animation: pulse 1s ease-in-out infinite alternate;
        `;
        dragonContainer.appendChild(loadingDiv);

        document.body.appendChild(dragonContainer);

        // Khởi tạo Dragon 3D Viewer
        this.dragon3D = new Dragon3DViewer();
        
        try {
            await this.dragon3D.init(dragonContainer);
            
            // Remove loading indicator
            const loadingDiv = dragonContainer.querySelector('div');
            if (loadingDiv) {
                loadingDiv.remove();
            }
            
            // Hiển thị dragon với hiệu ứng fade-in
            this.dragon3D.show();
            
            // Tự động ẩn sau 10 giây
            setTimeout(() => {
                if (this.dragon3D) {
                    this.dragon3D.hide();
                }
            }, 10000);
            
            console.log('3D Dragon Easter Egg activated successfully!');
            
        } catch (error) {
            console.error('Failed to load 3D dragon:', error);
            // Remove loading indicator
            const loadingDiv = dragonContainer.querySelector('div');
            if (loadingDiv) {
                loadingDiv.remove();
            }
            // Fallback to original emoji dragons if 3D fails
            this.createMultipleDragons();
        }
    }

    // Âm thanh rồng gầm
    playDragonRoar() {
        if (!this.audioContext) return;
        
        // Tiếng gầm thấp và mạnh mẽ
        setTimeout(() => this.playSound(80, 1.5, 'sawtooth'), 0);
        setTimeout(() => this.playSound(120, 1.2, 'square'), 300);
        setTimeout(() => this.playSound(200, 0.8, 'triangle'), 600);
        
        // Tiếng sét (sử dụng sawtooth thay vì white noise)
        setTimeout(() => this.playSound(1000, 0.1, 'sawtooth'), 1000);
        setTimeout(() => this.playSound(800, 0.1, 'square'), 1100);
        setTimeout(() => this.playSound(600, 0.2, 'triangle'), 1200);
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
        document.querySelectorAll('.epic-dragon, .lightning-bolt, .epic-text-container, .dragon-3d-container').forEach(el => {
            el.remove();
        });
        
        // Dispose 3D dragon properly
        if (this.dragon3D) {
            this.dragon3D.dispose();
            this.dragon3D = null;
        }
        
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
    const dragonSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];

    document.addEventListener('keydown', async (e) => {
        keySequence.push(e.code);
        if (keySequence.length > dragonSequence.length) {
            keySequence.shift();
        }
        
        if (keySequence.join(',') === dragonSequence.join(',')) {
            await this.epicDragon.createEpicDragonAnimation();
            keySequence = [];
        }
    });

    // Enhanced Touch version for iPhone Chrome
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchCount = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        console.log('Touch start at Y:', touchStartY);
    }, { passive: true });

    document.addEventListener('touchend', async (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        const duration = Date.now() - touchStartTime;
        
        console.log('Touch end - Diff:', diff, 'Duration:', duration);
        
        // More lenient swipe detection for iPhone
        if (Math.abs(diff) > 30 && duration < 1000) {
            const direction = diff > 0 ? 'up' : 'down';
            touchSequence.push(direction);
            console.log('Touch sequence:', touchSequence);
            
            // Keep only last 6 gestures
            if (touchSequence.length > 6) {
                touchSequence.shift();
            }
            
            // Check for dragon sequence: up,up,down,down,up,down
            if (touchSequence.join(',') === 'up,up,down,down,up,down') {
                console.log('🐉 Dragon sequence detected! Activating...');
                await this.epicDragon.createEpicDragonAnimation();
                touchSequence = [];
            }
            
            // Reset sequence after 5 seconds of inactivity
            clearTimeout(this.touchResetTimeout);
            this.touchResetTimeout = setTimeout(() => {
                touchSequence = [];
                console.log('Touch sequence reset');
            }, 5000);
        }
    }, { passive: true });
    
    // Alternative: Triple tap to activate (easier for testing)
    let tapCount = 0;
    let lastTapTime = 0;
    
    document.addEventListener('touchend', async (e) => {
        const currentTime = Date.now();
        const timeSinceLastTap = currentTime - lastTapTime;
        
        if (timeSinceLastTap < 300) {
            tapCount++;
        } else {
            tapCount = 1;
        }
        
        lastTapTime = currentTime;
        
        // Triple tap anywhere to activate dragon (backup method)
        if (tapCount === 3) {
            console.log('🐉 Triple tap detected! Activating dragon...');
            await this.epicDragon.createEpicDragonAnimation();
            tapCount = 0;
        }
        
        // Reset tap count after 1 second
        setTimeout(() => {
            if (Date.now() - lastTapTime >= 1000) {
                tapCount = 0;
            }
        }, 1000);
    }, { passive: true });

    // iPhone Chrome specific: Add click on logo for easy activation
    const logoImg = document.querySelector('.logo-img');
    const logoText = document.querySelector('.logo-text');
    
    if (logoImg) {
        let logoClickCount = 0;
        logoImg.addEventListener('click', async (e) => {
            e.preventDefault();
            logoClickCount++;
            console.log('Logo clicked:', logoClickCount);
            
            if (logoClickCount >= 5) {
                console.log('🐉 Logo clicked 5 times! Activating dragon...');
                await this.epicDragon.createEpicDragonAnimation();
                logoClickCount = 0;
            }
            
            // Reset after 3 seconds
            setTimeout(() => {
                logoClickCount = 0;
            }, 3000);
        });
    }
    
    // Add click on dragon emoji in page title for activation
    document.addEventListener('click', async (e) => {
        if (e.target.textContent && e.target.textContent.includes('🐉')) {
            console.log('🐉 Dragon emoji clicked! Activating...');
            await this.epicDragon.createEpicDragonAnimation();
        }
    });

    // Add window resize handler for 3D dragon
    window.addEventListener('resize', () => {
        if (this.epicDragon && this.epicDragon.dragon3D) {
            this.epicDragon.dragon3D.onWindowResize();
        }
    });
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

// Custom Dropdown Functionality
let dropdownState = {
    isOpen: false,
    selectedValue: '',
    selectedText: ''
};

// Toggle dropdown menu
function toggleDropdown() {
    const dropdownSelected = document.querySelector('.dropdown-selected');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    dropdownState.isOpen = !dropdownState.isOpen;
    
    if (dropdownState.isOpen) {
        dropdownSelected.classList.add('active');
        dropdownMenu.classList.add('active');
        document.addEventListener('click', closeDropdownOutside);
    } else {
        dropdownSelected.classList.remove('active');
        dropdownMenu.classList.remove('active');
        document.removeEventListener('click', closeDropdownOutside);
    }
}

// Close dropdown when clicking outside
function closeDropdownOutside(event) {
    const dropdown = document.getElementById('programDropdown');
    
    if (!dropdown.contains(event.target)) {
        closeDropdown();
    }
}

// Close dropdown
function closeDropdown() {
    const dropdownSelected = document.querySelector('.dropdown-selected');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    dropdownState.isOpen = false;
    dropdownSelected.classList.remove('active');
    dropdownMenu.classList.remove('active');
    document.removeEventListener('click', closeDropdownOutside);
}

// Handle submenu item selection
function selectSubmenuItem(event, value, text) {
    console.log('selectSubmenuItem called with:', { value, text });
    event.preventDefault();
    event.stopPropagation();
    
    // Update selected value and text
    dropdownState.selectedValue = value;
    dropdownState.selectedText = text;
    
    // Update UI
    const selectedTextElement = document.querySelector('.selected-text');
    const hiddenInput = document.getElementById('selectedProgram');
    
    console.log('Updating UI elements:', { selectedTextElement, hiddenInput });
    
    if (selectedTextElement) {
        selectedTextElement.textContent = text;
        selectedTextElement.classList.remove('placeholder');
    }
    
    if (hiddenInput) {
        hiddenInput.value = value;
    }
    
    // Close dropdown
    closeDropdown();
    
    // Add visual feedback
    const dropdownSelected = document.querySelector('.dropdown-selected');
    dropdownSelected.style.borderColor = '#28a745';
    dropdownSelected.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
    
    setTimeout(() => {
        dropdownSelected.style.borderColor = '';
        dropdownSelected.style.boxShadow = '';
    }, 2000);
}

// Initialize dropdown functionality
function initializeDropdown() {
    const submenuItems = document.querySelectorAll('.submenu-item');
    console.log('Found submenu items:', submenuItems.length);
    
    submenuItems.forEach((item, index) => {
        console.log(`Binding event to submenu item ${index}:`, item.textContent.trim());
        item.addEventListener('click', function(event) {
            console.log('Submenu item clicked:', this.textContent.trim());
            event.preventDefault();
            event.stopPropagation();
            
            const value = this.getAttribute('data-value');
            const text = this.textContent.trim();
            selectSubmenuItem(event, value, text);
        });
    });
    
    // Prevent dropdown from closing when clicking on dropdown items (but not submenu)
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(event) {
            // Only prevent default if not clicking on submenu
            if (!event.target.classList.contains('submenu-item')) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    });
    
    // Handle mobile interactions
    function handleMobileDropdown() {
        // Remove existing mobile event listeners
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        
        dropdownItems.forEach(item => {
            const submenu = item.querySelector('.submenu');
            if (!submenu) return;
            
            // Remove any existing mobile click handlers
            const clonedItem = item.cloneNode(true);
            item.parentNode.replaceChild(clonedItem, item);
        });
        
        // Re-bind submenu item clicks
        const submenuItems = document.querySelectorAll('.submenu-item');
        submenuItems.forEach((item, index) => {
            item.addEventListener('click', function(event) {
                console.log('Submenu item clicked:', this.textContent.trim());
                event.preventDefault();
                event.stopPropagation();
                
                const value = this.getAttribute('data-value');
                const text = this.textContent.trim();
                selectSubmenuItem(event, value, text);
            });
        });
        
        // Add mobile click handlers for dropdown items
        const newDropdownItems = document.querySelectorAll('.dropdown-item');
        newDropdownItems.forEach(item => {
            const submenu = item.querySelector('.submenu');
            if (!submenu) return;
            
            // For mobile, use click to toggle submenu
            if (window.innerWidth <= 768) {
                item.addEventListener('click', function(event) {
                    console.log('Mobile dropdown item clicked:', this.querySelector('.category-title').textContent);
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // Close other submenus
                    newDropdownItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherSubmenu = otherItem.querySelector('.submenu');
                            if (otherSubmenu) {
                                otherSubmenu.style.maxHeight = '0px';
                                otherSubmenu.style.opacity = '0';
                                otherSubmenu.style.visibility = 'hidden';
                                otherItem.classList.remove('active');
                            }
                        }
                    });
                    
                    // Toggle current submenu
                    const isOpen = item.classList.contains('active');
                    if (isOpen) {
                        submenu.style.maxHeight = '0px';
                        submenu.style.opacity = '0';
                        submenu.style.visibility = 'hidden';
                        item.classList.remove('active');
                        console.log('Submenu closed');
                    } else {
                        submenu.style.maxHeight = '250px';
                        submenu.style.opacity = '1';
                        submenu.style.visibility = 'visible';
                        item.classList.add('active');
                        console.log('Submenu opened');
                    }
                });
            }
        });
    }
    
    // Call mobile handler
    handleMobileDropdown();
    
    // Re-bind on window resize
    window.addEventListener('resize', function() {
        setTimeout(handleMobileDropdown, 100);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (dropdownState.isOpen) {
            if (event.key === 'Escape') {
                closeDropdown();
            }
        }
    });
}

// Initialize dropdown when DOM is ready
function setupDropdown() {
    // Wait a bit to ensure DOM is fully rendered
    setTimeout(() => {
        initializeDropdown();
        
        // Force mobile setup if on mobile device
        if (window.innerWidth <= 768) {
            console.log('Mobile device detected, setting up mobile dropdown');
            setTimeout(handleMobileDropdown, 200);
        }
        
        console.log('Dropdown initialized successfully');
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDropdown);
} else {
    setupDropdown();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteOptimizer();
});