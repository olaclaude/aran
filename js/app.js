/* Val d'Aran en calma — comportamiento móvil y planning automático */
const CONFIG = {
  home: "Sant Feliu de Guíxols, Girona",
  hotel: "Carretera de Bagergue, 3, Salardú, Lleida",
  days: [
    { n: 1, start: "20261005", end: "20261006", title: "Llegada y Camin dera Bruisha",
      summary: "Llegada a Salardú, check-in, descanso y paseo corto por Camin dera Bruisha + Tredòs.",
      location: "Salardú, Naut Aran",
      wikiloc: "https://es.wikiloc.com/rutas-a-pie/cami-de-les-bruixes-tredos-257821166" },
    { n: 2, start: "20261006", end: "20261007", title: "Era Artiga de Lin y Arties",
      summary: "Después del desayuno: coche hasta Uelhs deth Joèu / Era Artiga de Lin. Después, vuelta y tarde tranquila en Arties.",
      location: "Es Bòrdes / Uelhs deth Joèu",
      wikiloc: "https://es.wikiloc.com/rutas-senderismo/artiga-de-lin-y-ojos-del-judio-valle-de-aran-56318346",
      drive: "https://www.google.com/maps/dir/?api=1&origin=Salard%C3%BA&destination=Uelhs%20deth%20Jo%C3%A8u&waypoints=Es%20B%C3%B2rdes&travelmode=driving" },
    { n: 3, start: "20261007", end: "20261008", title: "Saut deth Pish y Vielha",
      summary: "Después del desayuno: coche hasta Plan des Artiguetes. Ruta al Saut deth Pish, vuelta al alojamiento y tarde en Vielha.",
      location: "Plan des Artiguetes / Vielha",
      wikiloc: "https://es.wikiloc.com/rutas-a-pie/eth-saut-deth-pish-54557739",
      drive: "https://www.google.com/maps/dir/?api=1&origin=Salard%C3%BA&destination=Plan%20des%20Artiguetes&travelmode=driving" },
    { n: 4, start: "20261008", end: "20261009", title: "Bassa d'Oles, Bagergue y Garòs",
      summary: "Después del desayuno: coche hasta Bassa d'Oles. Paseo del lago y, por la tarde, Bagergue + Garòs.",
      location: "Bassa d'Oles / Bagergue",
      wikiloc: "https://es.wikiloc.com/rutas-senderismo/lago-bassa-109524333",
      drive: "https://www.google.com/maps/dir/?api=1&origin=Salard%C3%BA&destination=Bassa%20d%27Oles&travelmode=driving" },
  ]
};

function mapsRoute(origin, destination) {
  return "https://www.google.com/maps/dir/?api=1" +
    "&origin=" + encodeURIComponent(origin) +
    "&destination=" + encodeURIComponent(destination) +
    "&travelmode=driving";
}

function iconEl(id) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "ico");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#i-" + id);
  svg.appendChild(use);
  return svg;
}

function cleanLabel(label) {
  return label.replace(/^\s*\p{Extended_Pictographic}\uFE0F?\s*/u, "");
}

function addStep(container, label, text, href, cls = "") {
  const row = document.createElement("div");
  row.className = "trip-step";
  const copy = document.createElement("div");
  const labelEl = document.createElement("span");
  labelEl.textContent = cleanLabel(label);
  const strong = document.createElement("strong");
  strong.textContent = text;
  copy.append(labelEl, strong);
  row.appendChild(copy);
  if (href) {
    /* «Después del coche» es el paso a pie: el coche se marca con 🚗, no con la palabra. */
    const drive = label.includes("🚗");
    const a = document.createElement("a");
    a.className = cls || "step-button";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.append(iconEl(drive ? "car" : "boot"), document.createTextNode(drive ? "Ir en coche" : "Abrir Wikiloc"));
    row.appendChild(a);
  }
  container.appendChild(row);
}

function markJourney(key) {
  document.querySelectorAll("[data-journey]").forEach((a) => {
    const on = key && a.dataset.journey === String(key);
    a.classList.toggle("is-now", on);
    if (on) a.setAttribute("aria-current", "date");
    else a.removeAttribute("aria-current");
  });
}

