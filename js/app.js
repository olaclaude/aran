/* Val d'Aran en calma — configuración y comportamiento */
const CONFIG = {
  // OPCIÓN A (recomendada): enlace de tu formulario de Google con subida de archivos.
  // Crear en forms.google.com → Enviar → enlace. Ver README, paso 4.
  photosFormUrl: "",

  // OPCIÓN B (avanzada): URL de una app web de Google Apps Script que sube las fotos
  // directamente a una carpeta de Drive. Ver apps-script/Code.gs y el README.
  photoUploadApi: "",

  // Carpeta de Drive compartida que veréis los dos (enlace normal, no de edición).
  driveFolderUrl: "",

  days: [
    { n: 1, start: "20261005", end: "20261006", title: "Llegada y Camin dera Bruisha",
      details: "Check-in en Salardú. Paseo circular Cami de les Bruixes (~2 km llano) y Salto de Tredós. Cena: Terrasseta dera Bruisha (Tredòs).",
      location: "Salardú, Naut Aran" },
    { n: 2, start: "20261006", end: "20261007", title: "Era Artiga de Lin y Arties",
      details: "Parking Uelhs deth Joèu (pista desde Es Bòrdes). Circular 3 km · 90 m · 1 h 10. Tarde: Arties.",
      location: "Es Bòrdes / Artiga de Lin" },
    { n: 3, start: "20261007", end: "20261008", title: "Saut deth Pish y Vielha",
      details: "Plan des Artiguetes (12 km de pista desde Pont d'Arròs). Paseo 1,2 km. Tarde en Vielha; cena Sidreria Era Bruisha (reserva).",
      location: "Plan des Artiguetes / Vielha" },
    { n: 4, start: "20261008", end: "20261009", title: "Bassa d'Oles, Bagergue y Garòs",
      details: "Parking Bassa d'Oles desde Gausac. Circular 1,2 km llano. Plan completo o relajado (Bassа + solo Bagergue).",
      location: "Bassa d'Oles / Bagergue" },
  ],
};

function wireUploads() {
  const hasApi = !!CONFIG.photoUploadApi;
  const hasForm = !!CONFIG.photosFormUrl;
  document.querySelectorAll("[data-upload]").forEach((el) => {
    if (hasApi) {
      el.setAttribute("href", "#");
      el.addEventListener("click", (ev) => { ev.preventDefault(); pickAndUpload(); });
    } else if (hasForm) {
      el.setAttribute("href", CONFIG.photosFormUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    } else {
      el.setAttribute("href", "#como");
      el.setAttribute("title", "Falta configurar el formulario de fotos (ver README)");
      el.classList.add("needs-config");
    }
  });
  if (!hasApi && !hasForm) showConfigBanner();
}

function showConfigBanner() {
  const b = document.createElement("div");
  b.style.cssText =
    "position:fixed;left:12px;bottom:12px;z-index:99;background:#123a2c;color:#fff;" +
    "padding:10px 16px;border-radius:12px;font-size:.85rem;box-shadow:0 4px 14px rgba(0,0,0,.3);max-width:320px";
  b.innerHTML =
    '📷 Falta el enlace del formulario de fotos.<br>Pégalo en <code>js/app.js</code> → <code>photosFormUrl</code> (ver README). ' +
    '<a href="#" style="color:#f5c48a" onclick="this.closest(\'div\').remove();return false">✕</a>';
  document.body.appendChild(b);
}

function pickAndUpload() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;
  input.onchange = async () => {
    for (const file of input.files) {
      const day = prompt("¿Qué día es? (1, 2, 3 o 4)", "1") || "1";
      await uploadPhoto(file, day);
    }
    alert("¡Fotos subidas! Ya las veréis los dos en Drive.");
  };
  input.click();
}

async function uploadPhoto(file, day) {
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  const payload = {
    image: dataUrl.split(",")[1],
    contentType: file.type,
    name: `dia${day}-${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`,
  };
  const r = await fetch(CONFIG.photoUploadApi, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("Error al subir " + file.name);
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

document.addEventListener("DOMContentLoaded", () => {
  wireUploads();
  wireCalendar();
  wireNav();
});