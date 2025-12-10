import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { conexion } from 'app/conexion';

@Component({
  selector: 'app-productos-pos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
})
export class ProductosComponent {

  @Input() categoriaSeleccionada: any = null;
  @Input() subcategoriaSeleccionada: any = null;
  @Input() productosMostrar: any[] = [];
  @Output() productoSeleccionado = new EventEmitter<any>();
  @Output() volver = new EventEmitter<void>();

  urlImagenes: string = conexion.url_img;

  onProductoClick(producto: any): void {
    // Permitir agregar incluso si no hay stock (puede ser por pedido)
    this.productoSeleccionado.emit(producto);
  }

  onVolverClick(): void {
    this.volver.emit();
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

  obtenerColorEstatus(s_estatus: string): string {
    switch (s_estatus?.toLowerCase()) {
      case 'disponible':
        return '#28a745';
      case 'agotado':
        return '#7a7a7aff';
      case 'por-ordenar':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  }

  obtenerColorClase(s_clase: string): string {
    switch (s_clase?.toLowerCase()) {
      case 'original':
        return '#000000ff';
      case 'generico':
        return '#0800faff';
      case 'funcional':
        return '#ef0707ff';
      default:
        return '#ef07ecff';
    }
  }
}
