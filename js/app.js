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
    addStep(steps, "Mañana · coche", "Sant Feliu de Guíxols → alojamiento en Salardú", mapsRoute(CONFIG.home, CONFIG.hotel), "step-button primary");
    addStep(steps, "Antes de salir", "Guardar las 4 rutas y el mapa offline en Wikiloc", null);
    return;
  }

  if (date.getTime() === preTrip.getTime()) {
    button.href = "#hoy";
    button.textContent = "Abrir ruta al alojamiento ↓";
    note.textContent = "Hoy: salida desde Sant Feliu de Guíxols → Salardú.";
    title.textContent = "HOY · salida al Val d'Aran";
    summary.textContent = "Primero el coche. Al llegar, check-in y descanso. La ruta de senderismo corresponde al Día 1.";
    steps.innerHTML = "";
    addStep(steps, "Coche", "Sant Feliu de Guíxols → Carretera de Bagergue, 3, Salardú", mapsRoute(CONFIG.home, CONFIG.hotel), "step-button primary");
    addStep(steps, "Al llegar", "Check-in, descanso y después Camin dera Bruisha", CONFIG.days[0].wikiloc, "step-button");
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
      addStep(steps, "Al llegar", "Check-in y paseo corto a pie", day.wikiloc, "step-button primary");
    } else {
      addStep(steps, "Después del desayuno · coche", "Salardú → " + day.location, day.drive, "step-button primary");
      addStep(steps, "Después del coche · ruta", "Abrir el track de Wikiloc", day.wikiloc, "step-button");
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
  wireServiceWorker();
});