function setCount(text) {
  const el = document.querySelector("#todayCount");
  if (!el) return;
  el.hidden = !text;
  el.textContent = text || "";
}

function getAppDate() {
  const forced = new URLSearchParams(window.location.search).get("fecha");
  if (/^\d{4}-\d{2}-\d{2}$/.test(forced)) {
    const y = Number(forced.slice(0, 4));
    const m = Number(forced.slice(5, 7));
    const d = Number(forced.slice(8, 10));
    const candidate = new Date(y, m - 1, d);
    if (candidate.getFullYear() === y && candidate.getMonth() === m - 1 && candidate.getDate() === d) return candidate;
  }
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return new Date(Number(get("year")), Number(get("month")) - 1, Number(get("day")));
}

function getAppDateISO() {
  const d = getAppDate();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

function wireToday() {
  const button = document.querySelector("#todayButton");
  const note = document.querySelector("#todayNote");
  const title = document.querySelector("#todayTitle");
  const summary = document.querySelector("#todaySummary");
  const steps = document.querySelector("#todaySteps");
  if (!button || !title || !summary || !steps) return;

  const date = getAppDate();
  const preTrip = new Date("2026-10-04T00:00:00");
  const tripStart = new Date("2026-10-05T00:00:00");
  const tripEnd = new Date("2026-10-08T00:00:00");

  document.querySelectorAll(".day").forEach(el => el.classList.remove("is-today"));

  if (date < preTrip) {
    button.href = "#hoy";
    button.textContent = "Ver la salida de mañana ↓";
    note.textContent = "Mañana: salida hacia el alojamiento en Salardú.";
    title.textContent = "Hoy · preparar la salida";
    summary.textContent = "Mañana salís desde Sant Feliu de Guíxols. Dejad Wikiloc preparado antes de salir.";
    const untilLeave = Math.round((preTrip - date) / 86400000);
    setCount(untilLeave === 1 ? "La salida es mañana" : "Faltan " + untilLeave + " días para salir");
    markJourney("");
    steps.innerHTML = "";
    addStep(steps, "🚗 Mañana · coche", "Sant Feliu de Guíxols → alojamiento en Salardú", mapsRoute(CONFIG.home, CONFIG.hotel), "step-button primary");
    addStep(steps, "🥾 Antes de salir", "Guardar las 4 rutas y el mapa offline en Wikiloc", null);
    return;
  }

  if (date.getTime() === preTrip.getTime()) {
    button.href = "#hoy";
    button.textContent = "Abrir ruta al alojamiento ↓";
    note.textContent = "Hoy: salida desde Sant Feliu de Guíxols → Salardú.";
    title.textContent = "HOY · salida al Val d'Aran";
    summary.textContent = "🚗 Salida primero. Al llegar: check-in, descanso y paseo corto.";
    setCount("Hoy es el día de salir");
    markJourney("");
    steps.innerHTML = "";
    addStep(steps, "🚗 Coche", "Sant Feliu de Guíxols → Carretera de Bagergue, 3, Salardú", mapsRoute(CONFIG.home, CONFIG.hotel), "step-button primary");
    addStep(steps, "🥾 Al llegar", "Check-in, descanso y Camin dera Bruisha", CONFIG.days[0].wikiloc, "step-button");
    addStep(steps, "🍽️ Noche", "Cena informal en Terrasseta dera Bruisha", null);
    return;
  }

  if (date >= tripStart && date <= tripEnd) {
    const n = date.getDate() - 4;
    const day = CONFIG.days[n - 1];
    if (!day) return;
    const section = document.querySelector("#dia" + n);
    if (section) section.classList.add("is-today");
    button.href = "#dia" + n;
    button.textContent = "Abrir Día " + n + " ↓";
    note.textContent = "HOY · Día " + n + " · " + day.title;
    title.textContent = "HOY · Día " + n;
    summary.textContent = day.summary;
    setCount("Día " + n + " de 4");
    markJourney(n);
    steps.innerHTML = "";

    if (n === 1) {
      addStep(steps, "🥾 Mañana", "Llegada, check-in y paseo corto a pie por Camin dera Bruisha", day.wikiloc, "step-button primary");
      addStep(steps, "☕ Después", "Vuelta al alojamiento y descanso sin prisas", null);
      addStep(steps, "🍽️ Noche", "Cena informal en Tredòs", null);
    } else if (n === 2) {
      addStep(steps, "🚗 Después del desayuno", "Salardú → Uelhs deth Joèu / Era Artiga de Lin", day.drive, "step-button primary");
      addStep(steps, "🥾 Después del coche", "Ruta circular por Artiga de Lin + Uelhs deth Joèu", day.wikiloc, "step-button");
      addStep(steps, "🍽️ Tarde", "Vuelta, ducha y paseo tranquilo por Arties", null);
    } else if (n === 3) {
      addStep(steps, "🚗 Después del desayuno", "Salardú → Plan des Artiguetes", day.drive, "step-button primary");
      addStep(steps, "🥾 Después del coche", "Ruta al Saut deth Pish", day.wikiloc, "step-button");
      addStep(steps, "🍽️ Tarde", "Vuelta, ducha y tarde/cena en Vielha", null);
    } else if (n === 4) {
      addStep(steps, "🚗 Después del desayuno", "Salardú → Bassa d'Oles", day.drive, "step-button primary");
      addStep(steps, "🥾 Después del coche", "Paseo circular por la Bassa d'Oles", day.wikiloc, "step-button");
      addStep(steps, "🍽️ Tarde", "Bagergue + Garòs · plan completo o relajado", null);
    }
    return;
  }

  button.href = "#checkout";
  button.textContent = "Ver continuación ↓";
  note.textContent = "Desde el 9 de octubre · check-out y continuación hasta el 15.";
  title.textContent = "Después del Día 4";
  summary.textContent = "Check-out y continuación del viaje hasta el 15 de octubre.";
  setCount("");
  markJourney(9);
  steps.innerHTML = "";
  addStep(steps, "Viernes 9", "Check-out · decidir la continuación según tiempo y ganas", null);
}

const WEATHER = {
  lat: 42.70,
  lon: 0.90,
  timezone: "Europe/Madrid",
  days: ["2026-10-05","2026-10-06","2026-10-07","2026-10-08"]
};

function weatherIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌦️";
  if (code <= 99) return "⛈️";
  return "🌤️";
}

