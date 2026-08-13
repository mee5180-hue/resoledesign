(() => {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('.hero-track');
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const dots = [...carousel.querySelectorAll('[data-slide-to]')];
  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let autoplayId;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    track.style.transform = `translate3d(-${activeIndex * 100}%, 0, 0)`;
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', String(slideIndex !== activeIndex));
      slide.querySelectorAll('a, button').forEach((element) => {
        element.tabIndex = slideIndex === activeIndex ? 0 : -1;
      });
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  const stopAutoplay = () => window.clearInterval(autoplayId);
  const startAutoplay = () => {
    stopAutoplay();
    if (!reduceMotion.matches && slides.length > 1 && !document.hidden) {
      autoplayId = window.setInterval(() => showSlide(activeIndex + 1), 5000);
    }
  };

  prevButton?.addEventListener('click', () => { showSlide(activeIndex - 1); startAutoplay(); });
  nextButton?.addEventListener('click', () => { showSlide(activeIndex + 1); startAutoplay(); });
  dots.forEach((dot) => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.slideTo)); startAutoplay(); }));
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);
  document.addEventListener('visibilitychange', startAutoplay);
  reduceMotion.addEventListener?.('change', startAutoplay);

  showSlide(0);
  startAutoplay();
})();

(() => {
  const mainImage = document.getElementById('mainImage');
  const thumbs = [...document.querySelectorAll('.thumb-strip .thumb')];
  if (!mainImage || !thumbs.length) return;

  thumbs.forEach((thumb) => thumb.addEventListener('click', () => {
    thumbs.forEach((item) => item.classList.remove('active'));
    thumb.classList.add('active');
    mainImage.src = thumb.dataset.image;
    mainImage.alt = thumb.querySelector('img')?.alt || mainImage.alt;
  }));
})();

(() => {
  const optionSelect = document.getElementById('optionSelect');
  const qtyInput = document.getElementById('qtyInput');
  const totalPrice = document.getElementById('totalPrice');
  const minusButton = document.getElementById('minusBtn');
  const plusButton = document.getElementById('plusBtn');
  if (!optionSelect || !qtyInput || !totalPrice) return;

  const fallbackPrices = { '1': 21900, '2': 39800 };
  const updatePrice = () => {
    const quantity = Math.max(1, Number.parseInt(qtyInput.value || '1', 10));
    const selectedOption = optionSelect.options[optionSelect.selectedIndex];
    const unitPrice = Number(selectedOption.dataset.price || fallbackPrices[optionSelect.value]);
    qtyInput.value = quantity;
    totalPrice.textContent = `${new Intl.NumberFormat('ko-KR').format(unitPrice * quantity)}원`;
  };

  minusButton?.addEventListener('click', () => { qtyInput.value = Math.max(1, Number(qtyInput.value) - 1); updatePrice(); });
  plusButton?.addEventListener('click', () => { qtyInput.value = Math.max(1, Number(qtyInput.value) + 1); updatePrice(); });
  optionSelect.addEventListener('change', updatePrice);
  qtyInput.addEventListener('change', updatePrice);
  updatePrice();
})();

(() => {
  const detailFrame = document.querySelector('[data-detail-frame]');
  if (!detailFrame) return;

  const resizeFrame = () => {
    try {
      const documentElement = detailFrame.contentDocument?.documentElement;
      const body = detailFrame.contentDocument?.body;
      if (!documentElement || !body) return;
      const frameScale = Number.parseFloat(getComputedStyle(body).zoom) || 1;
      detailFrame.style.height = '1px';
      detailFrame.style.height = `${Math.ceil(Math.max(documentElement.scrollHeight, body.scrollHeight) * frameScale)}px`;
    } catch (_) {
      detailFrame.style.height = '2000px';
    }
  };

  detailFrame.addEventListener('load', () => {
    resizeFrame();
    window.setTimeout(resizeFrame, 500);
    window.setTimeout(resizeFrame, 1500);
  });
  window.addEventListener('load', resizeFrame);
  window.addEventListener('resize', resizeFrame);
})();

document.querySelectorAll('video').forEach((video) => {
  video.muted = true;
  video.playsInline = true;
  const playRequest = video.play();
  playRequest?.catch?.(() => {});
});
