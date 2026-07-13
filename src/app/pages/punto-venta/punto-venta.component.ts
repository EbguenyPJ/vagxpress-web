import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { environment } from 'environments/environment';

// Servicios
import { PuntoVentaService } from 'app/services/punto-venta/punto-venta.service';

// Componentes hijos
import { CategoriasComponent } from './categorias/categorias.component';
import { ProductosComponent } from './productos/productos.component';
import { CarritoComponent } from './carrito/carrito.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

// Dialogs
import { DialogProcesarVentaComponent } from './dialogs/dialog-procesar-venta/dialog-procesar-venta.component';
import { DialogBuscarVehiculoComponent } from './dialogs/dialog-buscar-vehiculo/dialog-buscar-vehiculo.component';

@Component({
  selector: 'app-punto-venta',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    CategoriasComponent,
    ProductosComponent,
    CarritoComponent,
    BusquedaComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './punto-venta.component.html',
  styleUrls: ['./punto-venta.component.scss'],
})
export class PuntoVentaComponent implements OnInit {

  @ViewChild(BusquedaComponent) busquedaComponent!: BusquedaComponent;

  // Variables de estado
  isLoading: boolean = true;
  errorCarga: boolean = false;
  vistaActual: string = 'categorias'; // 'categorias' | 'subcategorias' | 'productos'

  // Datos completos del backend
  todasCategorias: any[] = [];
  todasSubcategorias: any[] = [];
  todosProductos: any[] = [];
  porcentajesUtilidad: any[] = [];

  // Datos filtrados para vista actual
  categoriasMostrar: any[] = [];
  subcategoriasMostrar: any[] = [];
  productosMostrar: any[] = [];

  // Datos de navegación
  categoriaSeleccionada: any = null;
  subcategoriaSeleccionada: any = null;

  // Carrito - ahora cada item incluye porcentaje de utilidad seleccionado
  carrito: any[] = [];
  n_subtotal: number = 0;
  n_iva: number = 0;
  n_total: number = 0;

  // Usuario
  datosUsuario: any;
  s_token: string = '';

  // Control de focus
  habilitarFocusBusqueda: boolean = true;

  // URL base para imágenes
  urlImagenes: string = environment.imgUrl;

  // Breadcrumb
  breadscrums = [
    {
      title: 'Punto de Venta',
      items: ['Dashboard'],
      active: 'Punto de Venta',
    },
  ];

  constructor(
    private router: Router,
    private posService: PuntoVentaService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarioActual();
    this.cargarDatosIniciales();
  }

