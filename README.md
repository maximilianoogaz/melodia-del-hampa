# Melodía del Hampa

Tienda de streetwear chileno hecha con React y Vite. Diseño adaptable, catálogo filtrable, búsqueda, orden por precio, selección de tallas y carrito persistente en el navegador.

## Desarrollo

```sh
npm install
npm run dev
```

## Producción

```sh
npm run build
npm run preview
```

El resultado compilado está en `dist/` y se puede alojar en cualquier hosting estático.

## Personalización

- Productos, precios, tallas e imágenes: `src/main.jsx`, constante `products`.
- Estilos, colores y diseño adaptable: `src/styles.css`.
- Título y metadatos: `index.html`.

Esta versión es una demostración del escaparate. Las fotos de Unsplash son referenciales y las variantes de color solo ilustran la paleta. No procesa pagos, genera pedidos ni calcula tarifas reales de despacho. Para vender se necesita integrar un backend con inventario, pedidos, una pasarela como Mercado Pago o Transbank y políticas de compra/envío. No colocar claves secretas en el frontend.
