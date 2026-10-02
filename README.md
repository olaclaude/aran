# 🏔 Val d'Aran en calma — 5–9 octubre 2026

Guía personal del viaje al **Val d'Aran** para dos personas: plan día a día, rutas cortas, enlaces directos de coche y senderismo, aparcamientos, cenas, plan B y una web móvil.

## Estructura

```
aran/
├── index.html
├── css/styles.css
├── js/app.js
├── assets/
│   ├── photos/             # fotos del viaje
│   └── maps/               # mapas SVG general + días 1–4
├── presentacion/
│   └── Val_dAran_5-9_octubre.pptx
├── apps-script/Code.gs
└── README.md
```

## Web

La web es HTML/CSS/JS estático y está preparada para GitHub Pages.

En GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.

## Fotos compartidas

Hay dos opciones previstas en `js/app.js`:

- `photosFormUrl`: formulario de Google con subida de archivos.
- `photoUploadApi`: endpoint opcional de Google Apps Script.

`apps-script/Code.gs` contiene la opción avanzada para guardar automáticamente las fotos en subcarpetas `dia-1` … `dia-4`.

No pongas URLs privadas ni IDs sensibles de Drive en un repositorio público.

## Calendario

Los botones de cada día generan enlaces de Google Calendar con las fechas del 5 al 8 de octubre de 2026.

## Viaje

- Base: Salardú.
- Día 1 · lunes 5: llegada, Camin dera Bruisha y Tredòs.
- Día 2 · martes 6: Era Artiga de Lin, Uelhs deth Joèu y Arties.
- Día 3 · miércoles 7: Saut deth Pish y Vielha.
- Día 4 · jueves 8: Bassa d'Oles, Bagergue y Garòs.
- Viernes 9: check-out y continuación del viaje hasta el día 15.

## Estado

El repositorio se está preparando para que **Arena pueda trabajar directamente sobre GitHub**, sin depender del ZIP adjunto al Issue #1.

Los mapas y la estructura web ya están dentro del repositorio. Las fotografías y el PPTX original siguen siendo binarios del proyecto y no se han sustituido por versiones inventadas.

