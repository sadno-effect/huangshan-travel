(function() {
  // 四组图片各取一张
  var images = [
    'images/光明顶日出/光明顶日出_1.jpg',
    'images/云海/云海_1.jpg',
    'images/西海大峡谷/西海大峡谷_1.jpg',
    'images/冬雪/冬雪_1.jpg'
  ];

  // 创建遮罩
  var splash = document.createElement('div');
  splash.id = '__splash';
  splash.innerHTML =
    '<div style="position:absolute;inset:0;background:rgba(0,0,0,.55);z-index:1;"></div>' +
    images.map(function(src, i) {
      return '<div class="__splash-bg" style="background-image:url(' + src + ');animation-delay:' + (i * 1.2) + 's;"></div>';
    }).join('') +
    '<div class="__splash-content">' +
      '<div class="__splash-icon">&#9968;</div>' +
      '<h1 class="__splash-title">黄山旅游</h1>' +
      '<p class="__splash-sub">天下第一奇山 · 世界自然与文化双重遗产</p>' +
    '</div>' +
    '<div class="__splash-bar"></div>' +
    '<span class="__splash-skip" onclick="var s=document.getElementById(\'__splash\');s&&s.remove();">跳过 &#10095;</span>';

  splash.style.cssText =
    'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;' +
    'font-family:"Microsoft YaHei","PingFang SC",sans-serif;';

  document.body.insertBefore(splash, document.body.firstChild);

  // 添加样式
  var style = document.createElement('style');
  style.textContent =
    '.__splash-bg{position:absolute;inset:0;background-size:cover;background-position:center;' +
    'opacity:0;animation:__splashFade 4.8s ease-in-out infinite;}' +
    '@keyframes __splashFade{0%,15%{opacity:0}25%,40%{opacity:1}50%,100%{opacity:0}}' +
    '.__splash-content{position:relative;z-index:2;text-align:center;color:#fff;}' +
    '.__splash-icon{font-size:3.5rem;animation:__splashFloat 2s ease-in-out infinite;}' +
    '@keyframes __splashFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}' +
    '.__splash-title{font-size:clamp(2rem,5vw,3.2rem);margin:0.5rem 0 0;letter-spacing:6px;' +
    'font-family:"STKaiti","KaiTi","楷体",serif;animation:__splashIn 1s ease .2s both;}' +
    '.__splash-sub{font-size:0.9rem;opacity:0.7;margin-top:0.4rem;letter-spacing:4px;' +
    'animation:__splashIn 1s ease .6s both;}' +
    '@keyframes __splashIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}' +
    '.__splash-bar{position:absolute;bottom:0;left:0;height:3px;z-index:2;' +
    'background:linear-gradient(90deg,#2d6a4f,#40916c,#d4a373);' +
    'animation:__splashBar 3.8s ease-out forwards;}' +
    '@keyframes __splashBar{from{width:0}to{width:100%}}' +
    '.__splash-skip{position:absolute;bottom:24px;right:24px;z-index:2;color:rgba(255,255,255,.5);' +
    'font-size:0.8rem;cursor:pointer;transition:color .3s;}' +
    '.__splash-skip:hover{color:#fff;}';
  document.head.appendChild(style);

  // 3.8秒后淡出
  setTimeout(function() {
    splash.style.transition = 'opacity .6s ease';
    splash.style.opacity = '0';
    setTimeout(function() { splash.remove(); }, 600);
  }, 3800);
})();
