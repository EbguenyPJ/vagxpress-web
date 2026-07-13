import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-categorias-pos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
})
export class CategoriasComponent {

  @Input() vistaActual: string = 'categorias';
  @Input() categoriaSeleccionada: any = null;
  @Input() categoriasMostrar: any[] = [];
  @Input() subcategoriasMostrar: any[] = [];

  @Output() categoriaSelected = new EventEmitter<any>();
  @Output() subcategoriaSelected = new EventEmitter<any>();
  @Output() volverCategorias = new EventEmitter<void>();

  urlImagenes: string = environment.imgUrl;

  onCategoriaClick(categoria: any): void {
    this.categoriaSelected.emit(categoria);
  }

  onSubcategoriaClick(subcategoria: any): void {
    this.subcategoriaSelected.emit(subcategoria);
  }

  onVolverClick(): void {
    this.volverCategorias.emit();
  }

  obtenerUrlImagen(s_imagen: string): string {
    if (!s_imagen) {
      return 'assets/images/default-category.jpg';
    }
    if (s_imagen.startsWith('http')) {
      return s_imagen;
    }
    return this.urlImagenes + '/' + s_imagen;
  }
}
