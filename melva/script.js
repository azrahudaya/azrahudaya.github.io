const screens = {
  intro: document.querySelector('#intro'),
  countdown: document.querySelector('#countdown'),
  gift: document.querySelector('#giftStage'),
  message: document.querySelector('#message')
};
const number = document.querySelector('#countNumber');
const caption = document.querySelector('#countCaption');
const start = document.querySelector('#startButton');
const giftButton = document.querySelector('#giftButton');
const replay = document.querySelector('#replayButton');
const tapHint = document.querySelector('#tapHint');
let timers = [];

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}
function show(name) {
  Object.values(screens).forEach(screen => screen.classList.add('is-hidden'));
  screens[name].classList.remove('is-hidden');
}
function later(callback, delay) {
  const timer = setTimeout(callback, delay);
  timers.push(timer);
}
function begin() {
  clearTimers();
  show('countdown');
  const beats = [
    ['3', 'tarik napas dulu'],
    ['2', 'siapkan senyum'],
    ['1', 'satu kejutan kecil']
  ];
  beats.forEach(([value, text], index) => {
    later(() => {
      number.textContent = value;
      caption.textContent = text;
      number.style.animation = 'none';
      void number.offsetWidth;
      number.style.animation = '';
    }, index * 1050);
  });
  later(() => show('gift'), beats.length * 1050 + 330);
}
function openGift() {
  screens.gift.classList.add('open');
  tapHint.textContent = 'tunggu... ada suratnya';
  later(() => show('message'), 1250);
}
function reset() {
  clearTimers();
  screens.gift.classList.remove('open');
  tapHint.textContent = 'tekan kadonya pelan-pelan';
  show('intro');
}
start.addEventListener('click', begin);
giftButton.addEventListener('click', openGift);
replay.addEventListener('click', reset);
