/* Val d'Aran en calma — configuración y comportamiento */
const CONFIG = {
  days: [
    { n: 1, start: "20261005", end: "20261006", title: "Llegada y Camin dera Bruisha",
      details: "Check-in en Salardú. Paseo circular Cami de les Bruixes (~2 km llano) y Salto de Tredós. Cena: Terrasseta dera Bruisha (Tredòs).",
      location: "Salardú, Naut Aran" },
    { n: 2, start: "20261006", end: "20261007", title: "Era Artiga de Lin y Arties",
      details: "Era Artiga de Lin: recorrido circular muy sencillo de 2,5–3 km entre praderas verdes. Uelhs deth Joèu y tarde tranquila en Arties.",
      location: "Es Bòrdes / Artiga de Lin" },
    { n: 3, start: "20261007", end: "20261008", title: "Saut deth Pish y Vielha",
      details: "Saut deth Pish: paseo de 1,2 km ida y vuelta y dos caídas que suman unos 25 m. Tarde en Vielha; cena Sidreria Era Bruisha (reserva).",
      location: "Plan des Artiguetes / Vielha" },
    { n: 4, start: "20261008", end: "20261009", title: "Bassa d'Oles, Bagergue y Garòs",
      details: "Bassa d'Oles: circular llano de 1,2 km. Tarde en Bagergue y parada en Garòs; también podéis hacer versión relajada.",
      location: "Bassa d'Oles / Bagergue" },
  ],
};

function wireToday() {
  const button = document.querySelector("#todayButton");
  const note = document.querySelector("#todayNote");
  if (!button) return;
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(2026, 9, 5);
  const end = new Date(2026, 9, 8);
  if (date < start) {
    button.href = "#dia1";
    button.textContent = "Ver Día 1 · llegada ↓";
    if (note) note.textContent = "Faltan pocos días · 5–9 de octubre · base en Salardú";
  } else if (date <= end) {
    const day = date.getDate() - 4;
    button.href = "#dia" + day;
    button.textContent = "Ver el plan de hoy ↓";
    if (note) note.textContent = "Hoy: Día " + day + " · abre el itinerario y sigue el ritmo tranquilo";
  } else {
    button.href = "#checkout";
    button.textContent = "Ver continuación ↓";
    if (note) note.textContent = "Desde el día 9 · check-out y continuación hasta el día 15";
  }
}

function wireImageFallbacks() {
  document.querySelectorAll(".photos img, .closestrip img").forEach((img) => {
    img.addEventListener("error", () => {
      const parent = img.parentElement;
      if (!parent || parent.dataset.fallbackDone) return;
      parent.dataset.fallbackDone = "1";
      img.remove();
      const ph = document.createElement("div");
      ph.className = "photo-placeholder";
      ph.textContent = "Foto pendiente de incorporar al proyecto";
      parent.insertBefore(ph, parent.firstChild);
    }, { once: true });
  });
}

function wireCalendar() {
  document.querySelectorAll("[data-cal]").forEach((el) => {
    const day = CONFIG.days.find((d) => d.n === Number(el.dataset.cal));
    if (!day) return;
    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(`Val d'Aran · Día ${day.n}: ${day.title}`) +
      "&dates=" + day.start + "/" + day.end +
      "&details=" + encodeURIComponent(day.details) +
      "&location=" + encodeURIComponent(day.location);
    el.setAttribute("href", url);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

function wireNav() {
  const links = [...document.querySelectorAll("nav.toc a")];
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => a.classList.remove("active"));
          const a = map.get(e.target.id);
          if (a) a.classList.add("active");
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );
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
  wireImageFallbacks();
  wireServiceWorker();
});