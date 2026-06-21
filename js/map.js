/**
 * 黄山景区交互地图 - Interactive Scenic Map
 * 包含: 可拖拽SVG地图、景点标注、路线动画、信息弹窗
 */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  initScenicMap();
});

function initScenicMap() {
  var mapContainer = document.getElementById("scenicMap");
  if (!mapContainer) return;

  // 景点数据
  var spots = [
    { id: "lotus", name: "莲花峰", x: 55, y: 38, desc: "黄山第一高峰<br>海拔1864.8米", icon: "🏔️", route: "south" },
    { id: "bright", name: "光明顶", x: 70, y: 42, desc: "日出最佳观赏地<br>海拔1860米", icon: "🌅", route: "middle" },
    { id: "tiandu", name: "天都峰", x: 48, y: 52, desc: "天上都会<br>鲫鱼背险峻", icon: "⛰️", route: "south" },
    { id: "pine", name: "迎客松", x: 40, y: 58, desc: "黄山标志<br>千年古松", icon: "🌲", route: "south" },
    { id: "westsea", name: "西海大峡谷", x: 35, y: 30, desc: "梦幻景区<br>绝壁栈道", icon: "🏞️", route: "west" },
    { id: "flyrock", name: "飞来石", x: 58, y: 22, desc: "天外来石<br>红楼梦取景地", icon: "🪨", route: "west" },
    { id: "cloudvalley", name: "云谷寺", x: 82, y: 55, desc: "后山索道起点<br>古树参天", icon: "🏯", route: "east" },
    { id: "beihai", name: "北海景区", x: 68, y: 18, desc: "始信峰所在地<br>奇松荟萃", icon: "🌿", route: "east" },
  ];

  var routes = [
    { id: "south", name: "前山路线(玉屏)", color: "#e76f51", path: "M38,85 L40,58 L48,52 L55,38 L70,42 L82,55" },
    { id: "east", name: "后山路线(云谷)", color: "#457b9d", path: "M88,80 L82,55 L68,42 L70,42" },
    { id: "west", name: "西海路线", color: "#52b788", path: "M20,50 L35,30 L58,22 L68,18" },
  ];

  // 构建 SVG 地图
  var svgNS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("class", "scenic-map-svg");
  svg.style.width = "100%";
  svg.style.maxWidth = "800px";
  svg.style.height = "auto";
  svg.style.display = "block";
  svg.style.margin = "0 auto";

  // 背景渐变
  var defs = document.createElementNS(svgNS, "defs");
  var bgGrad = document.createElementNS(svgNS, "linearGradient");
  bgGrad.setAttribute("id", "mapBg");
  bgGrad.setAttribute("x1", "0"); bgGrad.setAttribute("y1", "0");
  bgGrad.setAttribute("x2", "0"); bgGrad.setAttribute("y2", "1");
  var stop1 = document.createElementNS(svgNS, "stop"); stop1.setAttribute("offset", "0%"); stop1.setAttribute("stop-color", "#d8f3dc");
  var stop2 = document.createElementNS(svgNS, "stop"); stop2.setAttribute("offset", "100%"); stop2.setAttribute("stop-color", "#b7e4c7");
  bgGrad.appendChild(stop1); bgGrad.appendChild(stop2);
  defs.appendChild(bgGrad);

  // 光晕滤镜
  var filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("id", "glow");
  filter.innerHTML = '<feGaussianBlur stdDeviation="0.8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>';
  defs.appendChild(filter);

  // 山体阴影
  var mtns = [
    { cx: 55, cy: 38, r: 12, fill: "#2d6a4f", opacity: 0.15 },
    { cx: 70, cy: 42, r: 10, fill: "#2d6a4f", opacity: 0.12 },
    { cx: 48, cy: 52, r: 9, fill: "#2d6a4f", opacity: 0.12 },
    { cx: 35, cy: 30, r: 14, fill: "#2d6a4f", opacity: 0.08 },
  ];
  mtns.forEach(function(m) {
    var circle = document.createElementNS(svgNS, "circle");
    Object.keys(m).forEach(function(k) { circle.setAttribute(k, m[k]); });
    defs.appendChild(circle);
  });

  svg.appendChild(defs);

  // 背景矩形
  var bgRect = document.createElementNS(svgNS, "rect");
  bgRect.setAttribute("width", "100"); bgRect.setAttribute("height", "100");
  bgRect.setAttribute("rx", "8"); bgRect.setAttribute("fill", "url(#mapBg)");
  svg.appendChild(bgRect);

  // 图标例
  var legendItems = [
    { color: "#e76f51", label: "前山线" },
    { color: "#457b9d", label: "后山线" },
    { color: "#52b788", label: "西海线" },
  ];
  var legendX = 4, legendY = 6;
  legendItems.forEach(function(item, i) {
    var g = document.createElementNS(svgNS, "g");
    var line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", legendX + i*22); line.setAttribute("y1", legendY);
    line.setAttribute("x2", legendX + i*22 + 12); line.setAttribute("y2", legendY);
    line.setAttribute("stroke", item.color); line.setAttribute("stroke-width", "2.5");
    line.setAttribute("stroke-dasharray", "3,2"); line.setAttribute("stroke-linecap", "round");
    g.appendChild(line);
    var text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", legendX + i*22 + 14); text.setAttribute("y", legendY + 3);
    text.setAttribute("fill", "#555"); text.setAttribute("font-size", "3.5");
    text.textContent = item.label;
    g.appendChild(text);
    svg.appendChild(g);
  });

  // 路线
  routes.forEach(function(route) {
    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", route.path);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", route.color);
    path.setAttribute("stroke-width", "1.8");
    path.setAttribute("stroke-dasharray", "4,3");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("class", "map-route");
    path.style.transition = "all 0.3s";
    svg.appendChild(path);

    // 路线标签
    var mid = getPathMidpoint(route.path);
    if (mid) {
      var label = document.createElementNS(svgNS, "text");
      label.setAttribute("x", mid.x + 3); label.setAttribute("y", mid.y - 2);
      label.setAttribute("fill", route.color); label.setAttribute("font-size", "3");
      label.setAttribute("font-weight", "bold"); label.textContent = route.name;
      svg.appendChild(label);
    }
  });

  // 景点标注点
  spots.forEach(function(spot) {
    var g = document.createElementNS(svgNS, "g");
    g.setAttribute("class", "map-spot");
    g.setAttribute("data-spot-id", spot.id);
    g.style.cursor = "pointer";

    // 脉冲外圈
    var pulse = document.createElementNS(svgNS, "circle");
    pulse.setAttribute("cx", spot.x); pulse.setAttribute("cy", spot.y);
    pulse.setAttribute("r", "4"); pulse.setAttribute("fill", "none");
    pulse.setAttribute("stroke", "#2d6a4f"); pulse.setAttribute("stroke-width", "0.8");
    pulse.setAttribute("opacity", "0.3");
    pulse.innerHTML = '<animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>';
    g.appendChild(pulse);

    // 标记点
    var dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("cx", spot.x); dot.setAttribute("cy", spot.y);
    dot.setAttribute("r", "2.5"); dot.setAttribute("fill", "#2d6a4f");
    dot.setAttribute("stroke", "#fff"); dot.setAttribute("stroke-width", "1");
    g.appendChild(dot);

    // 名称标签
    var text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", spot.x); text.setAttribute("y", spot.y - 4);
    text.setAttribute("text-anchor", "middle"); text.setAttribute("fill", "#1b4332");
    text.setAttribute("font-size", "3.2"); text.setAttribute("font-weight", "600");
    text.setAttribute("font-family", "var(--font-title)");
    text.textContent = spot.name;
    g.appendChild(text);

    // 图标
    var icon = document.createElementNS(svgNS, "text");
    icon.setAttribute("x", spot.x); icon.setAttribute("y", spot.y + 6);
    icon.setAttribute("text-anchor", "middle"); icon.setAttribute("font-size", "4.5");
    icon.textContent = spot.icon;
    g.appendChild(icon);

    // 点击事件
    g.addEventListener("click", function(e) {
      e.stopPropagation();
      showSpotInfo(spot);
    });
    g.addEventListener("mouseenter", function() {
      dot.setAttribute("r", "3.5");
      dot.setAttribute("fill", "#d4a373");
    });
    g.addEventListener("mouseleave", function() {
      dot.setAttribute("r", "2.5");
      dot.setAttribute("fill", "#2d6a4f");
    });

    svg.appendChild(g);
  });

  // 底部提示
  var hint = document.createElementNS(svgNS, "text");
  hint.setAttribute("x", "50"); hint.setAttribute("y", "96");
  hint.setAttribute("text-anchor", "middle"); hint.setAttribute("fill", "#999");
  hint.setAttribute("font-size", "2.5");
  hint.textContent = "🖱️ 点击景点查看详情";
  svg.appendChild(hint);

  mapContainer.appendChild(svg);

  // 信息弹窗
  var popup = document.createElement("div");
  popup.className = "map-popup";
  popup.style.cssText = "display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:var(--white);padding:2rem;border-radius:var(--radius-xl);box-shadow:var(--shadow-xl);text-align:center;min-width:280px;";
  popup.innerHTML = '<button class="map-popup-close" style="position:absolute;top:8px;right:12px;font-size:1.5rem;color:var(--text-muted);">&times;</button><div class="map-popup-content"></div>';
  document.body.appendChild(popup);

  popup.querySelector(".map-popup-close").addEventListener("click", function() {
    popup.style.display = "none";
  });
  popup.addEventListener("click", function(e) {
    if (e.target === popup) popup.style.display = "none";
  });

  function showSpotInfo(spot) {
    var content = popup.querySelector(".map-popup-content");
    content.innerHTML = '\
      <div style="font-size:3rem;margin-bottom:0.5rem;">' + spot.icon + '</div>\
      <h3 style="font-family:var(--font-title);font-size:1.5rem;color:var(--primary-dark);margin-bottom:0.5rem;">' + spot.name + '</h3>\
      <p style="color:var(--text-light);line-height:1.8;">' + spot.desc + '</p>\
      <button class="btn btn-sm btn-primary" style="margin-top:1rem;" onclick="this.closest('.map-popup').style.display='none'">关闭</button>';
    popup.style.display = "block";
  }
});

// 计算路径中点
function getPathMidpoint(pathD) {
  var coords = pathD.match(/[\d.]+/g);
  if (!coords || coords.length < 4) return null;
  var midIndex = Math.floor(coords.length / 4) * 2;
  return { x: parseFloat(coords[midIndex]), y: parseFloat(coords[midIndex + 1]) };
}
