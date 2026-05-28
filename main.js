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

function pauseAllVideos() {
  document.querySelectorAll('.carousel video').forEach(v => {
    v.pause();
    v.currentTime = 0;
  });
}

function updateSlide(){
  pauseAllVideos();
  slides.style.transform = `translateX(-${index * 100}%)`;
  positionButtonsMobile();
}

document.querySelectorAll('.carousel video').forEach(video => {
  video.addEventListener('play', () => {
    document.querySelectorAll('.carousel video').forEach(v => {
      if (v !== video) { v.pause(); v.currentTime = 0; }
    });
  });
});

function addSwipeToCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  let touchStartX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) < 50) return;
    if (delta > 0) {
      index = (index + 1) % totalSlides;
    } else {
      index = (index - 1 + totalSlides) % totalSlides;
    }
    updateSlide();
  }, { passive: true });
}

addSwipeToCarousel();

function setupVideoPlayers() {
  document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    const video = wrapper.querySelector('video');
    if (!video) return;

    video.removeAttribute('controls');
    video.style.pointerEvents = 'none';

    // Génère la miniature depuis une frame de la vidéo
    let posterCaptured = false;
    const captureFrame = () => {
      if (posterCaptured || video.currentTime < 0.1) return;
      posterCaptured = true;
      const c = document.createElement('canvas');
      c.width = video.videoWidth || 640;
      c.height = video.videoHeight || 360;
      c.getContext('2d').drawImage(video, 0, 0, c.width, c.height);
      try { video.poster = c.toDataURL('image/jpeg', 0.85); } catch(e) {}
      video.removeEventListener('seeked', captureFrame);
      video.currentTime = 0;
    };
    video.addEventListener('seeked', captureFrame);
    video.preload = 'metadata';
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = 0.5;
    }, { once: true });

    // Overlay avec icône centrale + barre de contrôles en bas
    const overlay = document.createElement('div');
    overlay.className = 'video-overlay paused';
    overlay.innerHTML = `
      <div class="video-play-icon">
        <svg viewBox="0 0 24 24" fill="white" width="40" height="40">
          <path class="icon-path" d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <div class="video-controls-bar">
        <button class="video-skip skip-back">−10</button>
        <input type="range" class="video-seek" min="0" max="100" value="0" step="0.1">
        <button class="video-skip skip-fwd">+10</button>
        <span class="video-time">0:00</span>
      </div>`;
    wrapper.appendChild(overlay);

    const iconPath  = overlay.querySelector('.icon-path');
    const seekBar   = overlay.querySelector('.video-seek');
    const timeLbl   = overlay.querySelector('.video-time');
    const skipBack  = overlay.querySelector('.skip-back');
    const skipFwd   = overlay.querySelector('.skip-fwd');
    const PLAY_D   = 'M8 5v14l11-7z';
    const PAUSE_D  = 'M6 19h4V5H6v14zm8-14v14h4V5h-4z';
    let hideTimer  = null;

    function fmtTime(s) {
      const m   = Math.floor(s / 60);
      const sec = Math.floor(s % 60).toString().padStart(2, '0');
      return `${m}:${sec}`;
    }

    function showControls() {
      overlay.classList.remove('controls-hidden');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!video.paused) overlay.classList.add('controls-hidden');
      }, 3000);
    }

    function setPaused() {
      overlay.classList.remove('playing', 'controls-hidden');
      overlay.classList.add('paused');
      iconPath.setAttribute('d', PLAY_D);
      clearTimeout(hideTimer);
    }

    function setPlaying() {
      overlay.classList.remove('paused');
      overlay.classList.add('playing');
      iconPath.setAttribute('d', PAUSE_D);
      showControls();
    }

    // Logique 3 états (partagée entre clic souris et tap mobile)
    const handleTap = () => {
      if (video.paused) {
        video.play().catch(() => {});
      } else if (!overlay.classList.contains('controls-hidden')) {
        clearTimeout(hideTimer);
        overlay.classList.add('controls-hidden');
      } else {
        video.pause();
      }
    };

    // Desktop : clic souris normal
    overlay.addEventListener('click', handleTap);

    // Mobile : simple tap → handleTap, double tap gauche/droite → ±10 s
    let tapTimer    = null;
    let lastTapTime = 0;
    let lastTapSide = null;

    overlay.addEventListener('touchend', (e) => {
      // Laisser les contrôles du bas gérer leurs propres touches
      if (e.target.closest('.video-controls-bar')) return;
      e.preventDefault(); // empêche le clic synthétique

      const now   = Date.now();
      const touch = e.changedTouches[0];
      const rect  = overlay.getBoundingClientRect();
      const side  = touch.clientX > rect.left + rect.width / 2 ? 'right' : 'left';

      if (now - lastTapTime < 300 && lastTapSide === side) {
        // Double tap → ±10 s
        clearTimeout(tapTimer);
        lastTapTime = 0;
        video.currentTime = side === 'right'
          ? Math.min(video.duration || 0, video.currentTime + 10)
          : Math.max(0, video.currentTime - 10);
        showControls();
      } else {
        // Premier tap : attendre de voir si un second suit
        lastTapTime = now;
        lastTapSide = side;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => {
          handleTap();
          lastTapTime = 0;
        }, 300);
      }
    }, { passive: false });

    // Survol souris (desktop) : afficher/cacher les contrôles
    overlay.addEventListener('mouseenter', () => {
      if (!video.paused) {
        clearTimeout(hideTimer);
        overlay.classList.remove('controls-hidden');
      }
    });
    overlay.addEventListener('mouseleave', () => {
      if (!video.paused) overlay.classList.add('controls-hidden');
    });

    // Boutons −10 / +10
    skipBack.addEventListener('click', (e) => {
      e.stopPropagation();
      video.currentTime = Math.max(0, video.currentTime - 10);
      showControls();
    });
    skipFwd.addEventListener('click', (e) => {
      e.stopPropagation();
      video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
      showControls();
    });

    // Barre de progression : seek sans déclencher le clic overlay
    seekBar.addEventListener('click', (e) => e.stopPropagation());
    seekBar.addEventListener('input', (e) => {
      e.stopPropagation();
      if (video.duration) {
        video.currentTime = (seekBar.value / 100) * video.duration;
      }
      showControls();
    });

    // Mise à jour de la barre et du chrono en cours de lecture
    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      seekBar.value = (video.currentTime / video.duration) * 100;
      timeLbl.textContent = fmtTime(video.currentTime);
    });

    video.addEventListener('play',  setPlaying);
    video.addEventListener('pause', setPaused);
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      setPaused();
    });
  });
}

setupVideoPlayers();

function positionButtonsMobile() {
  const buttons = document.querySelector('.buttons');
  const carousel = document.querySelector('.carousel');
  if (!buttons || !carousel) return;

  if (window.innerWidth > 768) {
    buttons.style.top = '';
    buttons.style.transform = '';
    return;
  }

  const allSlides = document.querySelectorAll('.slide');
  const currentSlide = allSlides[index];
  if (!currentSlide) return;

  const media = currentSlide.querySelector('img, video');
  if (!media) return;

  const mediaRect = media.getBoundingClientRect();
  if (mediaRect.height === 0) {
    media.addEventListener('load', positionButtonsMobile, { once: true });
    media.addEventListener('loadedmetadata', positionButtonsMobile, { once: true });
    return;
  }

  const carouselRect = carousel.getBoundingClientRect();
  const mediaTopInCarousel = mediaRect.top - carouselRect.top;
  buttons.style.top = (mediaTopInCarousel + mediaRect.height / 2) + 'px';
  buttons.style.transform = 'translateY(-50%)';
}

window.addEventListener('load', positionButtonsMobile);
window.addEventListener('resize', positionButtonsMobile);


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