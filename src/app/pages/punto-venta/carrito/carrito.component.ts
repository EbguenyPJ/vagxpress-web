import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-carrito-pos',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss',
})
export class CarritoComponent {

  @Input() carrito: any[] = [];
  @Input() n_subtotal: number = 0;
  @Input() n_iva: number = 0;
  @Input() n_total: number = 0;

  @Output() incrementar = new EventEmitter<number>();
  @Output() decrementar = new EventEmitter<number>();
  @Output() eliminar = new EventEmitter<number>();
  @Output() vaciar = new EventEmitter<void>();
  @Output() procesar = new EventEmitter<void>();

  get totalItems(): number {
    return this.carrito.reduce((sum: number, item: any) => sum + item.n_cantidad, 0);
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
}
