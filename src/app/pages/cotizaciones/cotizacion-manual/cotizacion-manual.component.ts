import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { CotizacionService } from 'app/services/cotizacion/cotizacion.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CatalogoSeleccionComponent } from '../catalogo-seleccion/catalogo-seleccion.component';

@Component({
  selector: 'app-cotizacion-manual',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    BreadcrumbComponent,
    CatalogoSeleccionComponent,
  ],
  templateUrl: './cotizacion-manual.component.html',
  styleUrl: './cotizacion-manual.component.scss',
})
export class CotizacionManualComponent implements OnInit {
  breadscrums = [
    {
      title: 'Cotización Manual',
      items: ['Ventas', 'Cotizaciones'],
      active: 'Crear',
    },
  ];

  searchControl = new FormControl('');

  filtroParaCatalogo$!: Observable<string>;

  itemsEnCotizacion$!: Observable<any[]>;
  subtotal$!: Observable<number>;
  iva$!: Observable<number>;
  total$!: Observable<number>;

  constructor(private cotizacionService: CotizacionService) {}

  ngOnInit(): void {
    this.itemsEnCotizacion$ = this.cotizacionService.items$;
    this.subtotal$ = this.cotizacionService.subtotal$;
    this.iva$ = this.cotizacionService.iva$;
    this.total$ = this.cotizacionService.total$;
    this.filtroParaCatalogo$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => value || '')
    );
  }

  removerItem(idRefaccion: number): void {
    this.cotizacionService.eliminarItem(idRefaccion);
  }

  incrementar(idRefaccion: number): void {
    this.cotizacionService.incrementarCantidad(idRefaccion);
  }

  decrementar(idRefaccion: number): void {
    this.cotizacionService.decrementarCantidad(idRefaccion);
  }
}
