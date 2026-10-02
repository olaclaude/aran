# 🏔 Val d'Aran en calma — 5–9 octubre 2026

Guía personal del viaje de dos personas al **Val d'Aran**: plan día a día con fotos,
rutas cortas y llanas, enlaces directos de coche y senderismo, aparcamientos,
cenas, plan B y una web para que **tú y Mariina subáis las fotos del día a la
misma carpeta de Drive**.

Incluye además la **presentación** (`presentacion/Val_dAran_5-9_octubre.pptx`),
13 diapositivas con los mismos enlaces y códigos QR.

---

## 📁 Estructura del repo

```
val-daran-viaje/
├── index.html              # la web (guía día a día)
├── css/styles.css          # estilos
├── js/app.js               # ← CONFIGURACIÓN (fotos, calendario)
├── assets/
│   ├── photos/             # fotos de cada día (14)
│   └── maps/               # mapas SVG: general + día 1–4
├── presentacion/
│   └── Val_dAran_5-9_octubre.pptx
├── apps-script/
│   └── Code.gs             # subida directa a Drive (opción avanzada)
└── README.md
```

## 🚀 1. Crear el repositorio en GitHub y subir el proyecto

El proyecto está preparado para publicarse como sitio estático.

## 🌐 2. Publicar la web (GitHub Pages)

En el repo: **Settings → Pages → Source: Deploy from a branch**.
Rama `main`, carpeta `/ (root)` → **Save**.

## 📷 3. Fotos del día en Drive compartido

La web admite un formulario de Google o una app web de Apps Script para que las fotos de los dos acaben en la misma carpeta de Drive.

Configura `photosFormUrl`, `photoUploadApi` y `driveFolderUrl` en `js/app.js`.

## 📅 4. Añadir al calendario

Los botones de cada día generan eventos para Google Calendar.

## 🖼 5. Presentación (PPTX)

`presentacion/Val_dAran_5-9_octubre.pptx` — presentación de la guía del viaje.

## 🛠 6. Cómo editar la web

- **Textos y fotos**: `index.html`.
- **Enlace de fotos / eventos**: `js/app.js`, objeto `CONFIG`.
- **Colores**: variables en `css/styles.css`.
- **Fotos nuevas**: súbelas a `assets/photos/`.

---

## 📚 Fuentes

visitvaldaran.com · rutaspirineos.org · wikiloc · turismo de la Vall d'Aran ·
Parc Nacional d'Aigüestortes i Estany de Sant Maurici.

*Hecha con calma, para dos 🤍*