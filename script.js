/* ============================================================
   PHÚC TRAVEL – script.js
   Vanilla JavaScript – Không phụ thuộc thư viện ngoài
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. STICKY HEADER
     ============================================================ */
  const header = document.getElementById('header');

  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll);


  /* ============================================================
     2. MOBILE MENU (HAMBURGER)
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const nav        = document.getElementById('nav');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
  }

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      nav.classList.toggle('open');
    });
  }


  /* ============================================================
     3. SMOOTH SCROLL + ACTIVE NAV LINK (SCROLLSPY)
     ============================================================ */
  const navLinks   = document.querySelectorAll('.nav-link');
  const allSections = document.querySelectorAll('section[id]');

  function getHeaderHeight() {
    return header.classList.contains('scrolled') ? 68 : 80;
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      closeMobileMenu();

      const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetPos = targetTop - getHeaderHeight() + 1;

      window.scrollTo({
        top: offsetPos,
        behavior: 'smooth'
      });
    });
  });

  function updateActiveNavLink() {
    let currentId = '';
    const scrollPos = window.scrollY + getHeaderHeight() + 30;

    allSections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
  updateActiveNavLink();


  /* ============================================================
     4. HERO SLIDESHOW
     ============================================================ */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots    = document.querySelectorAll('.hero-dot');
  let heroIndex      = 0;
  let heroInterval   = null;

  function showHeroSlide(index) {
    heroSlides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === index);
    });
    heroDots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
    heroIndex = index;
  }

  function nextHeroSlide() {
    const next = (heroIndex + 1) % heroSlides.length;
    showHeroSlide(next);
  }

  function startHeroAutoplay() {
    stopHeroAutoplay();
    heroInterval = setInterval(nextHeroSlide, 5500);
  }

  function stopHeroAutoplay() {
    if (heroInterval) clearInterval(heroInterval);
  }

  if (heroSlides.length > 0) {
    heroDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const idx = parseInt(dot.getAttribute('data-slide'), 10);
        showHeroSlide(idx);
        startHeroAutoplay();
      });
    });
    startHeroAutoplay();
  }


  /* ============================================================
     5. FADE / REVEAL ON SCROLL
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: hiện tất cả nếu trình duyệt không hỗ trợ
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ============================================================
     6. GALLERY LIGHTBOX POPUP
     ============================================================ */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightbox-img');
  const lightboxClose  = document.getElementById('lightbox-close');
  const lightboxPrev   = document.getElementById('lightbox-prev');
  const lightboxNext   = document.getElementById('lightbox-next');

  const galleryImages = Array.prototype.map.call(galleryItems, function (item) {
    return item.getAttribute('data-src') || item.querySelector('img').getAttribute('src');
  });

  let currentGalleryIndex = 0;

  function openLightbox(index) {
    currentGalleryIndex = index;
    lightboxImg.setAttribute('src', galleryImages[currentGalleryIndex]);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showGalleryImage(index) {
    const total = galleryImages.length;
    currentGalleryIndex = (index + total) % total;
    lightboxImg.setAttribute('src', galleryImages[currentGalleryIndex]);
  }

  if (lightbox) {
    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () {
        openLightbox(index);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function () {
      showGalleryImage(currentGalleryIndex - 1);
    });
    lightboxNext.addEventListener('click', function () {
      showGalleryImage(currentGalleryIndex + 1);
    });

    // Đóng khi click ra ngoài ảnh
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Điều khiển bằng bàn phím
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showGalleryImage(currentGalleryIndex - 1);
      if (e.key === 'ArrowRight') showGalleryImage(currentGalleryIndex + 1);
    });
  }


  /* ============================================================
     7. TESTIMONIAL SLIDER (AUTO + MANUAL)
     ============================================================ */
  const testiSlider = document.getElementById('testimonial-slider');
  const testiCards   = document.querySelectorAll('.testimonial-card');
  const testiPrevBtn = document.getElementById('slider-prev');
  const testiNextBtn = document.getElementById('slider-next');
  const testiDotsWrap = document.getElementById('slider-dots');

  let testiIndex     = 0;
  let testiAutoplay   = null;

  function getCardsPerView() {
    return window.innerWidth <= 768 ? 1 : 3;
  }

  function getMaxTestiIndex() {
    return Math.max(0, testiCards.length - getCardsPerView());
  }

  function buildTestiDots() {
    if (!testiDotsWrap) return;
    testiDotsWrap.innerHTML = '';
    const maxIndex = getMaxTestiIndex();

    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot-btn';
      dot.setAttribute('aria-label', 'Xem đánh giá nhóm ' + (i + 1));
      dot.addEventListener('click', function () {
        goToTestiSlide(i);
        restartTestiAutoplay();
      });
      testiDotsWrap.appendChild(dot);
    }
    updateTestiDots();
  }

  function updateTestiDots() {
    if (!testiDotsWrap) return;
    const dots = testiDotsWrap.querySelectorAll('.slider-dot-btn');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === testiIndex);
    });
  }

  function updateTestiSliderPosition() {
    if (!testiSlider || testiCards.length === 0) return;

    const firstCard  = testiCards[0];
    const cardRect    = firstCard.getBoundingClientRect();
    const sliderStyle = window.getComputedStyle(testiSlider);
    const gap          = parseFloat(sliderStyle.gap) || 24;
    const offset        = testiIndex * (cardRect.width + gap);

    testiSlider.style.transform = 'translateX(-' + offset + 'px)';
    updateTestiDots();
  }

  function goToTestiSlide(index) {
    const maxIndex = getMaxTestiIndex();
    if (index < 0) index = maxIndex;
    if (index > maxIndex) index = 0;
    testiIndex = index;
    updateTestiSliderPosition();
  }

  function nextTestiSlide() { goToTestiSlide(testiIndex + 1); }
  function prevTestiSlide() { goToTestiSlide(testiIndex - 1); }

  function startTestiAutoplay() {
    stopTestiAutoplay();
    testiAutoplay = setInterval(nextTestiSlide, 4500);
  }

  function stopTestiAutoplay() {
    if (testiAutoplay) clearInterval(testiAutoplay);
  }

  function restartTestiAutoplay() {
    stopTestiAutoplay();
    startTestiAutoplay();
  }

  if (testiSlider && testiCards.length > 0) {
    buildTestiDots();
    updateTestiSliderPosition();
    startTestiAutoplay();

    if (testiNextBtn) {
      testiNextBtn.addEventListener('click', function () {
        nextTestiSlide();
        restartTestiAutoplay();
      });
    }
    if (testiPrevBtn) {
      testiPrevBtn.addEventListener('click', function () {
        prevTestiSlide();
        restartTestiAutoplay();
      });
    }

    // Tạm dừng autoplay khi hover
    const testiWrap = document.querySelector('.testimonial-slider-wrap');
    if (testiWrap) {
      testiWrap.addEventListener('mouseenter', stopTestiAutoplay);
      testiWrap.addEventListener('mouseleave', startTestiAutoplay);
    }

    // Cập nhật lại vị trí & số dot khi resize màn hình
    window.addEventListener('resize', debounce(function () {
      testiIndex = 0;
      buildTestiDots();
      updateTestiSliderPosition();
    }, 250));
  }


  /* ============================================================
     8. FAQ ACCORDION
     ============================================================ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer    = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Đóng toàn bộ các câu hỏi khác (chế độ accordion)
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.classList.remove('open');
      });

      // Mở câu hỏi vừa click (nếu trước đó đang đóng)
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
      }
    });
  });


  /* ============================================================
     9. BACK TO TOP BUTTON
     ============================================================ */
  const backToTopBtn = document.getElementById('back-to-top');

  function handleBackToTopVisibility() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    window.addEventListener('scroll', throttle(handleBackToTopVisibility, 100));
    handleBackToTopVisibility();

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ============================================================
   10. CONTACT FORM SUBMIT → TELEGRAM
   ============================================================ */

