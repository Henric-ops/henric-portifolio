
const header = document.getElementById("header");
window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  },
  { passive: true },
);

/* ── MOBILE MENU ─────────────────────────────────────────── */
const menuToggle = document.getElementById("menuToggle");
const menuNav = document.getElementById("menuNav");

menuToggle?.addEventListener("click", () => {
  const isOpen = menuNav.classList.toggle("show");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
});

/* ── NAV LINKS ───────────────────────────────────────────── */
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      const offset =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-h",
          ),
        ) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    // close mobile
    menuNav.classList.remove("show");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

/* ── ACTIVE NAV ON SCROLL ────────────────────────────────── */
const sections = document.querySelectorAll("main section[id]");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => {
          l.classList.toggle(
            "active",
            l.getAttribute("href") === `#${entry.target.id}`,
          );
        });
      }
    });
  },
  { threshold: 0.35, rootMargin: "-60px 0px -40% 0px" },
);

sections.forEach((s) => navObserver.observe(s));

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
const reveals = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add("revealed");
          // se tiver nome para animar, dispare a animação letra-a-letra
            if (entry.target.querySelector && entry.target.querySelector('#typed-first')) {
              animateName();
            }
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

reveals.forEach((el) => revealObserver.observe(el));

/* ── TECH BARS (trigger when wrapper revealed) ───────────── */
const techWrapper = document.querySelector(".tech-wrapper");
if (techWrapper) {
  const techObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          techObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );
  techObserver.observe(techWrapper);
}

/* ── PROJECT CARDS STAGGER ───────────────────────────────── */
document.querySelectorAll(".project-card").forEach((card, i) => {
  card.setAttribute("data-reveal", "");
  card.setAttribute("data-delay", i * 80 + 120);
  revealObserver.observe(card);
});

/* Animação letra-a-letra para o nome */
function animateName() {
  const first = document.getElementById('typed-first');
  const last = document.getElementById('typed-last');
  if ((!first && !last) || (first && first.dataset.animated)) return;

  const firstText = first ? first.dataset.text || first.textContent.trim() : '';
  const lastText = last ? last.dataset.text || last.textContent.trim() : '';

  if (first) first.textContent = '';
  if (last) last.textContent = '';

  const allChars = [];

  firstText.split('').forEach(ch => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch;
    if (first) first.appendChild(span);
    allChars.push(span);
  });

  const pause = allChars.length * 60 + 120;
  lastText.split('').forEach((ch, index) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch;
    if (last) last.appendChild(span);
    allChars.push(span);
    setTimeout(() => span.classList.add('show'), pause + index * 60);
  });

  allChars.slice(0, firstText.length).forEach((c, i) => setTimeout(() => c.classList.add('show'), i * 60));

  if (first) first.dataset.animated = '1';
}
    
