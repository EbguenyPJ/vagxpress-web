import { Component, Output, EventEmitter, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { conexion } from 'app/conexion';

@Component({
  selector: 'app-busqueda-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.scss',
})
export class BusquedaComponent implements AfterViewInit, OnDestroy {

  @Input() buscarProductos!: (termino: string) => any[];
  @Input() buscarPorCodigoQR!: (codigo: string) => any;
  @Input() habilitarFocus: boolean = true; // Nueva propiedad para controlar el focus
  @Output() productoSeleccionado = new EventEmitter<any>();
  @ViewChild('inputBusqueda', { static: false }) inputBusqueda!: ElementRef;

  s_termino: string = '';
  resultados: any[] = [];
  mostrarResultados: boolean = false;
  timeoutBusqueda: any;
  urlImagenes: string = conexion.url_img;

  // Variables para detección de scanner
  bufferScanner: string = '';
  timeoutScanner: any;
  tiempoLimiteScanner: number = 100; // 100ms entre caracteres para considerar que es scanner
  ultimaTeclaTimestamp: number = 0;

  ngAfterViewInit(): void {
    // Auto-focus al input al cargar
    this.hacerFocus();

    // Listener global para re-enfocar después de acciones
    this.agregarListenerGlobal();
  }

  ngOnDestroy(): void {
    if (this.timeoutBusqueda) {
      clearTimeout(this.timeoutBusqueda);
    }
    if (this.timeoutScanner) {
      clearTimeout(this.timeoutScanner);
    }
  }

  agregarListenerGlobal(): void {
    // Escuchar clicks en cualquier parte del documento
    document.addEventListener('click', () => {
      if (this.habilitarFocus) {
        setTimeout(() => this.hacerFocus(), 100);
      }
    });

    // Escuchar cuando se presiona ESC
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.habilitarFocus) {
        this.limpiar();
        this.hacerFocus();
      }
    });
  }

  hacerFocus(): void {
    if (this.habilitarFocus && this.inputBusqueda && this.inputBusqueda.nativeElement) {
      this.inputBusqueda.nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const ahora = Date.now();
    const tiempoEntreCaracteres = ahora - this.ultimaTeclaTimestamp;

    // Si el tiempo entre caracteres es muy corto, es un scanner
    if (tiempoEntreCaracteres < this.tiempoLimiteScanner && this.bufferScanner.length > 0) {
      this.bufferScanner += event.key;
    } else {
      this.bufferScanner = event.key;
    }

    this.ultimaTeclaTimestamp = ahora;

    // Limpiar buffer después de un tiempo
    if (this.timeoutScanner) {
      clearTimeout(this.timeoutScanner);
    }

    this.timeoutScanner = setTimeout(() => {
      // Si se acumularon más de 8 caracteres en menos de 100ms cada uno, es scanner
      if (this.bufferScanner.length >= 8 && event.key === 'Enter') {
        this.procesarCodigoScanner();
      }
      this.bufferScanner = '';
    }, this.tiempoLimiteScanner);
  }

  procesarCodigoScanner(): void {
    // Remover el Enter final si existe
    const codigo = this.bufferScanner.replace('Enter', '').trim();

    if (codigo.length > 0) {
      const producto = this.buscarPorCodigoQR(codigo);

      if (producto) {
        this.productoSeleccionado.emit(producto);
        this.limpiar();
      } else {
        // No se encontró el producto, mostrar en búsqueda normal
        this.s_termino = codigo;
        this.buscar();
      }
    }

    this.bufferScanner = '';
  }

  onBuscar(): void {
    // Cancelar timeout anterior
    if (this.timeoutBusqueda) {
      clearTimeout(this.timeoutBusqueda);
    }

    // Debounce de 300ms para búsqueda manual
    this.timeoutBusqueda = setTimeout(() => {
      this.buscar();
    }, 300);
  }

  buscar(): void {
    if (this.s_termino.trim().length >= 2) {
      this.resultados = this.buscarProductos(this.s_termino);
      this.mostrarResultados = true;
    } else {
      this.resultados = [];
      this.mostrarResultados = false;
    }
  }

  onProductoClick(producto: any): void {
    this.productoSeleccionado.emit(producto);
    this.limpiar();
    this.hacerFocus();
  }

  limpiar(): void {
    this.s_termino = '';
    this.resultados = [];
    this.mostrarResultados = false;
    this.bufferScanner = '';
  }

  cerrarResultados(): void {
    setTimeout(() => {
      this.mostrarResultados = false;
      this.hacerFocus();
    }, 200);
  }

  obtenerUrlImagen(s_imagen: string): string {
    if (!s_imagen) {
      return 'assets/images/default-product.png';
    }
    if (s_imagen.startsWith('http')) {
      return s_imagen;
    }
    return this.urlImagenes + '/' + s_imagen;
  }
}
