/**
 * 3D卡片倾斜效果 + 页面加载进度条
 */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  initTiltCards();
  initPageLoader();
});

/* ============ 3D 卡片倾斜 (Tilt Effect) ============ */
function initTiltCards() {
  var cards = document.querySelectorAll(".tilt-card, .card, .feature-card, .culture-card, .route-card");
  if (cards.length === 0) return;

  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var tiltX = (y - 0.5) * 8;
      var tiltY = (x - 0.5) * -8;
      card.style.transform = "perspective(800px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg) translateY(-4px)";
      card.style.boxShadow = "0 20px 50px rgba(0,0,0,0.15)";
      card.style.transition = "transform 0.1s ease-out, box-shadow 0.1s ease-out";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
      card.style.boxShadow = "";
      card.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";
    });
  });
}

/* ============ 页面加载进度条 ============ */
function initPageLoader() {
  var loader = document.createElement("div");
  loader.className = "page-loader";
  document.body.prepend(loader);

  window.addEventListener("load", function () {
    setTimeout(function () {
      loader.style.opacity = "0";
      loader.style.transition = "opacity 0.3s ease";
      setTimeout(function () { loader.remove(); }, 350);
    }, 300);
  });
}