function weatherLabel(code) {
  if (code === 0) return "Despejado";
  if (code <= 3) return "Intervalos nubosos";
  if (code <= 48) return "Nubes / niebla";
  if (code <= 67) return "Lluvia";
  if (code <= 77) return "Nieve";
  if (code <= 82) return "Chubascos";
  return "Tormenta";
}

const PLAN_B = {
  1: "acortar el bucle y cenar cerca",
  2: "Arties con cubiertos o Vielha",
  3: "directos a Vielha, la pista del Pish es estrecha",
  4: "Bassa d'Oles + solo Bagergue"
};

function renderRainPlan(data, widget, dayIndex) {
  if (!widget || !data?.daily?.precipitation_probability_max) return;
  const date = WEATHER.days[dayIndex - 1];
  const i = data.daily.time.indexOf(date);
  if (i < 0) return;
  const probability = Math.round(Number(data.daily.precipitation_probability_max[i]) || 0);
  let alert = widget.querySelector(".rain-plan");
  if (probability >= 60) {
    if (!alert) {
      alert = document.createElement("div");
      alert.className = "rain-plan";
      widget.appendChild(alert);
    }
    alert.textContent = "";
    const strong = document.createElement("strong");
    strong.textContent = "Lluvia probable (" + probability + "%).";
    const copy = document.createElement("span");
    copy.textContent = " Plan B: " + PLAN_B[dayIndex] + ".";
    const link = document.createElement("a");
    link.href = "#planb";
    link.textContent = " Ver Plan B";
    alert.append(strong, copy, link);
  } else if (alert) {
    alert.remove();
  }
}

