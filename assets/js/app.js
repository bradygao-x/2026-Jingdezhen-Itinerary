const { routeSegments, roadRoute } = window.JDZ_ROUTE_DATA;
const { days, spotDetails, routes, hotelCards } = window.JDZ_ITINERARY_DATA;

const map = L.map('map', { center: [29.29, 117.23], zoom: 12, zoomControl: false, preferCanvas: true });
L.control.zoom({ position: 'bottomright' }).addTo(map);
const gaodeRoad = L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', { subdomains: '1234', maxZoom: 18, attribution: '高德地图' });
const gaodeSat = L.layerGroup([
  L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', { subdomains: '1234', maxZoom: 18, attribution: '高德地图' }),
  L.tileLayer('https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}', { subdomains: '1234', maxZoom: 18 })
]);
gaodeRoad.addTo(map);
let mainLine = L.polyline(roadRoute, { color: '#b85c38', weight: 4, opacity: 0.86, smoothFactor: 1.2 }).addTo(map);
const routeLayers = [];
const labelLayers = [];

function setRouteStatus(text, type = 'warn') {
  const routeStatus = document.getElementById('routeStatus');
  routeStatus.textContent = text;
  routeStatus.className = `route-status ${type}`;
}

function clearRouteLayers() {
  routeLayers.forEach(layer => map.removeLayer(layer));
  labelLayers.forEach(layer => map.removeLayer(layer));
  routeLayers.length = 0;
  labelLayers.length = 0;
}

function getSegmentPath(segment, preferAmap = true) {
  if (preferAmap && Array.isArray(segment.path) && segment.path.length >= 2) return segment.path;
  return segment.fallbackPath || [segment.a, segment.b];
}

function drawRouteSegments(useAmapRoute = false) {
  clearRouteLayers();
  routeSegments.forEach(segment => {
    const segmentPath = getSegmentPath(segment, useAmapRoute);
    const isAmapPath = segmentPath === segment.path;
    const layer = L.polyline(segmentPath, {
      color: isAmapPath ? '#874127' : '#2e678f',
      weight: isAmapPath ? 6 : 4,
      opacity: isAmapPath ? 0.28 : 0.42,
      dashArray: isAmapPath ? null : '8 8',
      interactive: false
    }).addTo(map);
    routeLayers.push(layer);
    const midPoint = segmentPath[Math.floor(segmentPath.length / 2)] || [(segment.a[0] + segment.b[0]) / 2, (segment.a[1] + segment.b[1]) / 2];
    const label = L.marker(midPoint, {
      interactive: false,
      icon: L.divIcon({
        className: 'route-km-label',
        html: `<span>${segment.km}</span>`,
        iconSize: [1, 1],
        iconAnchor: [0, 0]
      })
    }).addTo(map);
    labelLayers.push(label);
  });
}

drawRouteSegments(false);

async function loadAmapDrivingRoutes() {
  try {
    setRouteStatus('高德路线：正在加载真实驾车路线...', 'warn');
    const paths = routeSegments.map(segment => getSegmentPath(segment, true));
    const fallbackSegments = routeSegments
      .filter(segment => !(Array.isArray(segment.path) && segment.path.length >= 2))
      .map(segment => `${segment.from}-${segment.to}`);
    const road = paths.flatMap((path, index) => index === 0 ? path : path.slice(1));
    if (!road.length) return;
    map.removeLayer(mainLine);
    mainLine = L.polyline(road, { color: '#b85c38', weight: 4, opacity: 0.9, smoothFactor: 1.2 }).addTo(map);
    drawRouteSegments(true);
    map.fitBounds(mainLine.getBounds(), { padding: [30, 30] });
    if (fallbackSegments.length) {
      setRouteStatus(`高德路线：部分加载，${fallbackSegments.join('、')} 使用点到点直线替代。`, 'warn');
    } else {
      setRouteStatus('高德路线：已加载真实驾车路线', 'ok');
    }
  } catch (error) {
    routeSegments.forEach(segment => { segment.path = null; });
    const straightRoad = routeSegments.flatMap((segment, index) => {
      const path = getSegmentPath(segment, false);
      return index === 0 ? path : path.slice(1);
    });
    if (straightRoad.length) {
      map.removeLayer(mainLine);
      mainLine = L.polyline(straightRoad, { color: '#2e678f', weight: 4, opacity: 0.72, dashArray: '8 8' }).addTo(map);
      drawRouteSegments(false);
      map.fitBounds(mainLine.getBounds(), { padding: [30, 30] });
    }
    setRouteStatus(`高德路线：加载失败，已使用点到点直线替代。${error.message || error}`, 'fail');
  }
}

