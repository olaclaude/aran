# 🏔 Val d'Aran en calma — 5–9 octubre 2026

Guía web móvil personal para dos personas durante el viaje al **Val d'Aran**. La web está pensada para usarla desde el móvil durante el viaje, con un flujo sencillo: **Hoy → tiempo → coche → Wikiloc → ruta → tarde/noche**.

## Fuente y alcance

El proyecto se basa en la planificación del viaje preparada para los días **5–9 de octubre de 2026**, con base en **Salardú** y continuación libre del viaje hasta el día 15.

La presentación original del viaje (`Val_dAran_5-9_octubre.pptx`) es un archivo personal y **no forma parte del repositorio**. No debe reconstruirse ni sustituirse por contenido inventado.

### Plan actual

- **5 oct. · Día 1:** llegada/check-in en Salardú, Camin dera Bruisha y Tredòs.
- **6 oct. · Día 2:** Era Artiga de Lin, Uelhs deth Joèu y tarde en Arties.
- **7 oct. · Día 3:** Saut deth Pish y tarde en Vielha.
- **8 oct. · Día 4:** Bassa d'Oles, Bagergue y Garòs.
- **9 oct.:** check-out y continuación libre del viaje hasta el día 15.

## Auditoría de rutas — 3 de octubre de 2026

Se revisaron los cuatro enlaces de Wikiloc usados por la interfaz y se sustituyeron por tracks públicos que encajan mejor con las distancias y el carácter de la planificación:

- Día 1 · **Camí de les Bruixes - Tredós** — 2,304 km · fácil · circular.
- Día 2 · **Artiga de Lin y Ojos del Diablo** — 2,82 km · fácil · circular.
- Día 3 · **Eth Saut deth Pish** — 1,562 km · fácil · circular.
- Día 4 · **Lago Bassa D'Oles** — 0,835 km · fácil · circular.

Las distancias anteriores son las del track de Wikiloc enlazado, no sustituyen las cifras de la presentación original. La presentación mantiene, entre otros datos, ≈2 km para el Día 1, 2,5–3 km para el Día 2, 1,5 km/35 m para el Día 3 y 1,2 km para el Día 4. Cuando ambas fuentes no coinciden, no se debe presentar el dato del track como si fuera la cifra de la planificación.

## Arquitectura

```
aran/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── sw.js
├── manifest.webmanifest
├── assets/
│   ├── icon.svg
│   ├── illustrations/
│   │   ├── valley.jpg
│   │   └── dusk.jpg
│   ├── fonts/
│   ├── maps/          # esquemas SVG antiguos, ya no se muestran
│   └── photos/
│       └── README.md
└── README.md
```

### Archivos heredados

- `apps-script/Code.gs` es **legacy/no utilizado en el flujo actual**.
- No volver a conectar Google Apps Script, Google Drive, formularios de subida ni endpoints de fotografías salvo petición explícita.
- La galería/subida de fotografías fue retirada de la interfaz actual. `assets/photos/` queda únicamente como espacio opcional para futuros materiales; no es una dependencia de la web.
- No añadir otra vez funcionalidad de fotos por iniciativa propia.

## Publicación

La rama de trabajo y publicación es **`main`**.

La web se publica automáticamente en Vercel desde GitHub.

**Producción:** https://aran-blue.vercel.app

No trabajar sobre la rama antigua `arena/01a0fe16-aran` ni intentar fusionarla: está desfasada respecto a `main`.

## Flujo de la interfaz

La portada debe priorizar **Hoy** y funcionar como una pequeña pantalla de navegación del viaje.

### Antes del viaje

La portada muestra que el viaje todavía no ha comenzado y prepara la salida.

Para el **4 de octubre**, el flujo previsto incluye:

1. **Coche:** Google Maps desde Sant Feliu de Guíxols hasta el alojamiento en Salardú.
2. **Paseo:** Camin dera Bruisha.
3. **Cena:** referencia prevista para la primera noche.

### Durante el viaje

Para cada día activo:

1. **Tiempo**
2. **Ir al parking / punto de salida en coche** mediante Google Maps.
3. **Abrir Wikiloc · ruta** mediante enlace directo.
4. Realizar la ruta.
5. Mostrar la **tarde/noche** prevista.
6. Mantener acceso a la ficha completa del día.

La fecha actual determina automáticamente qué bloque aparece como **Hoy**.

### Después

Una vez pasado el 8 de octubre, la portada pasa al estado de **check-out / continuación del viaje**.

## Integraciones actuales

### Google Maps

La interfaz muestra **Google Maps incrustado** (lugar o valle) y enlaces directos para la navegación en coche. No dibujar mapas esquemáticos nuevos: si hace falta un mapa, es el de Google. El iframe pide conexión; el botón abre la ruta en la app.

Rutas actualmente contempladas:

- Antes del viaje: Sant Feliu de Guíxols → alojamiento en Salardú.
- Día 2: Salardú → Es Bòrdes / Uelhs deth Joèu.
- Día 3: Salardú → Plan des Artiguetes / salida hacia Saut deth Pish.
- Día 4: Salardú → Bassa d'Oles.

No convertir una ruta a pie en una ruta de coche salvo que el destino y la intención estén expresamente definidos como navegación en coche.

### Wikiloc

La web mantiene enlaces directos a las rutas seleccionadas para abrirlas en Wikiloc.

La web **no descarga ni almacena automáticamente tracks de Wikiloc**. Para disponer de navegación sin cobertura, los tracks y mapas de Wikiloc deben prepararse previamente dentro de Wikiloc según las funciones disponibles en la cuenta del usuario.