function renderWeather(data, target, dayIndex) {
  const date = WEATHER.days[dayIndex - 1];
  const i = data.daily.time.indexOf(date);
  if (i < 0) return;
  const widgets = target ? [target] : [...document.querySelectorAll('.weather-widget[data-weather-day="' + dayIndex + '"]')];
  widgets.forEach(w => {
    w.querySelector(".weather-icon").textContent = weatherIcon(data.daily.weather_code[i]);
    w.querySelector(".weather-title").textContent = weatherLabel(data.daily.weather_code[i]);
    w.querySelector(".weather-min").textContent = Math.round(data.daily.temperature_2m_min[i]) + "°";
    w.querySelector(".weather-max").textContent = Math.round(data.daily.temperature_2m_max[i]) + "°";
    w.querySelector(".weather-rain").textContent = Math.round(data.daily.precipitation_probability_max[i]) + "%";
    const gust = Number(data.daily.wind_gusts_10m_max?.[i]);
    w.querySelector(".weather-gust").textContent = Number.isFinite(gust) ? Math.round(gust) + " km/h" : "—";
    renderRainPlan(data, w, dayIndex);
  });
}

const WEATHER_STORAGE_KEY = "aran:last-weather";
function saveWeatherSnapshot(data) {
  try { localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify({savedAt:new Date().toISOString(),data})); } catch {}
}
function loadWeatherSnapshot() {
  try { const s=JSON.parse(localStorage.getItem(WEATHER_STORAGE_KEY)||"null"); return s?.data?.daily?.time ? s : null; } catch { return null; }
}
function weatherAge(iso) {
  const h=Math.max(0,Math.round((Date.now()-new Date(iso).getTime())/3600000));
  return h<1 ? "menos de 1 h" : h+" h";
}
function updateWeatherSource(text) {
  document.querySelectorAll(".weather-widget").forEach(w=>{
    let el=w.querySelector(".weather-source");
    if(!el){el=document.createElement("span");el.className="weather-source";el.setAttribute("aria-live","polite");w.appendChild(el);}
    el.textContent=text;
  });
}
function renderTodayWeather(data) {
  const box=document.querySelector("#todayWeather"); if(!box) return;
  const iso=getAppDateISO();
  const idx=WEATHER.days.indexOf(iso)+1;
  if(idx>=1&&idx<=4){
    const source=document.querySelector('.weather-widget[data-weather-day="'+idx+'"]');
    if(source){const clone=source.cloneNode(true);clone.removeAttribute("data-weather-day");box.innerHTML="";box.appendChild(clone);renderWeather(data,clone,idx);}
  } else if(iso==="2026-10-04") box.innerHTML='<div class="weather-pretrip">Previsión del viaje disponible para los días 5–8. Mañana empieza el Día 1.</div>';
}

async function wireWeather() {
  const widgets = [...document.querySelectorAll(".weather-widget")];
  if (!widgets.length) return;
  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + WEATHER.lat +
    "&longitude=" + WEATHER.lon +
    "&daily=weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max,wind_gusts_10m_max" +
    "&timezone=" + encodeURIComponent(WEATHER.timezone) +
    "&start_date=2026-10-05&end_date=2026-10-08";
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("weather");
    const data = await res.json();
    saveWeatherSnapshot(data);
    widgets.forEach(w => renderWeather(data, w, Number(w.dataset.weatherDay)));
    renderTodayWeather(data);
    updateWeatherSource("Open-Meteo · actualizado ahora");
  } catch {
    const snapshot = loadWeatherSnapshot();
    if (snapshot) {
      widgets.forEach(w => renderWeather(snapshot.data, w, Number(w.dataset.weatherDay)));
      renderTodayWeather(snapshot.data);
      updateWeatherSource("Sin conexión · última previsión hace " + weatherAge(snapshot.savedAt));
    } else {
      widgets.forEach(w => {
        w.querySelector(".weather-title").textContent = "Consulta el tiempo antes de salir";
        w.querySelector(".weather-rain").textContent = "—";
      });
      updateWeatherSource("Sin conexión · sin previsión guardada");
    }

  }
}

