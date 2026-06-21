/**
 * 黄山旅游景点网站 - 主 JavaScript 模块
 * 包含: 导航、主题切换、滚动效果、统计计数、表单验证
 */
"use strict";

/* ============ DOM Ready ============ */
document.addEventListener("DOMContentLoaded", function () {
  initNavbar();
  initThemeToggle();
  initBackToTop();
  initScrollReveal();
  initCountUp();
  initSmoothScroll();
  initCurrentPageHighlight();
  initParallaxEffect();
});

/* ============ 导航栏 ============ */
function initNavbar() {
  var navbar = document.querySelector(".navbar");
  var hamburger = document.querySelector(".hamburger");
  var navLinks = document.querySelector(".nav-links");
  if (!navbar || !hamburger || !navLinks) return;

  // 滚动检测
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 移动端汉堡菜单
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  // 点击导航链接关闭菜单
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });

  // 点击外部关闭
  document.addEventListener("click", function (e) {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("open");
    }
  });
}

/* ============ 暗色/亮色主题切换 ============ */
function initThemeToggle() {
  var toggleBtn = document.querySelector(".theme-toggle");
  if (!toggleBtn) return;

  // HTML5 localStorage 读取主题偏好
  var savedTheme = localStorage.getItem("huangshan-theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    updateThemeIcon("dark");
  }

  toggleBtn.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("huangshan-theme", next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

/* ============ 返回顶部按钮 ============ */
function initBackToTop() {
  var btn = document.querySelector(".back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ============ 滚动渐显动画 (Scroll Reveal) ============ */
function initScrollReveal() {
  var reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if (reveals.length === 0) return;

  function checkReveal() {
    var windowHeight = window.innerHeight;
    var revealPoint = 120;
    reveals.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < windowHeight - revealPoint) {
        el.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", checkReveal);
  checkReveal(); // 初始检查
}

/* ============ 数字递增动画 ============ */
function initCountUp() {
  var statNumbers = document.querySelectorAll(".stat-number[data-count]");
  if (statNumbers.length === 0) return;

  var animated = false;

  function animateCountUp() {
    if (animated) return;
    var statsSection = document.querySelector(".stats");
    if (!statsSection) return;
    var top = statsSection.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      animated = true;
      statNumbers.forEach(function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10);
        var duration = 2000;
        var startTime = null;
        var suffix = el.querySelector(".stat-suffix") ? "" : "";
        var suffixEl = el.querySelector(".stat-suffix");

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          // easeOutExpo
          var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          var current = Math.floor(eased * target);
          if (suffixEl) {
            el.childNodes[0].nodeValue = current;
          } else {
            el.textContent = current;
          }
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            if (suffixEl) {
              el.childNodes[0].nodeValue = target;
            } else {
              el.textContent = target.toLocaleString();
            }
          }
        }
        requestAnimationFrame(step);
      });
    }
  }

  window.addEventListener("scroll", animateCountUp);
  animateCountUp();
}

/* ============ 平滑滚动锚点 ============ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = document.querySelector(".navbar")
          ? document.querySelector(".navbar").offsetHeight
          : 72;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });
}

/* ============ 当前页面导航高亮 ============ */
function initCurrentPageHighlight() {
  var currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* ============ 视差滚动 ============ */
function initParallaxEffect() {
  var parallaxSections = document.querySelectorAll(".parallax-section");
  if (parallaxSections.length === 0) return;
  window.addEventListener("scroll", function () {
    parallaxSections.forEach(function (section) {
      var scrolled = window.pageYOffset;
      var rate = scrolled * 0.3;
      section.style.backgroundPositionY = "center " + rate + "px";
    });
  });
}

/* ============ 图片懒加载 ============ */
(function () {
  var lazyImages = document.querySelectorAll("img[data-src]");
  if (lazyImages.length === 0) return;
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.getAttribute("data-src");
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    }, { rootMargin: "100px" });
    lazyImages.forEach(function (img) { observer.observe(img); });
  } else {
    // 回退方案
    lazyImages.forEach(function (img) {
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    });
  }
})();
