const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const whatsappFloat = document.querySelector('.whatsapp-float');
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const bookingDate = document.getElementById('bookingDate');
const faqToggle = document.getElementById('faqToggle');
const faqList = document.getElementById('faqList');
const slides = [...document.querySelectorAll('.slide')];
const dotsWrap = document.getElementById('carouselDots');
const prev = document.getElementById('prevSlide');
const next = document.getElementById('nextSlide');
const progress = document.getElementById('carouselProgress');
const carousel = document.querySelector('.hero-carousel');
const carouselToggle = document.getElementById('carouselToggle');
let active = 0;
let userPaused = false;
let timer;
const delay = 5000;

function onScroll(){
  header.classList.toggle('scrolled', window.scrollY > 28);
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();
setTimeout(() => whatsappFloat.classList.add('is-collapsed'), 5000);

function formatLocalDate(date){
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
bookingDate.min = formatLocalDate(new Date());

faqToggle.addEventListener('click', () => {
  const isExpanded = faqToggle.getAttribute('aria-expanded') === 'true';
  faqToggle.setAttribute('aria-expanded', String(!isExpanded));
  faqToggle.textContent = isExpanded ? 'Show FAQs' : 'Hide FAQs';
  faqList.hidden = isExpanded;
});

menuToggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i, true));
  dotsWrap.appendChild(dot);
});
const dots = [...dotsWrap.querySelectorAll('button')];

function restartProgress(){
  progress.classList.remove('run', 'paused');
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
  if(userPaused){
    progress.classList.add('paused');
    return;
  }
  restartProgress();
  timer = setInterval(() => goTo(active + 1), delay);
}
function pauseAuto(){
  clearInterval(timer);
  progress.classList.add('paused');
}
function updateCarouselToggle(){
  carouselToggle.textContent = userPaused ? 'Play' : 'Pause';
  carouselToggle.setAttribute('aria-label', userPaused ? 'Play carousel' : 'Pause carousel');
  carouselToggle.setAttribute('aria-pressed', String(userPaused));
}
prev.addEventListener('click', () => goTo(active - 1, true));
next.addEventListener('click', () => goTo(active + 1, true));
carouselToggle.addEventListener('click', () => {
  userPaused = !userPaused;
  if(userPaused) pauseAuto();
  else startAuto();
  updateCarouselToggle();
});
carousel.addEventListener('mouseenter', pauseAuto);
carousel.addEventListener('mouseleave', startAuto);
carousel.addEventListener('focusin', pauseAuto);
carousel.addEventListener('focusout', startAuto);
dots[0].classList.add('active');
updateCarouselToggle();
startAuto();

let touchStartX = 0;
carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, {passive:true});
carousel.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if(Math.abs(delta) > 45) goTo(active + (delta < 0 ? 1 : -1), true);
}, {passive:true});

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const booking = new FormData(contactForm);
  const bookingDay = new Date(`${booking.get('date')}T00:00:00`);
  const dateLabel = bookingDay.toLocaleDateString(undefined, {year:'numeric', month:'long', day:'numeric'});
  const guests = Number(booking.get('people'));
  formNote.textContent = `Thanks, ${booking.get('name')}! Your enquiry is for ${booking.get('activity')} on ${dateLabel} for ${guests} ${guests === 1 ? 'person' : 'people'}. This demo form does not send or save bookings yet. Please contact us on WhatsApp to confirm.`;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
}, {threshold:.14});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// Activities category filters
const activityFilters = [...document.querySelectorAll('.activity-filter')];
const activityCards = [...document.querySelectorAll('.activity-card')];

activityFilters.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    activityFilters.forEach(item => item.classList.toggle('active', item === button));
    activityCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !show);
    });
  });
});
