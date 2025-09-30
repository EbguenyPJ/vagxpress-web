import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { CatalogoRefaccionesComponent } from 'app/pages/catalogoRefacciones/catalogoRefacciones.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RefaccionesService } from 'app/services/refacciones/refacciones.service';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CotizacionService } from 'app/services/cotizacion/cotizacion.service';

@Component({
  selector: 'app-catalogo-seleccion',
  templateUrl: './catalogo-seleccion.component.html',
  styleUrls: ['./catalogo-seleccion.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
})
export class CatalogoSeleccionComponent
  extends CatalogoRefaccionesComponent
  implements OnInit
{
  @Input() filtroExterno$!: Observable<string>;

  constructor(
    public override dialog: MatDialog,
    public override refaccionesService: RefaccionesService,
    snackBar: MatSnackBar,
    private cotizacionService: CotizacionService
  ) {
    super(dialog, refaccionesService, snackBar);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    if (this.filtroExterno$) {
      this.filtroExterno$.subscribe((termino) => {
        this.dataSource.filter = termino.trim().toLowerCase();
      });
    }
  }

  agregarACotizacion(refaccion: any): void {
    this.cotizacionService.agregarItem(refaccion);
  }
}
