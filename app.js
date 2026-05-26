// Three.js 3D Scene Setup
let scene, camera, renderer, aircraft, particles, globe;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

// Initialize the 3D scene
function init() {
    const canvas = document.getElementById('webgl-canvas');
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create 3D elements
    createAircraft();
    createParticles();
    createStars();
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00a8e8, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x0066cc, 0.8);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);
    
    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        startCounterAnimation();
    }, 2000);
    
    // Start animation loop
    animate();
}

// Create stylized aircraft model
function createAircraft() {
    aircraft = new THREE.Group();
    
    // Fuselage
    const fuselageGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 32);
    const fuselageMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00a8e8,
        specular: 0x0066cc,
        shininess: 100,
        transparent: true,
        opacity: 0.9
    });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.rotation.x = Math.PI / 2;
    aircraft.add(fuselage);
    
    // Nose cone
    const noseGeometry = new THREE.ConeGeometry(0.3, 0.8, 32);
    const noseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00a8e8,
        specular: 0x0066cc,
        shininess: 100,
        transparent: true,
        opacity: 0.9
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = 1.9;
    aircraft.add(nose);
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(3, 0.05, 0.8);
    const wingMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x0066cc,
        specular: 0x00a8e8,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.z = 0.2;
    aircraft.add(wings);
    
    // Tail fin
    const tailGeometry = new THREE.BoxGeometry(0.05, 0.8, 0.5);
    const tailMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x0066cc,
        specular: 0x00a8e8,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(0, 0.4, -1.2);
    aircraft.add(tail);
    
    // Engine nacelles
    const engineGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
    const engineMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x003366,
        specular: 0x0066cc,
        shininess: 100
    });
    
    const engine1 = new THREE.Mesh(engineGeometry, engineMaterial);
    engine1.rotation.x = Math.PI / 2;
    engine1.position.set(1, -0.3, 0.5);
    aircraft.add(engine1);
    
    const engine2 = new THREE.Mesh(engineGeometry, engineMaterial);
    engine2.rotation.x = Math.PI / 2;
    engine2.position.set(-1, -0.3, 0.5);
    aircraft.add(engine2);
    
    scene.add(aircraft);
    aircraft.position.x = 2;
    aircraft.rotation.y = -0.3;
}

// Create floating particles
function createParticles() {
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
        
        const colorType = Math.random();
        if (colorType > 0.6) {
            // Blue
            colors[i] = 0;
            colors[i + 1] = 0.4;
            colors[i + 2] = 0.8;
        } else if (colorType > 0.3) {
            // Cyan
            colors[i] = 0;
            colors[i + 1] = 0.66;
            colors[i + 2] = 0.91;
        } else {
            // White
            colors[i] = 1;
            colors[i + 1] = 1;
            colors[i + 2] = 1;
        }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({ 
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Create star field
function createStars() {
    const starCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({ 
        size: 0.1,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
    });
    
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

// Mouse move handler
function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth mouse follow
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;
    
    // Animate aircraft
    if (aircraft) {
        aircraft.rotation.x += 0.001;
        aircraft.rotation.y += 0.002;
        aircraft.position.y = Math.sin(Date.now() * 0.001) * 0.3;
        aircraft.rotation.z = targetX * 0.1;
        aircraft.rotation.x += targetY * 0.1;
    }
    
    // Animate particles
    if (particles) {
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
    }
    
    // Update renderer
    renderer.render(scene, camera);
}

// Counter animation for stats
function startCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Navigation scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you shortly.');
        contactForm.reset();
    });
}

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

document.querySelectorAll('.fleet-card, .service-card').forEach(el => {
    observer.observe(el);
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
