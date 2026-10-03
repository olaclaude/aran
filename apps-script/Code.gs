/**
 * Val d'Aran · Fotos del día — endpoint opcional para subir fotos a Drive
 * desde la web personal (Opción B de los usuarios de fotos).
 *
 * Pasos rápidos:
 *  1. Crea una carpeta en Drive para las fotos y compártela con tu pareja.
 *  2. Pega ese ID de carpeta en FOLDER_ID de abajo.
 *  3. script.google.com → proyecto nuevo → pega este archivo.
 *     Activaciones → Implementar → Nueva implementación → Aplicación web:
 *     ejecutar como: "Yo" · acceso: "Cualquier usuario".
 *  4. Copia la URL /exec y pégala en js/app.js → CONFIG.photoUploadApi.
 *  5. Cambia SHARED_TOKEN abajo y repite el mismo valor en js/app.js →
 *     CONFIG.photoUploadToken (protege el endpoint frente a subidas ajenas).
 *
 * Nota: la Opción A (formulario de Google) es la vía recomendada por Google
 * para subidas desde usuarios no autenticados. Esta Opción B da más control
 * (nombre y subcarpeta por día), pero la URL del endpoint debe tratarse como
 * privada: no la publiques en un repo público.
 */

const FOLDER_ID = "PEGA_AQUI_EL_ID_DE_LA_CARPETA";

// Token compartido con la web (js/app.js → CONFIG.photoUploadToken).
// Cámbialo por una frase larga al azar: evita subidas ajenas si la URL se filtra.
const SHARED_TOKEN = "PEGA_AQUI_UN_TOKEN_SECRETO";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.token !== SHARED_TOKEN) {
      return json({ ok: false, error: "token inválido" });
    }
    const bytes = Utilities.base64Decode(data.image);
    const blob = Utilities.newBlob(bytes, data.contentType || "image/jpeg", data.name || "foto.jpg");
    const root = DriveApp.getFolderById(FOLDER_ID);
    const m = /^dia(\d)/.exec(data.name || "");
    const folder = m ? getSubfolder(root, "dia-" + m[1]) : root;
    const file = folder.createFile(blob);
    return json({ ok: true, name: file.getName(), url: file.getUrl() });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, service: "val-daran-fotos" });
}

function getSubfolder(parent, name) {
  const it = parent.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return parent.createFolder(name);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}