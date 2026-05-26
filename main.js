const toggleBtn = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

function setOpen(open) {
  mobileMenu.classList.toggle("is-open", open);
  toggleBtn.setAttribute("aria-expanded", String(open));
  toggleBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
}

if (toggleBtn && mobileMenu) {
  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const open = mobileMenu.classList.contains("is-open");
    setOpen(!open);
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("click", (e) => {
    const inside = mobileMenu.contains(e.target) || toggleBtn.contains(e.target);
    if (!inside) setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) setOpen(false);
  });
}
const el = document.getElementById("typewriter");

if (el) {
  const text =
    "Ensemble, créons des stratégies digitales qui renforcent votre présence en ligne, " +
    "captivent votre audience et stimulent votre croissance avec des approches adaptées et efficaces.";

  let i = 0;
  const speed = 18; // vitesse (ms) : 14 rapide, 22 plus lent

  function type() {
    el.textContent = text.slice(0, i);
    i++;

    if (i <= text.length) {
      setTimeout(type, speed);
    }
  }

  type();
}


let index = 0;
const slides = document.querySelector('.slides');
const totalSlides = document.querySelectorAll('.slide').length;

document.getElementById("next").addEventListener("click", () => {
  index = (index + 1) % totalSlides;
  updateSlide();
});

document.getElementById("prev").addEventListener("click", () => {
  index = (index - 1 + totalSlides) % totalSlides;
  updateSlide();
});

function updateSlide(){
  slides.style.transform = `translateX(-${index * 100}%)`;
}


const cards = document.querySelectorAll(".skill-card");

cards.forEach(card => {

card.addEventListener("mousemove", (e) => {

const rect = card.getBoundingClientRect();

const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

const centerX = rect.width / 2;
const centerY = rect.height / 2;

const rotateX = ((y - centerY) / centerY) * 8;
const rotateY = ((x - centerX) / centerX) * -8;

card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

});

card.addEventListener("mouseleave", () => {

card.style.transform = "rotateX(0) rotateY(0)";

});

});

const track = document.querySelector('.track');

// dupliquer le contenu pour boucle fluide
track.innerHTML += track.innerHTML;

// ===== TRAJET NÉON =====
function setupBtnTrace() {
  document.querySelectorAll('.btn').forEach(btn => {
    const svg  = btn.querySelector('.btn-trace');
    const rect = btn.querySelector('.btn-trace-rect');
    if (!svg || !rect) return;

    const W = btn.offsetWidth;
    const H = btn.offsetHeight;
    const inset = 1.5;          // demi-épaisseur du stroke pour rester dans la forme
    const w = W - inset * 2;
    const h = H - inset * 2;
    const r = h / 2;            // pill : rayon = moitié de la hauteur

    // Dimensionner le SVG exactement sur le bouton
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);

    // Aligner le rect exactement sur le contour du bouton
    rect.setAttribute('x',      inset);
    rect.setAttribute('y',      inset);
    rect.setAttribute('width',  w);
    rect.setAttribute('height', h);
    rect.setAttribute('rx',     r);
    rect.setAttribute('ry',     r);

    // Périmètre exact d'un rectangle arrondi pilule
    const perimeter = 2 * (w - h) + Math.PI * h;
    const dashLen   = Math.round(perimeter * 0.18); // arc ~18% = la "lumière"
    const gap       = perimeter - dashLen;

    rect.style.setProperty('--perimeter', perimeter + 'px');
    rect.setAttribute('stroke-dasharray',  `${dashLen} ${gap}`);
    rect.setAttribute('stroke-dashoffset', '0');
  });
}

document.addEventListener('DOMContentLoaded', setupBtnTrace);
window.addEventListener('resize', setupBtnTrace);