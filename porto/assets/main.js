gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════
   SMOOTH SCROLL
══════════════════════════════════ */
const lenis = new Lenis({
  duration: 1.45,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

const progressBar = document.getElementById('progress-bar');

lenis.on('scroll', ({ progress }) => {
  progressBar.style.transform = `scaleX(${progress})`;
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ══════════════════════════════════
   CURSOR
══════════════════════════════════ */
const cDot  = document.getElementById('cDot');
const cRing = document.getElementById('cRing');

if (matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    gsap.to(cDot,  { x: e.clientX, y: e.clientY, duration: 0.06, overwrite: true });
    gsap.to(cRing, { x: e.clientX, y: e.clientY, duration: 0.38, overwrite: true });
  });

  document.querySelectorAll('.frame-card, .btn, a').forEach(el => {
    el.addEventListener('mouseenter', () =>
      gsap.to(cRing, { scale: 2.2, opacity: 0.15, duration: 0.3 }));
    el.addEventListener('mouseleave', () =>
      gsap.to(cRing, { scale: 1, opacity: 0.3, duration: 0.3 }));
  });
}

/* ══════════════════════════════════
   HERO ENTRANCE
══════════════════════════════════ */
function startHero() {
  gsap.set(['#hCta', '#hScroll'], { opacity: 0, y: 12 });
  gsap.set(['#hW1', '#hW2'],      { y: '112%' });

  gsap.timeline()
    .to('#hW1',    { y: '0%',          duration: 1.0,  ease: 'power4.out' })
    .to('#hW2',    { y: '0%',          duration: 1.0,  ease: 'power4.out' }, '-=0.82')
    .to('#hCta',   { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.45')
    .to('#hScroll',{ opacity: 1, y: 0, duration: 0.6,  ease: 'power3.out' }, '-=0.4');
}

/* ══════════════════════════════════
   SCROLL TRIGGERS
══════════════════════════════════ */
function initScrollTriggers() {
  // Section title
  gsap.set('#sTitle', { y: '110%' });
  gsap.to('#sTitle', {
    y: '0%', duration: 1.1, ease: 'power4.out',
    scrollTrigger: { trigger: '.s-work__hd', start: 'top 88%' },
  });

  const cards = document.querySelectorAll('.frame-card');

  cards.forEach(card => {
    gsap.fromTo(card,
      { opacity: 0, y: 48 },
      {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Footer
  gsap.from('#footer', {
    opacity: 0, y: 30, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#footer', start: 'top 92%' },
  });
}

/* ══════════════════════════════════
   PRELOADER
══════════════════════════════════ */
const preloader = document.getElementById('preloader');
const preFill   = document.querySelector('.pre-fill');

// Progress bar → slide up → start hero
gsap.to(preFill, {
  scaleX: 1,
  duration: 1.7, ease: 'power2.inOut',
  delay: 0.2,
  onComplete() {
    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.88, ease: 'power4.inOut',
      delay: 0.1,
      onComplete() {
        preloader.style.display = 'none';
        startHero();
        initScrollTriggers();
      },
    });
  },
});
