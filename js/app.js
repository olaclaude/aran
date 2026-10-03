/* Val d'Aran en calma — comportamiento móvil y planning automático */
const CONFIG = {
  home: "Sant Feliu de Guíxols, Girona",
  hotel: "Carretera de Bagergue, 3, Salardú, Lleida",
  days: [
    { n: 1, start: "20261005", end: "20261006", title: "Llegada y Camin dera Bruisha",
      summary: "Llegada a Salardú, check-in, descanso y paseo corto por Camin dera Bruisha + Tredòs.",
      location: "Salardú, Naut Aran",
      wikiloc: "https://es.wikiloc.com/rutas-senderismo/cascada-tredos-camino-de-les-bruixes-228711408" },
    { n: 2, start: "20261006", end: "20261007", title: "Era Artiga de Lin y Arties",
      summary: "Después del desayuno: coche hasta Uelhs deth Joèu / Era Artiga de Lin. Después, vuelta y tarde tranquila en Arties.",
      location: "Es Bòrdes / Uelhs deth Joèu",
      wikiloc: "https://es.wikiloc.com/rutas-senderismo/uelhs-deth-joeu-saut-de-pomero-artiga-de-lin-circular-211891427",
      drive: "https://www.google.com/maps/dir/Salard%C3%BA/Es%20B%C3%B2rdes/Uelhs%20deth%20Jo%C3%A8u?travelmode=driving" },
    { n: 3, start: "20261007", end: "20261008", title: "Saut deth Pish y Vielha",
      summary: "Después del desayuno: coche hasta Plan des Artiguetes. Ruta al Saut deth Pish, vuelta al alojamiento y tarde en Vielha.",
      location: "Plan des Artiguetes / Vielha",
      wikiloc: "https://es.wikiloc.com/rutas-senderismo/valle-de-varrados-saut-deth-pish-desde-plan-des-artiguetes-vall-daran-143766584",
      drive: "https://www.google.com/maps/dir/Salard%C3%BA/Plan%20des%20Artiguetes?travelmode=driving" },
    { n: 4, start: "20261008", end: "20261009", title: "Bassa d'Oles, Bagergue y Garòs",
      summary: "Después del desayuno: coche hasta Bassa d'Oles. Paseo del lago y, por la tarde, Bagergue + Garòs.",
      location: "Bassa d'Oles / Bagergue",
      wikiloc: "https://es.wikiloc.com/rutas-senderismo/hormiguita-circular-bassa-d-oles-vall-d-aran-lleida-19853061",
      drive: "https://www.google.com/maps/dir/Salard%C3%BA/Bassa%20d%27Oles?travelmode=driving" },
  ]
};

function mapsRoute(origin, destination) {
  return "https://www.google.com/maps/dir/?api=1" +
    "&origin=" + encodeURIComponent(origin) +
    "&destination=" + encodeURIComponent(destination) +
    "&travelmode=driving";
}

function addStep(container, label, text, href, cls = "") {
  const row = document.createElement("div");
  row.className = "trip-step";
  const copy = document.createElement("div");
  copy.innerHTML = "<span>" + label + "</span><strong>" + text + "</strong>";
  row.appendChild(copy);
  if (href) {
    const a = document.createElement("a");
    a.className = cls || "step-button";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = label.includes("coche") ? "🚗 Ir en coche" : "🥾 Abrir Wikiloc";
    row.appendChild(a);
  }
  container.appendChild(row);
}

function wireToday() {
  const button = document.querySelector("#todayButton");
  const note = document.querySelector("#todayNote");
  const title = document.querySelector("#todayTitle");
  const summary = document.querySelector("#todaySummary");
  const steps = document.querySelector("#todaySteps");
  if (!button || !title || !summary || !steps) return;

  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const preTrip = new Date(2026, 9, 4);
  const tripStart = new Date(2026, 9, 5);
  const tripEnd = new Date(2026, 9, 8);

  document.querySelectorAll(".day").forEach(el => el.classList.remove("is-today"));

  if (date < preTrip) {
    button.href = "#hoy";
    button.textContent = "Ver la salida de mañana ↓";
    note.textContent = "Mañana: salida hacia el alojamiento en Salardú.";
    title.textContent = "Hoy · preparar la salida";
    summary.textContent = "Mañana salís desde Sant Feliu de Guíxols. Dejad Wikiloc preparado antes de salir.";
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
  });
}

async function wireWeather() {
  const widgets = [...document.querySelectorAll(".weather-widget")];
  if (!widgets.length) return;
  const url = "https://api.open-meteo.com/v1/forecast?latitude=" + WEATHER.lat +
    "&longitude=" + WEATHER.lon +
    "&daily=weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max" +
    "&timezone=" + encodeURIComponent(WEATHER.timezone) +
    "&start_date=2026-10-05&end_date=2026-10-08";
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("weather");
    const data = await res.json();
    widgets.forEach(w => renderWeather(data, w, Number(w.dataset.weatherDay)));
    const todayWeather = document.querySelector("#todayWeather");
    if (todayWeather) {
      const now = new Date();
      const iso = now.toLocaleDateString("sv-SE", {timeZone: WEATHER.timezone});
      const idx = WEATHER.days.indexOf(iso) + 1;
      if (idx >= 1 && idx <= 4) {
        const clone = widgets[idx - 1].cloneNode(true);
        clone.removeAttribute("data-weather-day");
        todayWeather.innerHTML = "";
        todayWeather.appendChild(clone);
        renderWeather(data, clone, idx);
      } else if (iso === "2026-10-04") {
        todayWeather.innerHTML = '<div class="weather-pretrip">Previsión del viaje disponible desde aquí para los días 5–8. Mañana empieza el Día 1.</div>';
      }
    }
  } catch {
    widgets.forEach(w => {
      w.querySelector(".weather-title").textContent = "Consulta el tiempo antes de salir";
      w.querySelector(".weather-rain").textContent = "—";
    });
  }
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

document.addEventListener("DOMContentLoaded", () => {
  wireCalendar();
  wireNav();
  wireToday();
  wireWeather();
  wireServiceWorker();
});