const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

const BOT_TOKEN = "8814642867:AAFADdOIAiG4Nvt4-MQ6v0CWJZ_Nr2t0Tqo";
const CHAT_ID = "8723711467";

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const pickup = document.getElementById('pickup').value.trim();
    const dropoff = document.getElementById('dropoff').value.trim();
    const note = document.getElementById('note').value.trim();

    if (!name || !phone) {
      alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại.');
      return;
    }

    const message = `
🚐 ĐƠN ĐẶT XE MỚI

👤 Khách hàng: ${name}
📞 Điện thoại: ${phone}
📍 Điểm đón: ${pickup}
📍 Điểm đến: ${dropoff}
📝 Ghi chú: ${note}

🌐 Gửi từ website Phúc Travel
`;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message
          })
        }
      );

      const result = await response.json();

      if (result.ok) {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';

        setTimeout(() => {
          contactForm.reset();
          contactForm.style.display = 'block';
          formSuccess.style.display = 'none';
        }, 6000);
      } else {
        alert("Không gửi được yêu cầu.");
      }

    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối Telegram.");
    }
  });
}


  /* ============================================================
     UTILITIES: THROTTLE & DEBOUNCE
     ============================================================ */
  function throttle(fn, wait) {
    let lastTime = 0;
    let timeout  = null;
    return function () {
      const now = Date.now();
      const remaining = wait - (now - lastTime);
      if (remaining <= 0) {
        lastTime = now;
        fn.apply(this, arguments);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          lastTime = Date.now();
          fn.apply(this, arguments);
        }, remaining);
      }
    };
  }

  function debounce(fn, wait) {
    let timeout = null;
    return function () {
      clearTimeout(timeout);
      const args = arguments;
      const ctx  = this;
      timeout = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    };
  }

});