const points = {
  station: [29.339669, 117.242517],
  hotel: [29.316306, 117.240781],
  museum: [29.29324, 117.17553],
  site704: [29.295416, 117.246113],
  oldtown: [29.295184, 117.206979],
  coffee: [29.295352, 117.205275],
  taoxichuan: [29.296921, 117.236957],
  sanbao: [29.247141, 117.26534],
  food: [29.295673, 117.23496]
};

const markerMeta = [
  ['station', '景德镇北站', 'D1 23:00+'],
  ['hotel', '景德镇假日酒店', '陶溪川文创孵化中心 A 座'],
  ['museum', '中国陶瓷博物馆', 'D2 上午'],
  ['site704', '景德镇陶瓷研究院 / 新厂西路节点', 'D2 中段'],
  ['oldtown', '御窑厂国家考古遗址公园', 'D2 下午'],
  ['coffee', '陶阳里咖啡点', '15:30 插入'],
  ['taoxichuan', '陶溪川文创街区', '晚饭+散步'],
  ['sanbao', '三宝国际陶艺村', 'D3 上午'],
  ['food', '陶溪川餐饮锚点', '周六晚饭']
];

const markers = [];
markerMeta.forEach(([id, title, sub], index) => {
  const marker = L.circleMarker(points[id], {
    radius: 8,
    color: '#fff',
    weight: 2,
    fillColor: id === 'hotel' ? '#2f765f' : id === 'sanbao' ? '#2f678f' : '#b85c38',
    fillOpacity: 0.96
  }).addTo(map);
  marker.bindTooltip(title, { permanent: true, direction: 'top', offset: [0, -11], className: 'day-label' });
  marker.on('click', () => selectSpot(id));
  marker._id = id;
  marker._icon && marker._icon.classList.add('pin-marker');
  markers.push(marker);
});

const daysPanel = document.getElementById('days');
const routeCards = document.getElementById('routeCards');
const hotelCardsPanel = document.getElementById('hotelCards');
const detailPanel = document.getElementById('detailPanel');
const copyBox = document.getElementById('copyBox');
const routeStatus = document.getElementById('routeStatus');
let activeDay = 'd1';
let activeRoute = 'recommended';
let currentSpot = null;

function renderDays() {
  daysPanel.innerHTML = '<h2 class="section-title">每日行程</h2>' + days.map(day => `
    <button class="day-card ${day.d === Number(activeDay.replace('d', '')) ? 'active' : ''}" type="button" data-day="${day.d}">
      <div class="day-top"><span class="day-no">DAY ${day.d}</span><span class="date">${day.date} · ${day.drive}</span></div>
      <div class="route-title">${day.title}</div>
      <div class="meta">
        <span class="pill ${day.risk === 'heavy' ? 'heavy' : ''}">${day.km}</span>
        <span class="pill ${day.risk === 'heavy' ? 'heavy' : ''}">${day.drive}</span>
        <span class="pill ${day.spotLevel === 'A' ? 'level-a' : day.spotLevel === 'B' ? 'level-b' : 'level-d'}">重点 ${day.spotLabel}</span>
      </div>
      <div class="small">${day.note}</div>
    </button>
  `).join('');
  document.querySelectorAll('[data-day]').forEach(btn => btn.addEventListener('click', () => activateDay(Number(btn.dataset.day))));
}

