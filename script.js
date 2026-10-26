const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const toTop = document.getElementById('toTop');
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const slides = [...document.querySelectorAll('.slide')];
const dotsWrap = document.getElementById('carouselDots');
const prev = document.getElementById('prevSlide');
const next = document.getElementById('nextSlide');
const progress = document.getElementById('carouselProgress');
const carousel = document.querySelector('.hero-carousel');
let active = 0;
let timer;
const delay = 5000;

function onScroll(){
  header.classList.toggle('scrolled', window.scrollY > 28);
  toTop.classList.toggle('show', window.scrollY > 520);
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

menuToggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i, true));
  dotsWrap.appendChild(dot);
});
const dots = [...dotsWrap.querySelectorAll('button')];

function restartProgress(){
  progress.classList.remove('run');
  void progress.offsetWidth;
  progress.classList.add('run');
}
function goTo(index, restart = false){
  slides[active].classList.remove('active');
  dots[active].classList.remove('active');
  active = (index + slides.length) % slides.length;
  slides[active].classList.add('active');
  dots[active].classList.add('active');
  restartProgress();
  if(restart) startAuto();
}
function startAuto(){
  clearInterval(timer);
  restartProgress();
  timer = setInterval(() => goTo(active + 1), delay);
}
function pauseAuto(){
  clearInterval(timer);
  progress.classList.add('paused');
}
prev.addEventListener('click', () => goTo(active - 1, true));
next.addEventListener('click', () => goTo(active + 1, true));
carousel.addEventListener('mouseenter', pauseAuto);
carousel.addEventListener('mouseleave', startAuto);
carousel.addEventListener('focusin', pauseAuto);
carousel.addEventListener('focusout', startAuto);
dots[0].classList.add('active');
startAuto();

let touchStartX = 0;
carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, {passive:true});
carousel.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if(Math.abs(delta) > 45) goTo(active + (delta < 0 ? 1 : -1), true);
}, {passive:true});

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  formNote.textContent = 'Thanks! The booking form is frontend-only for now. Backend/API integration can be connected later.';
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
}, {threshold:.14});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
