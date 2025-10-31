// --- Mobile nav toggle ---
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
hamburger && hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('show');
});

// --- Intersection Observer for reveal animations ---
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target); // stop observing after visible
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// --- Smooth scroll for internal nav links ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// --- Subtle parallax background move (desktop only) ---
if (window.matchMedia('(pointer:fine)').matches) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    document.body.style.backgroundPosition = `${50 - x}% ${50 - y}%`;
  });
}

// --- Instagram icon click effect ---
const instaLink = document.getElementById("insta-link");
if (instaLink) {
  instaLink.addEventListener("click", () => {
    instaLink.classList.toggle("active");
  });
}

// --- Navigation active link highlight ---
const navLinks = document.querySelectorAll(".nav a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});