function renderRoutes() {
  routeCards.innerHTML = routes.map(route => `
    <button class="compare-card ${route.id === activeRoute ? 'active' : ''}" type="button" data-route="${route.id}">
      <h3>${route.title}</h3>
      <div class="score"><span>综合匹配</span><div class="bar"><span style="width:${route.score}%"></span></div></div>
      <div class="score"><span>休息友好</span><div class="bar warn"><span style="width:${route.rest}%"></span></div></div>
      <div class="score"><span>文化价值</span><div class="bar"><span style="width:${route.culture}%"></span></div></div>
      <div class="score"><span>选购便利</span><div class="bar"><span style="width:${route.shopping}%"></span></div></div>
      <ul class="clean"><li>${route.text}</li></ul>
    </button>
  `).join('');
  document.querySelectorAll('[data-route]').forEach(btn => btn.addEventListener('click', () => selectRoute(btn.dataset.route)));
}

function renderHotels() {
  hotelCardsPanel.innerHTML = window.JDZ_ITINERARY_DATA.hotelCards.map(card => `
    <div class="hotel-card"><h3>${card.title}</h3><ul class="clean"><li>${card.body}</li></ul></div>
  `).join('');
}

function renderDetailForDay(day) {
  detailPanel.innerHTML = `
    <button class="detail-close" id="detailClose" type="button" aria-label="关闭详情">×</button>
    <div class="detail-head">
      <div class="detail-kicker">DAY ${day.d} · ${day.date}</div>
      <h2 class="detail-title">${day.title}</h2>
      <div class="meta"><span class="pill ${day.spotLevel === 'A' ? 'level-a' : day.spotLevel === 'B' ? 'level-b' : 'level-d'}">景点 ${day.spotLevel}</span><span class="pill ${day.energyStatus === 'safe' ? 'energy-safe' : 'energy-watch'}">${day.energyLabel}</span></div>
    </div>
    <div class="detail-body">
      <div class="detail-metrics">
        <div class="detail-metric"><span>晨间精力</span><strong>${day.energyStart}</strong></div>
        <div class="detail-metric"><span>晚间精力</span><strong>${day.energyEnd}</strong></div>
        <div class="detail-metric"><span>次晨恢复</span><strong>${day.energyNext}</strong></div>
      </div>
      <div class="detail-section"><h3>执行安排</h3>${day.driveBreakdown.map(item => `<p>${item.label}：${item.km} · ${item.time}</p>`).join('')}</div>
      <div class="detail-section"><h3>当天判断</h3><p>${day.note}</p></div>
      <div class="detail-section"><h3>住宿</h3><p>${day.hotel}${day.booked ? '｜已订' : '｜待确认/待订'}</p></div>
    </div>
  `;
  detailPanel.classList.add('active');
  document.getElementById('detailClose').addEventListener('click', () => detailPanel.classList.remove('active'));
}

function renderSpotDetail(id) {
  const spot = spotDetails[Object.keys(spotDetails).find(key => Number(key) === id)];
  if (!spot) return;
  detailPanel.innerHTML = `
    <button class="detail-close" id="detailClose" type="button" aria-label="关闭详情">×</button>
    <div class="detail-head">
      <div class="detail-kicker">当前节点</div>
      <h2 class="detail-title">${spot.name}</h2>
    </div>
    <div class="detail-body">
      <div class="detail-section"><h3>说明</h3><p>${spot.summary}</p></div>
      <div class="detail-section"><h3>建议时间</h3><p>${spot.time}</p></div>
      <div class="detail-section"><h3>执行建议</h3><p>${spot.tip}</p></div>
    </div>
  `;
  detailPanel.classList.add('active');
  document.getElementById('detailClose').addEventListener('click', () => detailPanel.classList.remove('active'));
}

