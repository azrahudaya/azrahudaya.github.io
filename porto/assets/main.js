gsap.registerPlugin(ScrollTrigger);

/* smooth scroll + progress bar */
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

/* cursor */
const cDot  = document.getElementById('cDot');
const cRing = document.getElementById('cRing');

if (matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    gsap.to(cDot,  { x: e.clientX, y: e.clientY, duration: 0.06, overwrite: true });
    gsap.to(cRing, { x: e.clientX, y: e.clientY, duration: 0.38, overwrite: true });
  });

  document.querySelectorAll('.frame-card, a').forEach(el => {
    el.addEventListener('mouseenter', () =>
      gsap.to(cRing, { scale: 2.2, opacity: 0.15, duration: 0.3 }));
    el.addEventListener('mouseleave', () =>
      gsap.to(cRing, { scale: 1, opacity: 0.3, duration: 0.3 }));
  });
}

/* scroll reveal for gallery cards */
function initScrollTriggers() {
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
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* preloader */
const preloader = document.getElementById('preloader');
const preFill   = document.querySelector('.pre-fill');

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
        initScrollTriggers();
      },
    });
  },
});
