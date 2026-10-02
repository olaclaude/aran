# assets/photos/

Sustituye los bloques de color en `index.html` por imágenes reales de cada
día. Nombres sugeridos:

- `dia1.jpg` — Salardú / Tredòs / Cami de les Bruixes
- `dia2.jpg` — Era Artiga de Lin / Uelhs deth Joèu / Arties
- `dia3.jpg` — Saut deth Pish / Vielha
- `dia4.jpg` — Bassa d'Oles / Bagergue / Garòs

Para que cubran bien el hueco puedes cambiar el `.day-photo` en CSS a:

```css
.day-photo {
  background: transparent;
}
.day-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

…y poner un `<img src="assets/photos/dia1.jpg" alt="...">` dentro del
`<div class="day-photo">`.