function selectSpot(id) {
  currentSpot = id;
  renderSpotDetail(Object.keys(points).indexOf(id) + 1);
  routeStatus.className = 'route-status ok';
  routeStatus.textContent = `当前节点：${markerMeta.find(item => item[0] === id)?.[1] || id}`;
}

function activateDay(dayNo) {
  activeDay = `d${dayNo}`;
  document.querySelectorAll('.day-card').forEach(card => card.classList.toggle('active', Number(card.dataset.day) === dayNo));
  const day = days.find(item => item.d === dayNo);
  if (!day) return;
  renderDetailForDay(day);
  map.flyTo(day.coord, day.d === 1 ? 13 : day.d === 2 ? 12 : 12, { duration: 0.8 });
  markers[dayNo - 1].openTooltip();
}

function selectRoute(id) {
  activeRoute = id;
  renderRoutes();
  const route = routes.find(item => item.id === id);
  routeStatus.className = 'route-status ok';
  routeStatus.textContent = `当前路线方案：${route.title}`;
  updateCopyBox();
}

function updateCopyBox() {
  const route = routes.find(item => item.id === activeRoute);
  copyBox.textContent = `景德镇周末路书：周五 19:00 从上海坐火车出发，约 4 小时后到达景德镇北站，入住景德镇假日酒店（昌江大道陶溪川文创孵化中心A座）。周六主线为中国陶瓷博物馆 → 景德镇陶瓷研究院 / 新厂西路节点 → 御窑厂国家考古遗址公园 → 陶溪川文创街区，晚饭放在陶溪川附近。周日上午轻量补充三宝国际陶艺村，午后返沪。当前路线方案：${route.title}。`;
}

function updateProgress() {
  const checks = [...document.querySelectorAll('[data-check]')];
  const done = checks.filter(i => i.checked).length;
  document.getElementById('progressText').textContent = `${done}/${checks.length}`;
  try {
    localStorage.setItem('jdz-checks', JSON.stringify(Object.fromEntries(checks.map(i => [i.dataset.check, i.checked]))));
  } catch (err) {}
}

function restoreChecks() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('jdz-checks') || '{}'); } catch (err) { saved = {}; }
  document.querySelectorAll('[data-check]').forEach(input => {
    input.checked = Boolean(saved[input.dataset.check]);
    input.addEventListener('change', updateProgress);
  });
  updateProgress();
}

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(i => i.classList.toggle('active', i === tab));
  panels.forEach(p => p.classList.toggle('active', p.id === tab.dataset.tab));
}));

document.getElementById('btnRoad').addEventListener('click', () => {
  map.removeLayer(gaodeSat);
  gaodeRoad.addTo(map);
  document.getElementById('btnRoad').classList.add('active');
  document.getElementById('btnSat').classList.remove('active');
  routeStatus.className = 'route-status ok';
  routeStatus.textContent = '高德路网已加载。';
});
document.getElementById('btnSat').addEventListener('click', () => {
  map.removeLayer(gaodeRoad);
  gaodeSat.addTo(map);
  document.getElementById('btnSat').classList.add('active');
  document.getElementById('btnRoad').classList.remove('active');
  routeStatus.className = 'route-status ok';
  routeStatus.textContent = '高德卫星已加载。';
});
document.getElementById('btnFit').addEventListener('click', () => map.fitBounds(mainLine.getBounds(), { padding: [30, 30] }));
document.getElementById('btnTopFit').addEventListener('click', () => map.fitBounds(mainLine.getBounds(), { padding: [30, 30] }));
document.getElementById('copyBtn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBox.textContent);
    routeStatus.className = 'route-status ok';
    routeStatus.textContent = '交接摘要已复制。';
  } catch (error) {
    routeStatus.className = 'route-status warn';
    routeStatus.textContent = '复制失败，请手动复制摘要。';
  }
});

renderDays();
renderRoutes();
renderHotels();
restoreChecks();
activateDay(1);
selectRoute('recommended');
updateCopyBox();
loadAmapDrivingRoutes();
