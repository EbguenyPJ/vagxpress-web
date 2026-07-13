import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatMenuModule, MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule, MatHeaderCell, MatCell, MatHeaderRow, MatRow } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { MAT_DATE_LOCALE, MatOptionModule, MatRippleModule, MatOption } from '@angular/material/core';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { rowsAnimation, TableExportUtil } from '@shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule, MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule, MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { HttpClient } from '@angular/common/http';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Direction } from '@angular/cdk/bidi';





import { clientesModel } from 'app/models/clientesModel'
import { environment } from 'environments/environment';
import { ClientesService } from 'app/services/clientes/clientes.service';
import { GastosService } from 'app/services/gastos/gastos.service';
import { MatDatepickerToggle, MatDatepicker } from "@angular/material/datepicker";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DialogCrearGastoComponent } from './dialogs/dialog-crear-gasto/dialog-crear-gasto.component';
import { DialogDetalleGastoComponent } from './dialogs/dialog-detalle-gasto/dialog-detalle-gasto.component';



@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Shared
    BreadcrumbComponent,
    // Angular Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatFormFieldModule,
    MatDatepicker,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMenuModule,
    ReactiveFormsModule,
  ],
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.scss',
  animations: [rowsAnimation],
})
export class GastosComponent implements OnInit {

  columnDefinitions = [
    { def: 'id', label: 'ID', type: 'text', visible: true },
    { def: 'b_movil', label: 'Origen', type: 'icon', visible: true },
    { def: 'concepto', label: 'Concepto', type: 'text', visible: true },
    { def: 'cantidad', label: 'Cantidad', type: 'text', visible: true },
    { def: 'costo', label: 'Costo', type: 'text', visible: true },
    { def: 'tipo_gasto', label: 'Tipo Gasto', type: 'text', visible: true },
    { def: 'fecha', label: 'Fecha', type: 'text', visible: true },
    { def: 'usuario_crea', label: 'Usuario', type: 'text', visible: true },
    { def: 'actions', label: 'Acciones', type: 'actions', visible: true }

  ];



  dataSource = new MatTableDataSource<any>([]);
  isLoading = true
  private destroy$ = new Subject<void>();
  fechaInicio!: Date;
  fechaFin!: Date;
  totalGastos: number = 0;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;


  constructor(private gastosService: GastosService, private snackBar: MatSnackBar,
    private detalleGastoDialog: MatDialog,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    const hoy = new Date();
    this.fechaInicio = hoy;
    this.fechaFin = hoy;
    this.loadData();
  }

  addNew() {
    this.openDialog();
  }

  openDialog() {
    let varDirection: Direction =
      localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';

    const dialogRef = this.dialog.open(DialogCrearGastoComponent, {
      width: '60vw',
      maxWidth: '100vw',
      panelClass: 'custom-dialog-container',
      direction: varDirection,
      autoFocus: false,
      data: {
        action: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // 🔄 recargar tabla completa (más seguro)
        this.loadData();

        this.showNotification(
          'snackbar-success',
          'Gasto agregado correctamente',
          'bottom',
          'center'
        );
      }
    });
  }


  refresh() {
    this.loadData();
  }

  verDetalles(row: any) {
    console.log('Ver detalles del gasto:', row);
    this.detalleGastoDialog.open(DialogDetalleGastoComponent, {
      width: '95vw',
      maxWidth: '1200px',
      height: 'auto',
      maxHeight: '95vh',
      data: row
    });
  }




  loadData() {
    const token = localStorage.getItem('token') || '';

    //const idSucursal = this.data.sucursal.id_sucursal;
    this.isLoading = true;

    this.gastosService.getGastos().subscribe({
      next: (data: any) => {
        // Filtrar por rango de fechas en Angular
        // Comparación en fecha LOCAL: toISOString() desplazaba el día por
        // la zona horaria y ocultaba los gastos del día por la noche.
        const aFechaLocal = (fecha: Date): string => {
          const y = fecha.getFullYear();
          const m = String(fecha.getMonth() + 1).padStart(2, '0');
          const d = String(fecha.getDate()).padStart(2, '0');
          return `${y}-${m}-${d}`;
        };

        const gastosFiltrados = (data.data || []).filter((item: any) => {
          const fechaGastoStr = aFechaLocal(new Date(item.d_fecha_gasto));
          return fechaGastoStr >= aFechaLocal(this.fechaInicio) && fechaGastoStr <= aFechaLocal(this.fechaFin);
        });

        // Mapear al formato de las columnas
        this.dataSource.data = gastosFiltrados.map((item: any) => ({
          id: item.id_gasto,
          id_tipo_gasto: item.id_tipo_gasto,
          id_tipos_evidencias: item.id_tipos_evidencias,

          //id_sucursal: item.id_sucursal,

          cantidad: item.n_cantidad,
          costo: item.n_costo,
          concepto: item.s_concepto,

          evidencia: item.s_evidencias ?? null,
          tipo_evidencia: item.id_tipos_evidencias ?? null,
          url_evidencia: item.url_evidencia ?? null,

          fecha: item.d_fecha_gasto,
          fecha_creacion: item.d_fecha_creacion,

          usuario_crea: item.usuario_crea,
          id_usuario_crea: item.id_usuario_crea,

          s_sucursal: item.s_sucursal,
          tipo_gasto: item.s_tipo_gasto,
          categoria_gasto: item.s_categoria_gasto,

          b_activo: item.b_activo,
          b_movil: item.b_movil ?? null,

        }));

        // Recalcular total
        this.totalGastos = this.dataSource.data
          .reduce((sum, item) => sum + Number(item.costo || 0), 0);

        this.isLoading = false;
        console.log('Gastos recibidos y filtrados:', this.dataSource.data);
      },
      error: () => {
        this.isLoading = false;
        console.error('Error al cargar gastos');
        this.showNotification(
          'snackbar-danger',
          'Error al cargar gastos',
          'top',
          'right'
        );
      }
    });
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }


  onFechaChange() {
    if (this.fechaInicio && this.fechaFin) {
      this.loadData();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // Recalcular total según lo filtrado
    this.totalGastos = this.dataSource.filteredData
      .reduce((sum, item) => sum + Number(item.costo || 0), 0);
  }



  calcularTotal() {
    this.totalGastos = this.dataSource.filteredData
      .reduce((sum, item) => sum + Number(item.costo || item.n_costo || 0), 0);
  }


  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }



  exportExcel() {
    // Datos normales con costo formateado
    const exportData = this.dataSource.filteredData.map((x: any) => ({
      'ID Gasto': x.id || '',
      'Concepto': x.concepto || '',
      'Cantidad': x.cantidad || '',
      'Costo': '$' + Number(x.costo).toFixed(2),
      'Tipo Gasto': x.tipo_gasto || '',
      'Categoría': x.categoria_gasto || '',
      'Fecha': x.fecha || '',
      'Sucursal': x.sucursal || ''
    }));

    // Calcular suma real de costos (numérico)
    const totalCosto = this.dataSource.filteredData
      .reduce((acc: number, item: any) => acc + (Number(item.costo) || 0), 0);

    // Agregar fila TOTAL ya formateada
    exportData.push({
      'ID Gasto': '',
      'Concepto': 'TOTAL',
      'Cantidad': '',
      'Costo': '$' + totalCosto.toFixed(2),
      'Tipo Gasto': '',
      'Categoría': '',
      'Fecha': '',
      'Sucursal': ''
    });

    TableExportUtil.exportToExcel(
      exportData,
      'Gastos_' + new Date().toISOString().slice(0, 10)
    );
  }


}
