/**
 * 黄山旅游景点网站 - 表单验证与交互模块
 */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
  initWeatherWidget();
  initFaqAccordion();
});

/* ============ 联系表单验证 ============ */
function initContactForm() {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var nameInput = form.querySelector("#contactName");
  var emailInput = form.querySelector("#contactEmail");
  var messageInput = form.querySelector("#contactMessage");
  var submitBtn = form.querySelector('button[type="submit"]');

  // 实时验证
  [nameInput, emailInput, messageInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener("blur", function () { validateField(input); });
    input.addEventListener("input", function () {
      if (input.classList.contains("error")) validateField(input);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var isValid = true;
    [nameInput, emailInput, messageInput].forEach(function (input) {
      if (!validateField(input)) isValid = false;
    });
    if (isValid) {
      // 模拟提交
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "提交中...";
      submitBtn.style.opacity = "0.7";

      setTimeout(function () {
        submitBtn.textContent = "✓ 提交成功!";
        submitBtn.style.background = "var(--success)";
        form.reset();
        // 清除错误状态
        form.querySelectorAll(".form-error").forEach(function (el) { el.textContent = ""; });
        form.querySelectorAll(".error").forEach(function (el) { el.classList.remove("error"); });

        setTimeout(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = "";
          submitBtn.style.opacity = "";
        }, 3000);
      }, 1500);
    }
  });

  function validateField(input) {
    var errorEl = input.parentElement.querySelector(".form-error");
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "form-error";
      input.parentElement.appendChild(errorEl);
    }
    var value = input.value.trim();
    var error = "";
    if (!value) {
      error = "此字段不能为空";
    } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "请输入有效的邮箱地址";
    } else if (input.id === "contactName" && value.length < 2) {
      error = "姓名至少2个字符";
    } else if (input.id === "contactMessage" && value.length < 10) {
      error = "留言内容至少10个字符";
    }
    errorEl.textContent = error;
    if (error) {
      input.classList.add("error");
      input.style.borderColor = "var(--danger)";
      return false;
    } else {
      input.classList.remove("error");
      input.style.borderColor = "";
      return true;
    }
  }
}

/* ============ 天气小部件 (模拟) ============ */
function initWeatherWidget() {
  var widget = document.querySelector(".weather-widget");
  if (!widget) return;

  // 模拟天气数据
  var weathers = [
    { icon: "☀️", temp: "22°C", desc: "晴", humidity: "45%", wind: "东北风 3级" },
    { icon: "⛅", temp: "18°C", desc: "多云", humidity: "60%", wind: "东风 2级" },
    { icon: "🌧️", temp: "15°C", desc: "小雨", humidity: "85%", wind: "南风 4级" },
    { icon: "🌫️", temp: "12°C", desc: "雾", humidity: "92%", wind: "无持续风向" },
  ];

  var random = weathers[Math.floor(Math.random() * weathers.length)];

  widget.innerHTML = '\
    <div style="display:flex;align-items:center;gap:1rem;padding:1.5rem;background:var(--white);border-radius:var(--radius-lg);box-shadow:var(--shadow-md);">\
      <div style="font-size:3rem;">' + random.icon + '</div>\
      <div>\
        <div style="font-size:1.5rem;font-weight:700;">黄山风景区 ' + random.desc + '</div>\
        <div style="font-size:2rem;font-weight:700;color:var(--primary);">' + random.temp + '</div>\
        <div style="color:var(--text-light);font-size:0.875rem;">湿度: ' + random.humidity + ' | ' + random.wind + '</div>\
      </div>\
    </div>';
}

/* ============ FAQ 折叠面板 ============ */
function initFaqAccordion() {
  var accordions = document.querySelectorAll(".faq-item");
  if (accordions.length === 0) return;

  accordions.forEach(function (item) {
    var header = item.querySelector(".faq-question");
    if (!header) return;
    header.addEventListener("click", function () {
      var isActive = item.classList.contains("active");
      // 关闭所有
      accordions.forEach(function (a) { a.classList.remove("active"); });
      // 切换当前
      if (!isActive) item.classList.add("active");
    });
  });
}