function wireDayToggles() {
  const days = [...document.querySelectorAll(".day[id^=\"dia\"]")];
  if (!days.length) return;
  const openDay = (dayNumber) => {
    days.forEach(day => {
      const isOpen = Number(day.id.replace("dia","")) === Number(dayNumber);
      day.classList.toggle("day-open", isOpen);
      const btn = day.querySelector(".day-toggle");
      if (btn) {
        btn.setAttribute("aria-expanded", String(isOpen));
        btn.querySelector("span").textContent = isOpen ? "▴" : "▾";
        btn.firstChild.textContent = isOpen ? "Ocultar plan y ruta " : "Ver plan y ruta ";
      }
    });
  };
  days.forEach((day, index) => {
    const btn = day.querySelector(".day-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isOpen = day.classList.contains("day-open");
      if (isOpen) {
        day.classList.remove("day-open");
        btn.setAttribute("aria-expanded","false");
        btn.firstChild.textContent = "Ver plan y ruta ";
        btn.querySelector("span").textContent = "▾";
      } else {
        openDay(index + 1);
        if (location.hash !== "#" + day.id) {
          day.scrollIntoView({behavior:"smooth", block:"start"});
        }
      }
    });
  });
  const date = getAppDate();
  const appDay = date >= new Date(2026, 9, 5) && date <= new Date(2026, 9, 8)
    ? date.getDate() - 4 : 1;
  openDay(appDay);
}

function wireDayOneArrival() {
  const section = document.querySelector("#dia1");
  const firstStep = section?.querySelector(".timeline li:first-child .what");
  if (!firstStep || firstStep.querySelector(".arrival-drive")) return;
  const a = document.createElement("a");
  a.className = "step-button primary arrival-drive";
  a.href = mapsRoute(CONFIG.home, CONFIG.hotel);
  a.target = "_blank";
  a.rel = "noopener";
  a.classList.add("arrival-drive");
  a.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-car"/></svg><span>Ir al alojamiento · Google Maps</span>';
  firstStep.appendChild(a);
}
function wireMobileActionBar(dayNumber) {
  const bar = document.querySelector("#mobileActionBar");
  if (!bar) return;
  bar.innerHTML = "";
  if (!(dayNumber >= 1 && dayNumber <= 4)) {
    bar.hidden = true;
    return;
  }
  const section = document.querySelector("#dia" + dayNumber);
  const source = section?.querySelector(".route-buttons");
  if (!source) {
    bar.hidden = true;
    return;
  }
  const clone = source.cloneNode(true);
  clone.classList.add("mobile-route-buttons");
  clone.querySelectorAll("[data-cal]").forEach((el) => el.remove());
  const actionLinks = [...clone.querySelectorAll("a")];
  if (dayNumber === 1) {
    const arrival = document.createElement("a");
    arrival.href = mapsRoute(CONFIG.home, CONFIG.hotel);
    arrival.className = "primary is-drive";
    arrival.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#i-car"/></svg><span>Alojamiento</span>';
    clone.insertBefore(arrival, clone.firstChild);
  }
  const allLinks = clone.querySelectorAll("a");
  if (allLinks.length === 1) clone.classList.add("single-action");
  allLinks.forEach((a) => {
    const isDrive = a.classList.contains("is-drive");
    a.textContent = isDrive ? (dayNumber === 1 ? "Alojamiento" : "Coche") : "Wikiloc";
    a.prepend(iconEl(isDrive ? "car" : "boot"));
    a.removeAttribute("target");
    a.removeAttribute("rel");
  });
  bar.appendChild(clone);
  bar.hidden = false;
}

const CHECKLIST_KEY = "aran:offline-checklist:v1";
function wireOfflineChecklist() {
  const root = document.querySelector("#offlineChecklist");
  if (!root) return;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || "{}") || {}; } catch {}
  root.querySelectorAll("input[data-check]").forEach((input) => {
    const key = input.dataset.check;
    input.checked = saved[key] === true;
    input.addEventListener("change", () => {
      saved[key] = input.checked;
      try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(saved)); } catch {}
    });
  });
}

function updateOfflineState() {
  document.body.classList.toggle("is-offline", !navigator.onLine);
}

