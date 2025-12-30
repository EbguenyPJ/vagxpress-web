import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { conexion } from 'app/conexion';

import { PuntoVentaService } from 'app/services/punto-venta/punto-venta.service';
import { CotizacionService } from 'app/services/cotizacion/cotizacion.service';

import { CategoriasComponent } from '../../punto-venta/categorias/categorias.component';
import { ProductosComponent } from '../../punto-venta/productos/productos.component';
import { CarritoCotizacionComponent } from './carrito-cotizacion/carrito-cotizacion.component';
import { BusquedaComponent } from '../../punto-venta/busqueda/busqueda.component';

import { DialogGuardarCotizacionComponent } from './dialogs/dialog-guardar-cotizacion/dialog-guardar-cotizacion.component';

@Component({
  selector: 'app-cotizacion-manual',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    CategoriasComponent,
    ProductosComponent,
    CarritoCotizacionComponent,
    BusquedaComponent
  ],
  templateUrl: './cotizacion-manual.component.html',
  styleUrl: './cotizacion-manual.component.scss',
})
export class CotizacionManualComponent implements OnInit {

  @ViewChild(BusquedaComponent) busquedaComponent!: BusquedaComponent;

  isLoading: boolean = true;
  errorCarga: boolean = false;
  vistaActual: string = 'categorias'; // 'categorias' | 'subcategorias' | 'productos'

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

  // Carrito
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
  urlImagenes: string = conexion.url_img;

  // Breadcrumb
  breadscrums = [
    {
      title: 'Cotización Manual',
      items: ['Ventas', 'Cotizaciones'],
      active: 'Crear',
    },
  ];

  constructor(
    private router: Router,
    private posService: PuntoVentaService,
    private cotizacionService: CotizacionService,
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
    let total = 4;
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
    this.posService.getCategorias(this.s_token).subscribe(
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
    this.posService.getSubcategorias(this.s_token).subscribe(
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
    this.posService.getProductos(this.s_token).subscribe(
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
    this.posService.getPorcentajesUtilidad(this.s_token).subscribe(
      (response: any) => {
        if (response.status === 'success') {
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

  // ---------------- Navegación

  onCategoriaSeleccionada(categoria: any): void {
    this.categoriaSeleccionada = categoria;
    this.vistaActual = 'subcategorias';

    this.subcategoriasMostrar = this.todasSubcategorias.filter(
      (sub: any) => sub.id_categoria_refaccion === categoria.id_categoria_refaccion
    );
  }

  onSubcategoriaSeleccionada(subcategoria: any): void {
    this.subcategoriaSeleccionada = subcategoria;
    this.vistaActual = 'productos';

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
    this.subcategoriasMostrar = this.todasSubcategorias.filter(
      (sub: any) => sub.id_categoria_refaccion === this.categoriaSeleccionada.id_categoria_refaccion
    );
  }

  // --------- Búsqueda

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

  // -------- Carrito

  onProductoSeleccionado(producto: any): void {
    this.agregarAlCarrito(producto);
  }

  agregarAlCarrito(producto: any): void {
    const itemExistente = this.carrito.find(
      (item: any) => item.producto.id_refaccion === producto.id_refaccion
    );

    if (itemExistente) {
      itemExistente.n_cantidad++;
      this.recalcularItemCarrito(itemExistente);
    } else {
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

  cambiarPorcentajeUtilidad(indexCarrito: number, id_porcentaje: any): void {
    const item = this.carrito[indexCarrito];

    if (item.id_porcentaje_utilidad === id_porcentaje) {
      item.id_porcentaje_utilidad = null;
    } else {
      item.id_porcentaje_utilidad = id_porcentaje;
    }

    this.recalcularItemCarrito(item);
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
      title: '¿Vaciar cotización?',
      text: 'Se eliminarán todos los productos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carrito = [];
        this.recalcularTotales();
        Swal.fire('Cotización vaciada', '', 'success');
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

  guardarCotizacion(): void {
    if (this.carrito.length === 0) {
      Swal.fire('Cotización vacía', 'Agrega productos a la cotización', 'warning');
      return;
    }

    // Obtener ID del usuario desde localStorage
    let id_usuario = 0;
    if (this.datosUsuario) {
      id_usuario = this.datosUsuario.id_usuario;
    }

    // Desactivar focus antes de abrir dialog
    this.habilitarFocusBusqueda = false;

    // Abrir dialog
    const dialogRef = this.dialog.open(DialogGuardarCotizacionComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        carrito: this.carrito,
        n_subtotal: this.n_subtotal,
        n_iva: this.n_iva,
        n_total: this.n_total,
        s_token: this.s_token,
        id_usuario: id_usuario
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
        // Cotización guardada exitosamente - limpiar carrito
        this.carrito = [];
        this.recalcularTotales();

        // Recargar datos para actualizar stock si es necesario
        this.cargarDatosIniciales();
      }
    });
  }
}
