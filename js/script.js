/* ── CURSOR ──────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .tech-item, .project-card, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
    });
});

/* ── HEADER SCROLL ───────────────────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── MOBILE MENU ─────────────────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const menuNav = document.getElementById('menuNav');

menuToggle?.addEventListener('click', () => {
    const isOpen = menuNav.classList.toggle('show');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* ── NAV LINKS ───────────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
        // close mobile
        menuNav.classList.remove('show');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

/* ── ACTIVE NAV ON SCROLL ────────────────────────────────── */
const sections = document.querySelectorAll('main section[id]');

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(l => {
                l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`);
            });
        }
    });
}, { threshold: 0.35, rootMargin: '-60px 0px -40% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
const reveals = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, parseInt(delay));
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

/* ── TECH BARS (trigger when wrapper revealed) ───────────── */
const techWrapper = document.querySelector('.tech-wrapper');
if (techWrapper) {
    const techObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                techObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    techObserver.observe(techWrapper);
}

/* ── PROJECT CARDS STAGGER ───────────────────────────────── */
document.querySelectorAll('.project-card').forEach((card, i) => {
    card.setAttribute('data-reveal', '');
    card.setAttribute('data-delay', i * 100 + 150);
    revealObserver.observe(card);
});

/* ── PARALLAX subtle on hero ────────────────────────────── */
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const photo = document.querySelector('.photo-frame');
        if (photo && y < window.innerHeight) {
            photo.style.transform = `translateY(${y * 0.06}px)`;
        }
    }, { passive: true });
}