function wireCalendar() {
  document.querySelectorAll("[data-cal]").forEach((el) => {
    const day = CONFIG.days.find((d) => d.n === Number(el.dataset.cal));
    if (!day) return;
    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("Val d'Aran · Día " + day.n + ": " + day.title) +
      "&dates=" + day.start + "/" + day.end +
      "&details=" + encodeURIComponent(day.summary) +
      "&location=" + encodeURIComponent(day.location);
    el.setAttribute("href", url);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

function wireNav() {
  const links = [...document.querySelectorAll("nav.toc a")];
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  if (!("IntersectionObserver" in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.remove("active"));
        const a = map.get(e.target.id);
        if (a) a.classList.add("active");
        const id = e.target.id;
        document.querySelectorAll(".tabbar a, .tabbar button").forEach((t) => t.classList.remove("is-on"));
        const tab = document.querySelector('.tabbar a[href="#' + id + '"]');
        if (tab) tab.classList.add("is-on");
        const daysBtn = document.querySelector('.tabbar [data-sheet="sheet-days"]');
        const moreBtn = document.querySelector('.tabbar [data-sheet="sheet-more"]');
        if (daysBtn) daysBtn.classList.toggle("is-on", /^dia[1-4]$/.test(id));
        if (moreBtn) moreBtn.classList.toggle("is-on", ["aparcamientos", "cenas", "planb", "datos", "checkout"].includes(id));
        if (/^dia[1-4]$/.test(id)) {
          wireMobileActionBar(Number(id));
          const activeDay = document.querySelector("#" + id);
          if (activeDay && !activeDay.classList.contains("day-open")) activeDay.querySelector(".day-toggle")?.click();
        } else wireMobileActionBar(0);
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  document.querySelectorAll("section[id]").forEach((s) => obs.observe(s));
}

function wireServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

function wireChrome() {
  document.querySelectorAll(".map-frame iframe").forEach((frame) => {
    frame.addEventListener("load", () => {
      const box = frame.closest(".map-frame");
      if (box) box.classList.add("is-loaded");
    });
  });
  document.querySelectorAll(".map-lock").forEach((btn) => {
    btn.addEventListener("click", () => {
      const box = btn.closest(".map-frame");
      if (box) box.classList.add("is-live");
    });
  });

  const openers = [...document.querySelectorAll("[data-sheet]")];
  const backdrop = document.querySelector(".sheet-backdrop");
  function closeSheets() {
    document.querySelectorAll(".sheet").forEach((s) => { s.hidden = true; });
    openers.forEach((b) => b.setAttribute("aria-expanded", "false"));
    document.body.classList.remove("sheet-open");
  }
  openers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const sheet = document.getElementById(btn.getAttribute("data-sheet"));
      if (!sheet) return;
      const willOpen = sheet.hidden;
      closeSheets();
      if (willOpen) {
        sheet.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        document.body.classList.add("sheet-open");
      }
    });
  });
  if (backdrop) backdrop.addEventListener("click", closeSheets);
  document.querySelectorAll(".sheet a").forEach((a) => a.addEventListener("click", closeSheets));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSheets();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wireCalendar();
  wireDayOneArrival();
  wireDayToggles();
  wireNav();
  wireToday();
  wireOfflineChecklist();
  updateOfflineState();
  window.addEventListener("online", updateOfflineState);
  window.addEventListener("offline", updateOfflineState);
  const appDate = getAppDate();
  const appDay = appDate >= new Date(2026, 9, 5) && appDate <= new Date(2026, 9, 8) ? appDate.getDate() - 4 : 0;
  const hashDay = /^#dia[1-4]$/.test(location.hash) ? Number(location.hash.replace("#dia","")) : 0;
  wireMobileActionBar(hashDay || appDay);
  window.addEventListener("hashchange", () => {
    const n = /^#dia[1-4]$/.test(location.hash) ? Number(location.hash.replace("#dia","")) : 0;
    if (n) wireMobileActionBar(n);
  });
  wireWeather();
  wireChrome();
  wireServiceWorker();
});
