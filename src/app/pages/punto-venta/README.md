# Módulo de Punto de Venta (POS)

## Descripción General
Sistema de punto de venta moderno diseñado para la venta rápida de refacciones automotrices. Cuenta con navegación intuitiva por categorías, búsqueda avanzada y un carrito de compras en tiempo real.

## Características Principales

### 🎨 Interfaz Moderna
- Diseño limpio y profesional
- Layout dividido: Catálogo (izquierda) + Carrito (derecha)
- Display retro estilo "green screen" para el total (único elemento retro)
- Animaciones suaves y transiciones fluidas
- Responsive design

### 🗂️ Sistema de Navegación
1. **Categorías Principales**: Cards grandes con imagen de fondo y nombre centrado
2. **Subcategorías**: Cards similares a categorías pero ligeramente más pequeñas
3. **Productos**: Cards detalladas con toda la información del producto

### 🛍️ Catálogo de Productos
Cada producto muestra:
- Imagen del producto
- Nombre y marca
- Número de parte
- Precio unitario
- Stock disponible
- **Badges superiores**:
  - **Status**: Disponible (verde), Agotado (rojo), Por Ordenar (naranja)
  - **Tipo**: Original (azul), Genérico (morado), Funcional (naranja), N/A (gris)

### 🛒 Carrito de Compras
- Vista en tiempo real de productos agregados
- Control de cantidad (incrementar/decrementar)
- Eliminación individual de productos
- Cálculo automático de:
  - Subtotal
  - IVA (16%)
  - **Total** (mostrado en estilo retro con fuente verde brillante)
- Botón para vaciar carrito
- Botón para procesar venta

### 🔍 Búsqueda Avanzada
- Búsqueda en tiempo real (debounce de 300ms)
- Buscar por:
  - Nombre del producto
  - Número de parte
  - Código de barras
- Resultados mostrados en dropdown con imagen miniatura
- Agregar productos directamente desde búsqueda

## Estructura de Archivos

```
punto-venta/
├── models/
│   └── pos.models.ts              # Interfaces y tipos
├── services/
│   └── punto-venta.service.ts     # Servicio principal con estado
├── components/
│   ├── busqueda/
│   │   ├── busqueda.component.ts
│   │   ├── busqueda.component.html
│   │   └── busqueda.component.scss
│   ├── categorias/
│   │   ├── categorias.component.ts
│   │   ├── categorias.component.html
│   │   └── categorias.component.scss
│   ├── productos/
│   │   ├── productos.component.ts
│   │   ├── productos.component.html
│   │   └── productos.component.scss
│   └── carrito/
│       ├── carrito.component.ts
│       ├── carrito.component.html
│       └── carrito.component.scss
├── punto-venta.component.ts       # Componente principal
├── punto-venta.component.html
├── punto-venta.component.scss
└── punto-venta-styles.scss        # Estilos compartidos y variables
```

## Modelos de Datos

### Categoria
```typescript
interface Categoria {
  id: number;
  nombre: string;
  imagen: string;
  subcategorias?: Subcategoria[];
}
```

### Subcategoria
```typescript
interface Subcategoria {
  id: number;
  nombre: string;
  categoriaId: number;
  imagen: string;
}
```

### Producto
```typescript
interface Producto {
  id: number;
  nombre: string;
  marca: string;
  numeroParte: string;
  precio: number;
  stock: number;
  imagen: string;
  categoriaId: number;
  subcategoriaId: number;
  status: 'disponible' | 'agotado' | 'por-ordenar';
  tipoProducto: 'original' | 'generico' | 'funcional' | 'N/A';
  codigoBarras?: string;
}
```

### ItemCarrito
```typescript
interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}
```

### Carrito
```typescript
interface Carrito {
  items: ItemCarrito[];
  subtotal: number;
  iva: number;
  total: number;
}
```

## Servicio Principal

### PuntoVentaService

**Estado Observable (RxJS)**
- `carrito$`: Observable del carrito de compras
- `navegacion$`: Observable del estado de navegación

**Métodos de API**
- `getCategorias()`: Obtiene categorías principales
- `getSubcategorias(categoriaId)`: Obtiene subcategorías
- `getProductos(categoriaId, subcategoriaId)`: Obtiene productos
- `buscarProducto(termino)`: Búsqueda de productos

