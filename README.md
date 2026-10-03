# 🏔 Val d'Aran en calma — 5–9 octubre 2026

Guía personal del viaje al **Val d'Aran** para dos personas: plan día a día, rutas cortas, enlaces directos de coche y senderismo, aparcamientos, cenas, plan B y una web móvil.

## Estructura

```
aran/
├── index.html
├── css/styles.css
├── js/app.js
├── sw.js                  # service worker (guía usable sin conexión)
├── manifest.webmanifest   # para instalarla en el móvil
├── assets/
│   ├── icon.svg           # icono de la app
│   ├── photos/            # fotos del viaje (pendientes · ver assets/photos/README.md)
│   └── maps/               # mapas SVG general + días 1–4
├── apps-script/Code.gs
└── README.md
```

Fuera del repositorio (binarios originales del proyecto, no versionados a propósito):
`presentacion/Val_dAran_5-9_octubre.pptx` y las fotografías originales.

## Web

La web es HTML/CSS/JS estático y se publica desde la rama `main` en Vercel. La URL de producción actual es `https://aran-blue.vercel.app`.

## Sin conexión (PWA)

`sw.js` precarga la guía (HTML, CSS, JS y mapas) para abrirla sin cobertura en la montaña:
las páginas se actualizan desde la red con reserva a la caché y los estáticos se sirven
primero desde la caché. `manifest.webmanifest` + `assets/icon.svg` permiten instalarla en el
móvil desde el navegador («Añadir a pantalla de inicio»). Si cambias la lista de archivos
precargados, sube la versión `CACHE` de `sw.js`.

## Fotos

Las fotos ilustrativas de la web viven en `assets/photos/` con un nomenclador fijo
(`cover.jpg`, `day1-1.jpg` … `day4-3.jpg`, `closing.jpg`). Mientras no existan, la web muestra
un marcador «Foto pendiente de incorporar al proyecto» y el hero degrada a su degradado verde.
El detalle de cada archivo está en [`assets/photos/README.md`](assets/photos/README.md).

## Fotos compartidas

Hay dos opciones previstas en `js/app.js`:

- `photosFormUrl`: formulario de Google con subida de archivos.
- `photoUploadApi`: endpoint opcional de Google Apps Script, protegido con `photoUploadToken`.
- `driveFolderUrl`: carpeta compartida — se muestra en «Cómo usar» y se abre tras subir fotos.

`apps-script/Code.gs` contiene la opción avanzada para guardar automáticamente las fotos en subcarpetas `dia-1` … `dia-4`. El token (`SHARED_TOKEN` allí, `photoUploadToken` aquí) debe ser el mismo: protege el endpoint frente a subidas ajenas si la URL se filtra.

No pongas URLs privadas ni IDs sensibles de Drive en un repositorio público.

## Calendario

Los botones de cada día generan enlaces de Google Calendar con las fechas del 5 al 8 de octubre de 2026. La portada detecta automáticamente la fecha y abre el bloque «Hoy».

## Viaje

- Base: Salardú.
- Día 1 · lunes 5: llegada, Camin dera Bruisha y Tredòs.
- Día 2 · martes 6: Era Artiga de Lin, Uelhs deth Joèu y Arties.
- Día 3 · miércoles 7: Saut deth Pish y Vielha.
- Día 4 · jueves 8: Bassa d'Oles, Bagergue y Garòs.
- Viernes 9: check-out y continuación del viaje hasta el día 15.

## Estado

El repositorio se está preparando para que **Arena pueda trabajar directamente sobre GitHub**, sin depender del ZIP adjunto al Issue #1.

Los mapas y la estructura web ya están dentro del repositorio. Las fotografías y el PPTX original son binarios personales: no se versionan ni se han sustituido por versiones inventadas; su hueco y nomenclador están documentados en `assets/photos/README.md`.



## Flujo de uso en el viaje

1. **Hoy / salida:** la portada muestra automáticamente qué toca y, antes del viaje, el botón directo de Google Maps desde Sant Feliu de Guíxols al alojamiento en Salardú.
2. **Cada mañana:** después del desayuno, el bloque del día muestra primero **Ir al parking en coche** y después **Abrir Wikiloc · ruta**.
3. **Sin cobertura:** la propia web queda disponible con la caché PWA. Los tracks de Wikiloc se deben guardar previamente en la app de Wikiloc como «Disponible offline» junto con el mapa offline de la zona.
4. **No se descargan automáticamente tracks de terceros:** la web solo conserva los enlaces directos a las rutas seleccionadas.
