import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { conexion } from 'app/conexion';

@Component({
  selector: 'app-carrito-pos',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss',
})
export class CarritoComponent {

  @Input() carrito: any[] = [];
  @Input() porcentajesUtilidad: any[] = [];
  @Input() n_subtotal: number = 0;
  @Input() n_iva: number = 0;
  @Input() n_total: number = 0;

  @Output() incrementar = new EventEmitter<number>();
  @Output() decrementar = new EventEmitter<number>();
  @Output() eliminar = new EventEmitter<number>();
  @Output() vaciar = new EventEmitter<void>();
  @Output() procesar = new EventEmitter<void>();
  @Output() cambiarPorcentaje = new EventEmitter<{index: number, id_porcentaje: any}>();

  urlImagenes: string = conexion.url_img;

  get totalItems(): number {
    return this.carrito.reduce((sum: number, item: any) => sum + item.n_cantidad, 0);
  }

  obtenerUrlImagen(s_imagen: string | null): string {
    if (!s_imagen) {
      return 'assets/images/default-product.png';
    }
    if (s_imagen.startsWith('http')) {
      return s_imagen;
    }
    return this.urlImagenes + '/' + s_imagen;
  }

  onIncrementar(index: number): void {
    this.incrementar.emit(index);
  }

  onDecrementar(index: number): void {
    this.decrementar.emit(index);
  }

  onEliminar(index: number): void {
    this.eliminar.emit(index);
  }

  onVaciar(): void {
    this.vaciar.emit();
  }

  onProcesar(): void {
    this.procesar.emit();
  }

  onCambiarPorcentaje(index: number, id_porcentaje: any): void {
    this.cambiarPorcentaje.emit({ index, id_porcentaje });
  }

  esPorcentajeSeleccionado(item: any, id_porcentaje: any): boolean {
    return item.id_porcentaje_utilidad === id_porcentaje;
  }
}
