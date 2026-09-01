const giftScreen = document.querySelector('#giftScreen');
const reveal = document.querySelector('#reveal');
const giftButton = document.querySelector('#giftButton');
const claimButton = document.querySelector('#claimButton');
const photo = document.querySelector('.photo-frame');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function openGift() {
  giftScreen.classList.add('open');
  window.setTimeout(() => {
    giftScreen.classList.add('is-hidden');
    reveal.classList.remove('is-hidden');
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, 1050);
}

function movePhoto() {
  if (reduceMotion || !photo) return;
  const distance = photo.getBoundingClientRect().top - window.innerHeight / 2;
  const offset = Math.max(-34, Math.min(34, distance * -0.06));
  photo.style.setProperty('--parallax', `${offset}px`);
}

function resetGift() {
  document.body.classList.add('resetting');
  window.setTimeout(() => {
    reveal.classList.add('is-hidden');
    giftScreen.classList.remove('is-hidden', 'open');
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.setTimeout(() => document.body.classList.remove('resetting'), 100);
  }, 700);
}

giftButton.addEventListener('click', openGift);
claimButton.addEventListener('click', resetGift);
window.addEventListener('scroll', movePhoto, { passive: true });
window.addEventListener('resize', movePhoto);
movePhoto();
