const giftScreen = document.querySelector('#giftScreen');
const reveal = document.querySelector('#reveal');
const giftButton = document.querySelector('#giftButton');

function openGift() {
  giftScreen.classList.add('open');
  window.setTimeout(() => {
    giftScreen.classList.add('is-hidden');
    reveal.classList.remove('is-hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1050);
}

giftButton.addEventListener('click', openGift);