**Métodos de Navegación**
- `seleccionarCategoria(categoria)`: Navega a subcategorías
- `seleccionarSubcategoria(subcategoria)`: Navega a productos
- `volverACategorias()`: Regresa a vista de categorías
- `volverASubcategorias()`: Regresa a vista de subcategorías

**Métodos del Carrito**
- `agregarAlCarrito(producto, cantidad)`: Agrega o incrementa producto
- `eliminarDelCarrito(productoId)`: Elimina producto del carrito
- `actualizarCantidad(productoId, cantidad)`: Actualiza cantidad
- `incrementarCantidad(productoId)`: Incrementa en 1
- `decrementarCantidad(productoId)`: Decrementa en 1
- `vaciarCarrito()`: Limpia el carrito completamente

## Endpoints de API Esperados

```typescript
GET /api/categorias
// Retorna: Categoria[]

GET /api/categorias/:id/subcategorias
// Retorna: Subcategoria[]

GET /api/productos?categoria=:catId&subcategoria=:subId
// Retorna: Producto[]

GET /api/productos/buscar?q=:termino
// Retorna: Producto[]
// Busca en: nombre, numeroParte, codigoBarras
```

## Estilo Retro del Total

El display del total usa un estilo retro "green screen" inspirado en sistemas antiguos:

- Fondo negro (#0d0d0d)
- Texto verde brillante (#00ff00)
- Fuente monoespaciada (Courier New)
- Efecto de resplandor (text-shadow con animación)
- Efecto de líneas de escaneo
- Animación pulsante del brillo

```scss
.retro-display {
  background: #0d0d0d;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
  // ... más estilos
}
```

## Variables de Estilo

Definidas en `punto-venta-styles.scss`:

**Colores**
- Primary: `#667eea`
- Secondary: `#764ba2`
- Success: `#4caf50`
- Warning: `#ff9800`
- Danger: `#f44336`

**Estados**
- Disponible: Verde (#4caf50)
- Agotado: Rojo (#f44336)
- Por Ordenar: Naranja (#ff9800)

**Tipos de Producto**
- Original: Azul (#2196f3)
- Genérico: Morado (#9c27b0)
- Funcional: Naranja (#ff5722)
- N/A: Gris (#757575)

## Uso

### Navegación básica

```typescript
// El usuario ve categorías al entrar
// Click en categoría → Se muestran subcategorías
// Click en subcategoría → Se muestran productos
// Click en producto → Se agrega al carrito
```

### Búsqueda

```typescript
// Usuario escribe en barra de búsqueda
// Sistema busca automáticamente después de 300ms
// Resultados aparecen en dropdown
// Click en resultado → Producto se agrega al carrito
```

### Gestión del Carrito

```typescript
// Agregar producto: Click en card de producto o resultado de búsqueda
// Incrementar cantidad: Botón "+" en item del carrito
// Decrementar cantidad: Botón "-" en item del carrito
// Eliminar producto: Botón de basura en item del carrito
// Vaciar carrito: Botón "Vaciar Carrito" en footer
// Procesar venta: Botón "Procesar Venta" (pendiente implementación)
```

## Responsive Design

El módulo es completamente responsive:

- **Desktop (>1200px)**: Layout de dos columnas
- **Tablet (768px-1200px)**: Layout de dos columnas ajustado
- **Mobile (<768px)**: Layout vertical (catálogo arriba, carrito abajo)

## Pendientes de Implementación

- [ ] Funcionalidad de procesamiento de venta
- [ ] Integración con sistema de pagos
- [ ] Impresión de tickets
- [ ] Historial de ventas
- [ ] Soporte para descuentos
- [ ] Soporte para múltiples métodos de pago
- [ ] Gestión de clientes en el POS

## Notas de Desarrollo

- Todos los componentes son **standalone** (Angular 19)
- Se usa RxJS para manejo de estado reactivo
- Material Design para componentes UI
- Debounce en búsqueda para optimizar llamadas API
- Validación de stock antes de agregar productos
- Cálculo automático de IVA (16%)
