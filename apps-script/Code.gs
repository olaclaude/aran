/**
 * Val d'Aran · Fotos del día — endpoint opcional para subir fotos a Drive
 * desde la web personal (Opción B).
 *
 * Pasos rápidos:
 *  1. Crea una carpeta en Drive para las fotos y compártela con tu pareja.
 *  2. Pega ese ID de carpeta en FOLDER_ID de abajo.
 *  3. Elige un SECRET (cualquier cadena larga) y ponlo también en js/app.js
 *     como parte de la URL: CONFIG.photoUploadApi = "https://....exec?key=TU_SECRETO"
 *  4. script.google.com → proyecto nuevo → pega este archivo.
 *     Activaciones → Implementar → Nueva implementación → Aplicación web:
 *     ejecutar como: "Yo" · acceso: "Cualquier usuario".
 *  5. Copia la URL /exec añadiendo ?key=TU_SECRETO y pégala en js/app.js.
 *
 * Nota: la Opción A (formulario de Google) es más simple y la recomendada
 * para usuarias no autenticadas. Esta Opción B da más control (subcarpetas
 * por día, nombres limpios), pero la URL debe tratarse como privada.
 */

const FOLDER_ID = "PEGA_AQUI_EL_ID_DE_LA_CARPETA";
const SECRET    = "PEGA_AQUI_UN_SECRETO_LARGO";  // debe coincidir con ?key=...
const MAX_BYTES = 10 * 1024 * 1024;              // 10 MB
const ALLOWED_TYPES = /^image\/(jpeg|png|webp|heic|heif|gif)$/;

function doPost(e) {
  try {
    // ---- Validación de secreto ----
    const key = (e.parameter && e.parameter.key) || "";
    if (SECRET && key !== SECRET) {
      return json({ ok: false, error: "no autorizado" }, 401);
    }

    const data = JSON.parse(e.postData.contents);

    // ---- Validaciones básicas ----
    if (!data.image) return json({ ok: false, error: "falta imagen" }, 400);
    if ((data.image.length * 3) / 4 > MAX_BYTES) {
      return json({ ok: false, error: "imagen demasiado grande" }, 413);
    }
    const contentType = data.contentType || "image/jpeg";
    if (!ALLOWED_TYPES.test(contentType)) {
      return json({ ok: false, error: "tipo no permitido" }, 415);
    }

    const name = sanitizeName(data.name || "foto.jpg");
    const bytes = Utilities.base64Decode(data.image);
    const blob = Utilities.newBlob(bytes, contentType, name);

    const root = DriveApp.getFolderById(FOLDER_ID);
    const m = /^dia([1-4])/i.exec(name);
    const folder = m ? getSubfolder(root, "dia-" + m[1]) : root;
    const file = folder.createFile(blob);

    return json({ ok: true, name: file.getName(), url: file.getUrl() });
  } catch (err) {
    console.error("doPost error:", err);
    return json({ ok: false, error: "error al subir" }, 500);
  }
}

function doGet(e) {
  // Health-check sin revelar detalles
  return json({ ok: true, service: "val-daran-fotos" });
}

function getSubfolder(parent, name) {
  const it = parent.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return parent.createFolder(name);
}

function sanitizeName(name) {
  // Limita longitud y elimina caracteres raros
  const clean = String(name).replace(/[^\w.\-]/g, "_").slice(0, 80);
  return clean || "foto.jpg";
}

function json(obj, status) {
  // Apps Script no permite fijar código HTTP de forma fiable en apps web,
  // así que devolvemos 200 con el código dentro del JSON.
  if (status) obj.status = status;
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