  obtenerUsuarioActual(): void {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        this.datosUsuario = JSON.parse(currentUserStr);
        const id_usuario = this.datosUsuario.id_usuario;
        this.s_token = this.datosUsuario.token;
        // Regla del líder del proyecto: enviar token como string vacío en esta etapa
        this.s_token = '';
      } catch (error) {
        console.error('Error al leer el usuario del localStorage', error);
      }
    }
  }

  cargarDatosIniciales(): void {
    this.isLoading = true;
    this.errorCarga = false;

    let completados = 0;
    let total = 4; // Ahora cargamos 4 endpoints
    let error = false;

    const verificarCompletado = () => {
      completados++;
      if (completados === total) {
        this.isLoading = false;

        if (!error) {
          this.categoriasMostrar = this.todasCategorias;
          console.log('Datos cargados correctamente');
        } else {
          this.errorCarga = true;
        }
      }
    };

    // Cargar categorías
    this.posService.getCategorias().subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.todasCategorias = response.data || [];
        }
        verificarCompletado();
      },
      (err) => {
        console.error('Error al cargar categorías:', err);
        error = true;
        verificarCompletado();
      }
    );

    // Cargar subcategorías
    this.posService.getSubcategorias().subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.todasSubcategorias = response.data || [];
        }
        verificarCompletado();
      },
      (err) => {
        console.error('Error al cargar subcategorías:', err);
        error = true;
        verificarCompletado();
      }
    );

    // Cargar productos
    this.posService.getProductos().subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.todosProductos = response.data || [];
        }
        verificarCompletado();
      },
      (err) => {
        console.error('Error al cargar productos:', err);
        error = true;
        verificarCompletado();
      }
    );

    // Cargar porcentajes de utilidad
    this.posService.getPorcentajesUtilidad().subscribe(
      (response: any) => {
        if (response.status === 'success') {
          // Ordenar porcentajes de menor a mayor
          this.porcentajesUtilidad = (response.data || []).sort((a: any, b: any) => {
            return parseFloat(a.n_porcentaje_utilidad) - parseFloat(b.n_porcentaje_utilidad);
          });
          console.log('Porcentajes de utilidad cargados y ordenados:', this.porcentajesUtilidad);
        }
        verificarCompletado();
      },
      (err) => {
        console.error('Error al cargar porcentajes de utilidad:', err);
        error = true;
        verificarCompletado();
      }
    );
  }

  reintentar(): void {
    this.todasCategorias = [];
    this.todasSubcategorias = [];
    this.todosProductos = [];
    this.porcentajesUtilidad = [];
    this.cargarDatosIniciales();
  }

  // ==================== Navegación ====================

  onCategoriaSeleccionada(categoria: any): void {
    this.categoriaSeleccionada = categoria;
    this.vistaActual = 'subcategorias';

    // Filtrar subcategorías de esta categoría
    this.subcategoriasMostrar = this.todasSubcategorias.filter(
      (sub: any) => sub.id_categoria_refaccion === categoria.id_categoria_refaccion
    );
  }

  onSubcategoriaSeleccionada(subcategoria: any): void {
    this.subcategoriaSeleccionada = subcategoria;
    this.vistaActual = 'productos';

    // Filtrar productos de esta subcategoría
    this.productosMostrar = this.todosProductos.filter(
      (prod: any) =>
        prod.s_categoria_refaccion === this.categoriaSeleccionada.s_categoria_refaccion &&
        prod.id_subcategoria_refaccion === subcategoria.id_subcategoria_refaccion
    );
  }

  volverACategorias(): void {
    this.vistaActual = 'categorias';
    this.categoriaSeleccionada = null;
    this.subcategoriaSeleccionada = null;
    this.categoriasMostrar = this.todasCategorias;
  }

  volverASubcategorias(): void {
    this.vistaActual = 'subcategorias';
    this.subcategoriaSeleccionada = null;
    // Re-filtrar subcategorías
    this.subcategoriasMostrar = this.todasSubcategorias.filter(
      (sub: any) => sub.id_categoria_refaccion === this.categoriaSeleccionada.id_categoria_refaccion
    );
  }

  // ==================== Búsqueda ====================

  onBusquedaProductos(s_termino: string): any[] {
    if (!s_termino || s_termino.trim().length < 2) {
      return [];
    }

    const terminoLower = s_termino.toLowerCase().trim();

    return this.todosProductos.filter(
      (producto: any) =>
        producto.s_nombre_refaccion?.toLowerCase().includes(terminoLower) ||
        producto.s_numero_parte?.toLowerCase().includes(terminoLower) ||
        producto.s_marca_refaccion?.toLowerCase().includes(terminoLower)
    );
  }

  onBuscarPorCodigoQR(s_codigo_qr: string): any {
    if (!s_codigo_qr || s_codigo_qr.trim().length === 0) {
      return null;
    }

    const codigoLower = s_codigo_qr.toLowerCase().trim();

    return this.todosProductos.find(
      (producto: any) =>
        producto.s_codigo_qr?.toLowerCase() === codigoLower
    );
  }

  // ==================== Carrito ====================

  onProductoSeleccionado(producto: any): void {
    this.agregarAlCarrito(producto);
  }

  // Abre la búsqueda por vehículo; el resultado elegido se agrega al carrito.
  abrirBusquedaVehiculo(): void {
    const dialogRef = this.dialog.open(DialogBuscarVehiculoComponent, {
      width: '640px',
    });

    dialogRef.afterClosed().subscribe((refaccion) => {
      if (refaccion) {
        this.agregarAlCarrito(refaccion);
      }
    });
  }

  agregarAlCarrito(producto: any): void {
    // Buscar si ya existe en el carrito
    const itemExistente = this.carrito.find(
      (item: any) => item.producto.id_refaccion === producto.id_refaccion
    );

    if (itemExistente) {
      itemExistente.n_cantidad++;
      this.recalcularItemCarrito(itemExistente);
    } else {
      // Buscar porcentaje default (id_tipo_configuracion === 2)
      const porcentajeDefault = this.porcentajesUtilidad.find(
        (p: any) => parseInt(p.id_tipo_configuracion) === 2
      );

      const nuevoItem = {
        producto: producto,
        n_cantidad: 1,
        id_porcentaje_utilidad: porcentajeDefault ? porcentajeDefault.id_porcentaje_utilidad : null,
        n_precio_unitario: parseFloat(producto.n_precio_venta),
        n_subtotal: parseFloat(producto.n_precio_venta)
      };

      // Recalcular precio con porcentaje default si existe
      this.recalcularItemCarrito(nuevoItem);

      this.carrito.push(nuevoItem);
    }

    this.recalcularTotales();

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Producto agregado',
      showConfirmButton: false,
      timer: 1500
    });
  }

  // Recalcular precio y subtotal de un item considerando porcentaje de utilidad
  recalcularItemCarrito(item: any): void {
    const n_precio_base = parseFloat(item.producto.n_precio_venta);

    if (item.id_porcentaje_utilidad) {
      const porcentaje = this.porcentajesUtilidad.find(
        (p: any) => p.id_porcentaje_utilidad === item.id_porcentaje_utilidad
      );

      if (porcentaje) {
        const n_porcentaje = parseFloat(porcentaje.n_porcentaje_utilidad);
        item.n_precio_unitario = n_precio_base * (1 + n_porcentaje / 100);
      } else {
        item.n_precio_unitario = n_precio_base;
      }
    } else {
      item.n_precio_unitario = n_precio_base;
    }

    item.n_subtotal = item.n_precio_unitario * item.n_cantidad;
  }

  // Cambiar porcentaje de utilidad de un item del carrito
  cambiarPorcentajeUtilidad(indexCarrito: number, id_porcentaje: any): void {
    const item = this.carrito[indexCarrito];

    // Si se hace click en el mismo porcentaje que ya está activo, se desactiva
    if (item.id_porcentaje_utilidad === id_porcentaje) {
      item.id_porcentaje_utilidad = null;
    } else {
      item.id_porcentaje_utilidad = id_porcentaje;
    }

    // Recalcular precios del item
    this.recalcularItemCarrito(item);

    // Recalcular totales generales
    this.recalcularTotales();
  }

  eliminarDelCarrito(index: number): void {
    this.carrito.splice(index, 1);
    this.recalcularTotales();
  }

  actualizarCantidad(index: number, n_cantidad: number): void {
    if (n_cantidad <= 0) {
      this.eliminarDelCarrito(index);
      return;
    }

    this.carrito[index].n_cantidad = n_cantidad;
    this.recalcularItemCarrito(this.carrito[index]);
    this.recalcularTotales();
  }

  incrementarCantidad(index: number): void {
    this.carrito[index].n_cantidad++;
    this.recalcularItemCarrito(this.carrito[index]);
    this.recalcularTotales();
  }

  decrementarCantidad(index: number): void {
    if (this.carrito[index].n_cantidad > 1) {
      this.carrito[index].n_cantidad--;
      this.recalcularItemCarrito(this.carrito[index]);
      this.recalcularTotales();
    } else {
      this.eliminarDelCarrito(index);
    }
  }

  vaciarCarrito(): void {
    Swal.fire({
      title: '¿Vaciar carrito?',
      text: 'Se eliminarán todos los productos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carrito = [];
        this.recalcularTotales();
        Swal.fire('Carrito vaciado', '', 'success');
      }
    });
  }

  recalcularTotales(): void {
    this.n_subtotal = this.carrito.reduce(
      (sum: number, item: any) => sum + item.n_subtotal,
      0
    );
    this.n_iva = this.n_subtotal * 0.16;
    this.n_total = this.n_subtotal + this.n_iva;
  }

  procesarVenta(): void {
    if (this.carrito.length === 0) {
      Swal.fire('Carrito vacío', 'Agrega productos al carrito', 'warning');
      return;
    }

    // Obtener ID del usuario desde localStorage
    let id_usuario_crea = 0;
    if (this.datosUsuario) {
      id_usuario_crea = this.datosUsuario.id_usuario;
    }

    // Construir payload con porcentajes de utilidad
    const refacciones = this.carrito.map((item: any) => ({
      n_cantidad: item.n_cantidad,
      id_refaccion: item.producto.id_refaccion,
      id_porcentaje_utilidad: item.id_porcentaje_utilidad || null
    }));

    const payload = {
      id_usuario_crea: id_usuario_crea,
      refacciones: refacciones
    };

    // Desactivar focus antes de abrir dialog
    this.habilitarFocusBusqueda = false;

    // Abrir dialog
    const dialogRef = this.dialog.open(DialogProcesarVentaComponent, {
      width: '700px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        n_subtotal: this.n_subtotal,
        n_iva: this.n_iva,
        n_total: this.n_total,
        s_token: this.s_token,
        payload: payload
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Reactivar focus al cerrar dialog
      this.habilitarFocusBusqueda = true;

      // Hacer focus explícito al componente de búsqueda
      setTimeout(() => {
        if (this.busquedaComponent) {
          this.busquedaComponent.hacerFocus();
        }
      }, 100);

      if (result === true) {
        // Venta exitosa - limpiar carrito
        this.carrito = [];
        this.recalcularTotales();

        // Recargar datos para actualizar stock
        this.cargarDatosIniciales();
      }
    });
  }

}
