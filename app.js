/* -------------------------------------------------------------
   NEURAL NETWORK CANVAS BACKGROUND
   ------------------------------------------------------------- */
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = window.innerWidth < 768 ? 40 : 100;
const connectionDistance = 120;
let mouse = { x: null, y: null, radius: 180 };

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track mouse
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse attraction/push sutil
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
        ctx.fill();
    }
}

// Initialise particles
function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
initParticles();

// Render loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                let opacity = (1 - (dist / connectionDistance)) * 0.15;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }

        // Connect to mouse
        if (mouse.x != null) {
            let dx = particles[i].x - mouse.x;
            let dy = particles[i].y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                let opacity = (1 - (dist / mouse.radius)) * 0.25;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(138, 43, 226, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}
animate();


/* -------------------------------------------------------------
   CUSTOM CURSOR LAG GLOW
   ------------------------------------------------------------- */
const glow = document.getElementById('cursor-glow');
let glowX = 0;
let glowY = 0;
let targetX = 0;
let targetY = 0;

window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

function updateGlowPosition() {
    // Lerp (Linear Interpolation) for smooth trailing
    glowX += (targetX - glowX) * 0.08;
    glowY += (targetY - glowY) * 0.08;

    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;

    requestAnimationFrame(updateGlowPosition);
}
updateGlowPosition();


/* -------------------------------------------------------------
   TYPING EFFECT FOR HERO SUBTITLE
   ------------------------------------------------------------- */
const typingText = document.getElementById('typing-text');
const titles = [
    "Desenvolvedor Web Fullstack Pleno",
    "Especialista em Node, Vue & C#",
    "Modelagem Avançada de Grafos (Neo4j)",
    "Focado em Escalabilidade e Performance"
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40; // delete faster
    } else {
        typingText.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80; // typing speed
    }

    if (!isDeleting && charIndex === currentTitle.length) {
        typeSpeed = 2000; // pause at peak
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500; // pause before next title
    }

    setTimeout(typeEffect, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 1000);
});


/* -------------------------------------------------------------
   SCROLL ANIMATIONS (INTERSECTION OBSERVER) & AOS INJECTION
   ------------------------------------------------------------- */
// Inject dynamic AOS CSS rules for fluid animations
const styleEl = document.createElement('style');
styleEl.innerHTML = `
    [data-aos] {
        opacity: 0;
        transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.8s ease;
    }
    [data-aos="fade-up"] { transform: translateY(30px); }
    [data-aos="fade-down"] { transform: translateY(-30px); }
    [data-aos="fade-left"] { transform: translateX(30px); }
    [data-aos="fade-right"] { transform: translateX(-30px); }
    [data-aos="zoom-in"] { transform: scale(0.95); }
    
    [data-aos].aos-animate {
        opacity: 1;
        transform: translate(0) scale(1);
    }
`;
document.head.appendChild(styleEl);

const aosElements = document.querySelectorAll('[data-aos]');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const aosObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

aosElements.forEach(element => {
    aosObserver.observe(element);
});


/* -------------------------------------------------------------
   MOBILE MENU TOGGLE
   ------------------------------------------------------------- */
const navToggle = document.getElementById('nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        
        // Simple toggle inline for simplicity or inject mobile active styles
        if (navLinksContainer.style.display === 'flex') {
            navLinksContainer.style.display = 'none';
        } else {
            navLinksContainer.style.display = 'flex';
            navLinksContainer.style.flexDirection = 'column';
            navLinksContainer.style.position = 'absolute';
            navLinksContainer.style.top = '70px';
            navLinksContainer.style.left = '0';
            navLinksContainer.style.width = '100%';
            navLinksContainer.style.background = 'rgba(7, 10, 19, 0.95)';
            navLinksContainer.style.padding = '2rem';
            navLinksContainer.style.borderBottom = '1px solid var(--border-color)';
        }
    });
}
