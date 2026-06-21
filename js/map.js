"use strict";
document.addEventListener("DOMContentLoaded", function () { initScenicMap(); });

function initScenicMap() {
  var mapContainer = document.getElementById("scenicMap");
  if (!mapContainer) return;

  var spots = [
    { id: "lotus", name: "莲花峰", x: 55, y: 32, desc: "黄山第一高峰<br>海拔1864.8米", icon: "🏔️" },
    { id: "bright", name: "光明顶", x: 72, y: 38, desc: "日出最佳观赏地<br>海拔1860米", icon: "🌅" },
    { id: "tiandu", name: "天都峰", x: 45, y: 52, desc: "天上都会<br>鲫鱼背险峻", icon: "⛰️" },
    { id: "pine", name: "迎客松", x: 35, y: 62, desc: "黄山标志<br>千年古松", icon: "🌲" },
    { id: "westsea", name: "西海大峡谷", x: 30, y: 28, desc: "梦幻景区<br>绝壁栈道", icon: "🏞️" },
    { id: "flyrock", name: "飞来石", x: 58, y: 20, desc: "天外来石<br>红楼梦取景地", icon: "🪨" },
    { id: "cloudvalley", name: "云谷寺", x: 85, y: 58, desc: "后山索道起点<br>古树参天", icon: "🏯" },
    { id: "beihai", name: "北海景区", x: 68, y: 15, desc: "始信峰所在地<br>奇松荟萃", icon: "🌿" }
  ];

  var routes = [
    { name: "前山路线", color: "#e76f51", path: "M35,90 L35,62 L45,52 L55,32 L72,38 L85,58" },
    { name: "后山路线", color: "#457b9d", path: "M88,82 L85,58 L72,38" },
    { name: "西海路线", color: "#52b788", path: "M18,48 L30,28 L58,20 L68,15" }
  ];

  var svgNS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.style.cssText = "width:100%;max-width:750px;height:auto;display:block;margin:0 auto;border-radius:12px;";

  // Definitions
  var defs = document.createElementNS(svgNS, "defs");
  var bgGrad = document.createElementNS(svgNS, "linearGradient");
  bgGrad.id = "mapBgGrad"; bgGrad.setAttribute("x1","0"); bgGrad.setAttribute("y1","0"); bgGrad.setAttribute("x2","1"); bgGrad.setAttribute("y2","1");
  [["0%","#e8f5e9"],["50%","#c8e6c9"],["100%","#a5d6a7"]].forEach(function(s) {
    var stop = document.createElementNS(svgNS, "stop"); stop.setAttribute("offset",s[0]); stop.setAttribute("stop-color",s[1]); bgGrad.appendChild(stop);
  });
  defs.appendChild(bgGrad);

  var filter = document.createElementNS(svgNS, "filter");
  filter.id = "mapShadow";
  filter.innerHTML = "<feDropShadow dx='1' dy='1' stdDeviation='1.5' flood-color='#2d6a4f' flood-opacity='0.2'/>";
  defs.appendChild(filter);
  svg.appendChild(defs);

  // Background
  var bg = document.createElementNS(svgNS, "rect");
  bg.setAttribute("width","100"); bg.setAttribute("height","100"); bg.setAttribute("rx","10"); bg.setAttribute("fill","url(#mapBgGrad)");
  svg.appendChild(bg);

  // Grid
  for (var i = 10; i < 100; i += 10) {
    var hl = document.createElementNS(svgNS, "line");
    hl.setAttribute("x1",i); hl.setAttribute("y1",0); hl.setAttribute("x2",i); hl.setAttribute("y2",100);
    hl.setAttribute("stroke","#fff"); hl.setAttribute("stroke-width","0.3"); hl.setAttribute("opacity","0.5");
    svg.appendChild(hl);
    var vl = document.createElementNS(svgNS, "line");
    vl.setAttribute("x1",0); vl.setAttribute("y1",i); vl.setAttribute("x2",100); vl.setAttribute("y2",i);
    vl.setAttribute("stroke","#fff"); vl.setAttribute("stroke-width","0.3"); vl.setAttribute("opacity","0.5");
    svg.appendChild(vl);
  }

  // Title
  var title = document.createElementNS(svgNS, "text");
  title.setAttribute("x","50"); title.setAttribute("y","7"); title.setAttribute("text-anchor","middle");
  title.setAttribute("fill","#1b4332"); title.setAttribute("font-size","4.5"); title.setAttribute("font-weight","700");
  title.setAttribute("font-family","var(--font-title), serif"); title.textContent = "黄山景区导览图";
  svg.appendChild(title);

  // Routes
  routes.forEach(function(route) {
    var g = document.createElementNS(svgNS, "g");
    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", route.path); path.setAttribute("fill","none");
    path.setAttribute("stroke", route.color); path.setAttribute("stroke-width","2");
    path.setAttribute("stroke-dasharray","5,3"); path.setAttribute("stroke-linecap","round");
    path.setAttribute("opacity","0.7");
    g.appendChild(path);

    // Animated dot
    var dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("r","1.8"); dot.setAttribute("fill", route.color);
    dot.innerHTML = '<animateMotion dur="4s" repeatCount="indefinite" path="'+route.path+'"/><animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>';
    g.appendChild(dot);
    svg.appendChild(g);
  });

  // Legend
  var legendY = 13;
  routes.forEach(function(route, i) {
    var g = document.createElementNS(svgNS, "g");
    var line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1",5+i*24); line.setAttribute("y1",legendY); line.setAttribute("x2",5+i*24+14); line.setAttribute("y2",legendY);
    line.setAttribute("stroke",route.color); line.setAttribute("stroke-width","2"); line.setAttribute("stroke-dasharray","3,2");
    g.appendChild(line);
    var txt = document.createElementNS(svgNS, "text");
    txt.setAttribute("x",5+i*24+16); txt.setAttribute("y",legendY+3);
    txt.setAttribute("fill","#555"); txt.setAttribute("font-size","3"); txt.textContent = route.name;
    g.appendChild(txt);
    svg.appendChild(g);
  });

  // Spots
  spots.forEach(function(spot) {
    var g = document.createElementNS(svgNS, "g");
    g.style.cursor = "pointer";

    // Pulse ring
    var pulse = document.createElementNS(svgNS, "circle");
    pulse.setAttribute("cx",spot.x); pulse.setAttribute("cy",spot.y);
    pulse.setAttribute("r","3.5"); pulse.setAttribute("fill","none");
    pulse.setAttribute("stroke","#2d6a4f"); pulse.setAttribute("stroke-width","0.6"); pulse.setAttribute("opacity","0.25");
    pulse.innerHTML = '<animate attributeName="r" values="3.5;6.5;3.5" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite"/>';
    g.appendChild(pulse);

    // Dot
    var dot = document.createElementNS(svgNS, "circle");
    dot.setAttribute("cx",spot.x); dot.setAttribute("cy",spot.y);
    dot.setAttribute("r","2.2"); dot.setAttribute("fill","#2d6a4f");
    dot.setAttribute("stroke","#fff"); dot.setAttribute("stroke-width","0.8");
    g.appendChild(dot);

    // Name
    var nameEl = document.createElementNS(svgNS, "text");
    nameEl.setAttribute("x",spot.x); nameEl.setAttribute("y",spot.y-4.5);
    nameEl.setAttribute("text-anchor","middle"); nameEl.setAttribute("fill","#1b4332");
    nameEl.setAttribute("font-size","2.8"); nameEl.setAttribute("font-weight","600");
    nameEl.textContent = spot.name;
    g.appendChild(nameEl);

    // Icon
    var iconEl = document.createElementNS(svgNS, "text");
    iconEl.setAttribute("x",spot.x); iconEl.setAttribute("y",spot.y+5.5);
    iconEl.setAttribute("text-anchor","middle"); iconEl.setAttribute("font-size","4");
    iconEl.textContent = spot.icon;
    g.appendChild(iconEl);

    // Interactions
    g.addEventListener("mouseenter", function() { dot.setAttribute("fill","#d4a373"); dot.setAttribute("r","3.2"); });
    g.addEventListener("mouseleave", function() { dot.setAttribute("fill","#2d6a4f"); dot.setAttribute("r","2.2"); });
    g.addEventListener("click", function(e) { e.stopPropagation(); showSpotPopup(spot); });

    svg.appendChild(g);
  });

  // Hint
  var hint = document.createElementNS(svgNS, "text");
  hint.setAttribute("x","50"); hint.setAttribute("y","97");
  hint.setAttribute("text-anchor","middle"); hint.setAttribute("fill","#aaa"); hint.setAttribute("font-size","2.6");
  hint.textContent = "🖱 点击景点查看详情  |  ⛰ 黄山风景区";
  svg.appendChild(hint);

  mapContainer.appendChild(svg);

  // Popup
  var popup = document.createElement("div");
  popup.id = "mapInfoPopup";
  popup.style.cssText = "display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.9);z-index:9999;background:var(--white,#fff);padding:2rem 2.5rem;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.2);text-align:center;min-width:260px;max-width:340px;transition:0.25s cubic-bezier(.68,-.55,.27,1.55);";
  popup.innerHTML = '<button id="mapPopupClose" style="position:absolute;top:8px;right:14px;font-size:1.5rem;color:#aaa;border:none;background:none;cursor:pointer;line-height:1;">&times;</button><div id="mapPopupContent"></div>';
  document.body.appendChild(popup);

  document.getElementById("mapPopupClose").addEventListener("click", hidePopup);
  popup.addEventListener("click", function(e) { if (e.target === popup) hidePopup(); });

  function showSpotPopup(spot) {
    var content = document.getElementById("mapPopupContent");
    content.innerHTML = '<div style="font-size:3.5rem;margin-bottom:0.5rem;">' + spot.icon + '</div><h3 style="font-family:var(--font-title);font-size:1.5rem;color:#1b4332;margin-bottom:0.5rem;">' + spot.name + '</h3><p style="color:#666;line-height:1.8;">' + spot.desc + '</p>';
    popup.style.display = "block";
    setTimeout(function() { popup.style.transform = "translate(-50%,-50%) scale(1)"; popup.style.opacity = "1"; }, 10);
  }

  function hidePopup() {
    popup.style.transform = "translate(-50%,-50%) scale(0.9)";
    popup.style.opacity = "0";
    setTimeout(function() { popup.style.display = "none"; }, 250);
  }

  // ESC key
  document.addEventListener("keydown", function(e) { if (e.key === "Escape") hidePopup(); });
}
