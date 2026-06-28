# VagXpress — Web

Frontend web de **VagXpress**, un sistema **POS (punto de venta) para refaccionarías**. Construido con **Angular 19** y Angular Material.

> Backend: **vagxpress-api** (Laravel 10) — carpeta `../API-Refaccionaria`.

## Tecnologías

- **Angular** 19 (standalone APIs)
- **Angular Material** 19
- **Bootstrap** 5.3
- **Chart.js** 4.4 (dashboards y reportes)
- **RxJS** 7.8 · **TypeScript**

## Módulos

- **Punto de venta** — venta de refacciones, carrito, búsqueda y procesamiento de pago.
- **Bitácora de ventas** — historial y detalle de ventas, estatus y métodos de pago.
- **Catálogo de refacciones** — alta, edición, detalle y equivalencias.
- **Compras** — requisiciones y órdenes de compra (con aprobación/rechazo y PDF).
- **Cotizaciones** — cotización manual y gestión de catálogos.
- **Embarques** — recepción e inserción de refacciones.
- **Operaciones** — cortes de caja.
- **Clientes**, **Proveedores**, **Repartos**, **Gastos**.
- **Administración** y **Configuraciones**.

## Requisitos

- Node.js 18+ y npm
- Angular CLI 19 (`npm i -g @angular/cli`)

## Instalación y ejecución

```bash
npm install
npm start          # ng serve  ->  http://localhost:4200
```

Configura la URL de la API en `src/environments/environment.development.ts`
(apuntando a la instancia local de la API **vagxpress-api**).

## Scripts

| Comando         | Descripción                         |
| --------------- | ----------------------------------- |
| `npm start`     | Servidor de desarrollo (`ng serve`) |
| `npm run build` | Build de producción (`ng build`)    |
| `npm test`      | Pruebas unitarias (`ng test`)       |
| `npm run lint`  | Análisis de código (`ng lint`)      |