No sustituir los enlaces de Wikiloc por rutas inventadas ni generar tracks falsos.

### Tiempo

El tiempo de los días del viaje se obtiene mediante **Open-Meteo** con coordenadas de la zona del Val d'Aran y zona horaria `Europe/Madrid`.

También existe un enlace de apoyo a la predicción de montaña de **AEMET**.

Importante: el tiempo procede de un servicio externo. La PWA puede funcionar sin conexión, pero una previsión que requiera una consulta nueva a Open-Meteo no debe considerarse garantizada offline.

### Google Calendar

Los botones de cada día generan enlaces de Google Calendar para las actividades planificadas del 5 al 8 de octubre de 2026.

## PWA y modo offline

`sw.js` mantiene en caché la propia aplicación y los recursos estáticos necesarios para abrir la guía sin cobertura.

`manifest.webmanifest` + `assets/icon.svg` permiten instalar la web desde el navegador como aplicación en el móvil.

Si se añaden o eliminan recursos precargados en el service worker, actualizar la versión de `CACHE` en `sw.js`. La previsión de Open-Meteo también conserva la última respuesta correcta en la caché para consulta sin conexión.

### Límite importante del modo offline

Hay que distinguir:

- **Web propia:** puede quedar disponible mediante la caché PWA.
- **Google Maps:** los mapas de la interfaz son de Google y **no funcionan offline**. Los SVG de `assets/maps/` son un esquema antiguo y no se muestran.
- **Wikiloc:** la web solo contiene enlaces; los tracks/mapas de terceros requieren preparación previa en Wikiloc.
- **Open-Meteo:** una nueva consulta de tiempo requiere conexión salvo que se implemente explícitamente una caché local de datos meteorológicos.

No afirmar que toda la experiencia de terceros funciona offline automáticamente.

## Tiempo y fechas

La planificación está fijada para **5–8 de octubre de 2026**. La portada usa la fecha del dispositivo para decidir qué mostrar.

El código actual contempla estados especiales:

- antes del 5 de octubre;
- 4 de octubre, preparación/salida;
- 5–8 de octubre, días del viaje;
- después del 8 de octubre, check-out/continuación.

No eliminar esta lógica al modificar la portada.

## Discrepancia conocida del Día 3

La fuente original del viaje y los datos de la ruta actualmente seleccionada no coinciden completamente en algunos datos del **Saut deth Pish**.

La presentación original menciona **35 m y 1,5 km de vuelta**, mientras que la información actualmente mostrada en la web/Wikiloc utiliza otros valores de la ruta seleccionada.

**No corregir automáticamente esta discrepancia.** Antes de modificar cifras del Día 3, comprobar qué fuente debe ser la referencia definitiva.

## Diseño y UX: principios actuales

- Mobile-first, legible al sol, usable con una mano.
- La pantalla **Hoy** es prioritaria y se solapa con la portada.
- El tiempo informa, pero no domina la interfaz.
- Las acciones de navegación (**Coche** y **Wikiloc**) son elementos principales. El botón de coche es verde.
- Los mapas visibles son **Google Maps**, no esquemas dibujados.
- La portada usa una ilustración (`assets/illustrations/valley.jpg`). No volver a apuntar el fondo a `assets/photos/cover.jpg`: ese archivo no está en el repositorio.
- Las fichas completas de cada día contienen el detalle.
- No añadir complejidad innecesaria.
- No introducir login, backend, base de datos, subida de fotos o Drive si no se solicita explícitamente.

## Reglas para futuras modificaciones

Antes de cambiar código:

1. Trabajar sobre **`main`**.
2. Revisar el comportamiento actual de **Hoy** antes de sustituirlo.
3. Mantener Google Maps, Wikiloc, calendario y PWA funcionando.
4. No reintroducir fotos/Drive/Apps Script.
5. No inventar datos de rutas, distancias, alturas, horarios o restaurantes.
6. Si la fuente original y una fuente externa difieren, conservar la discrepancia y pedir/identificar la fuente de referencia antes de corregirla.
7. Mantener el diseño mobile-first.
8. Después de cambios importantes, comprobar la versión desplegada en Vercel.

## Estado actual

La aplicación ya tiene:

- página principal responsive;
- panel **Hoy** dinámico;
- flujo diario **tiempo → coche → Wikiloc → tarde/noche**;
- enlaces directos de Google Maps;
- enlaces directos de Wikiloc;
- previsión meteorológica;
- enlace de apoyo a AEMET;
- mapas de Google incrustados, con enlace para abrir la ruta;
- PWA/service worker;
- instalación desde móvil;
- enlaces de Google Calendar;
- estructura de días 1–4;
- despliegue automático desde GitHub `main` a Vercel.

El objetivo de Arena debe ser **revisar, probar y mejorar esta implementación existente**, no reconstruir el proyecto desde cero ni recuperar funcionalidades que ya fueron eliminadas.

## Navegación y scroll

La navegación interna usa un único sistema de desplazamiento suave: `html { scroll-behavior: smooth; }` con `scroll-padding-top: 72px` para respetar la barra de navegación fija.

Los botones de apertura de los días usan `scrollIntoView({block: "start"})` sin imponer un comportamiento de scroll independiente. Esto evita duplicar la lógica de desplazamiento y reduce saltos o reajustes en móvil.

No añadir nuevos mecanismos de scroll suave mediante JavaScript salvo que exista una necesidad concreta y se compruebe su interacción con la navegación fija, el `IntersectionObserver` y las barras móviles.
