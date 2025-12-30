import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RefaccionesService } from 'app/services/refacciones/refacciones.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dialog-seleccionar-equivalencias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgxMatSelectSearchModule,
  ],
  templateUrl: './dialog-seleccionar-equivalencias.component.html',
  styleUrls: ['./dialog-seleccionar-equivalencias.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogSeleccionarEquivalenciasComponent implements OnInit {
  protected refacciones: any[] = [];

  public refaccionMultiCtrl: FormControl = new FormControl([]);

  public refaccionMultiFilterCtrl: FormControl = new FormControl('');

  public filteredRefaccionesMulti: ReplaySubject<any[]> = new ReplaySubject<
    any[]
  >(1);

  protected _onDestroy = new Subject<void>();

  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<DialogSeleccionarEquivalenciasComponent>,
    private refaccionesService: RefaccionesService,
    @Inject(MAT_DIALOG_DATA) public data: { id_subcategoria_refaccion: number }
  ) {}

  ngOnInit(): void {
    this.refaccionesService.getRefacciones('').subscribe({
      next: (res: any) => {
        this.refacciones = res.data.filter(
          (ref: any) =>
            ref.id_subcategoria_refaccion ===
            this.data.id_subcategoria_refaccion
        );

        this.filteredRefaccionesMulti.next(this.refacciones.slice());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar refacciones', err);
        this.isLoading = false;
      },
    });

    this.refaccionMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterRefaccionesMulti();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterRefaccionesMulti() {
    if (!this.refacciones) {
      return;
    }
    let search = this.refaccionMultiFilterCtrl.value;
    if (!search) {
      this.filteredRefaccionesMulti.next(this.refacciones.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredRefaccionesMulti.next(
      this.refacciones.filter((ref) => {
        const nombreRefaccion = (ref.s_nombre_refaccion || '').toLowerCase();
        const marcaRefaccion = (ref.s_marca_refaccion || '').toLowerCase();
        const numeroParte = (ref.s_numero_parte || '').toLowerCase();

        return (
          nombreRefaccion.includes(search) ||
          marcaRefaccion.includes(search) ||
          numeroParte.includes(search)
        );
      })
    );
  }

  onConfirm(): void {
    const seleccionados = this.refacciones.filter((ref) =>
      this.refaccionMultiCtrl.value?.includes(ref.id_refaccion)
    );
    this.dialogRef.close(seleccionados);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
