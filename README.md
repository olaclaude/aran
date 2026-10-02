# 🏔 Val d'Aran en calma — 5–9 octubre 2026

Guía personal del viaje de dos personas al **Val d'Aran**: plan día a día con fotos,
rutas cortas y llanas, enlaces directos de coche y senderismo, aparcamientos,
cenas, plan B y una web para que **tú y Mariina subáis las fotos del día a la
misma carpeta de Drive**.

---

## 📁 Estructura del repo

```
val-daran-viaje/
├── index.html              # la web (guía día a día)
├── css/styles.css          # estilos
├── js/app.js               # ← CONFIGURACIÓN (fotos, calendario)
├── assets/
│   ├── photos/             # tus fotos de cada día (sustituir los placeholders)
│   └── maps/               # mapas SVG: general + día 1–4
├── presentacion/           # espacio para la presentación .pptx
├── apps-script/
│   └── Code.gs             # subida directa a Drive (Opción B)
└── README.md
```

## 🚀 1. Publicar la web (GitHub Pages)

En el repo de GitHub: **Settings → Pages → Source: Deploy from a branch**.
Rama `main`, carpeta `/ (root)` → **Save**. En un minuto la web estará en
`https://<tu-usuario>.github.io/aran/`.

## 📷 2. Fotos del día en Drive compartido

La web está preparada para dos opciones:

- **Opción A (recomendada):** crea un formulario en `forms.google.com` que
  acepte subida de archivos y pega su enlace en `js/app.js` →
  `photosFormUrl`. Fácil y seguro.
- **Opción B (avanzada):** despliega `apps-script/Code.gs` como app web
  (ejecutar como *Yo*, acceso *Cualquier usuario*), pon un SECRET y pega la
  URL `/exec?key=TU_SECRETO` en `js/app.js` → `photoUploadApi`. Sube cada
  foto directamente a una subcarpeta por día (`dia-1`, `dia-2`…).

En cualquier caso, pega el enlace público de la carpeta de Drive en
`driveFolderUrl` para que el botón "Ver carpeta de Drive" funcione.

Mientras no configures nada, la web muestra un aviso en la esquina inferior
y los botones llevan a la sección de ayuda; no hay errores.

## 📅 3. Añadir al calendario

Cada día tiene un botón 📅 que abre Google Calendar con el evento
pre-rellenado (fechas, título, ubicación y detalles).

## 🖼 4. Fotos

Sustituye los placeholders de colores de cada día en `index.html` por una
imagen real en `assets/photos/` (p. ej. `assets/photos/dia1.jpg`). Hay una
regla preparada en `css/styles.css` para que se vean bien cubriendo el
hueco (object-fit: cover).

## 🛠 5. Cómo editar la web

- **Textos y fotos**: `index.html`.
- **Fechas, enlaces y destinos**: `js/app.js`, objeto `CONFIG`.
- **Colores**: variables `--moss`, `--ochre`, `--cream`… al principio de `css/styles.css`.

---

## 📚 Fuentes

visitvaldaran.com · rutaspirineos.org · wikiloc · turismo de la Vall d'Aran ·
Parc Nacional d'Aigüestortes i Estany de Sant Maurici.

*Hecha con calma, para dos 🤍*
