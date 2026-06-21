/**
 * 黄山旅游景点网站 - 画廊与轮播模块
 * 包含: 图片画廊过滤、灯箱查看、首页轮播
 */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  initCarousel();
  initGallery();
  initLightbox();
});

/* ============ 首页轮播 ============ */
function initCarousel() {
  var carousel = document.querySelector(".carousel");
  if (!carousel) return;
  var track = carousel.querySelector(".carousel-track");
  var slides = carousel.querySelectorAll(".carousel-slide");
  var prevBtn = carousel.querySelector(".carousel-btn.prev");
  var nextBtn = carousel.querySelector(".carousel-btn.next");
  var dotsContainer = carousel.querySelector(".carousel-dots");
  if (!track || slides.length === 0) return;

  var currentIndex = 0;
  var slideCount = slides.length;
  var autoPlayInterval;
  var isTransitioning = false;

  // 创建指示点
  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", "Slide " + (i + 1));
    dot.addEventListener("click", function () { goToSlide(i); });
    dotsContainer.appendChild(dot);
  });
  updateDots();

  function goToSlide(index) {
    if (isTransitioning || index === currentIndex) return;
    isTransitioning = true;
    currentIndex = index;
    track.style.transform = "translateX(-" + (currentIndex * 100) + "%)";
    updateDots();
    setTimeout(function () { isTransitioning = false; }, 500);
  }

  function nextSlide() { goToSlide((currentIndex + 1) % slideCount); }
  function prevSlide() { goToSlide((currentIndex - 1 + slideCount) % slideCount); }
  function updateDots() {
    var dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === currentIndex);
    });
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { prevSlide(); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", function () { nextSlide(); resetAuto(); });

  // 自动播放
  function startAuto() { autoPlayInterval = setInterval(nextSlide, 4000); }
  function resetAuto() { clearInterval(autoPlayInterval); startAuto(); }
  startAuto();

  // 触摸滑动
  var touchStartX = 0;
  track.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; });
  track.addEventListener("touchend", function (e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      resetAuto();
    }
  });
}

/* ============ 画廊过滤 ============ */
function initGallery() {
  var filterBtns = document.querySelectorAll(".filter-btn");
  var galleryItems = document.querySelectorAll(".gallery-item");
  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter");
      galleryItems.forEach(function (item) {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "block";
          item.style.animation = "fadeIn 0.4s ease";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

/* ============ 灯箱查看 ============ */
function initLightbox() {
  var lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;
  var lightboxImg = lightbox.querySelector(".lightbox-img");
  var closeBtn = lightbox.querySelector(".lightbox-close");
  var prevBtn = lightbox.querySelector(".lightbox-prev");
  var nextBtn = lightbox.querySelector(".lightbox-next");
  var galleryItems = document.querySelectorAll(".gallery-item");

  var currentIndex = 0;
  var images = [];

  galleryItems.forEach(function (item, i) {
    var img = item.querySelector("img");
    if (img) images.push({ src: img.src, alt: img.alt });
    item.addEventListener("click", function () {
      currentIndex = i;
      openLightbox(currentIndex);
    });
  });

  function openLightbox(index) {
    if (images.length === 0) return;
    lightboxImg.src = images[index].src;
    lightboxImg.alt = images[index].alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex].src;
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", showPrev);
  if (nextBtn) nextBtn.addEventListener("click", showNext);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });
}
