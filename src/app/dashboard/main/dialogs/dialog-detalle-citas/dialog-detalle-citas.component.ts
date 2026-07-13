import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgClass, CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { DashboardService } from 'app/services/dashboard/dashboard.service';
import { environment } from 'environments/environment';
import { TableExportUtil } from '@shared';
import { rowsAnimation } from '@shared';

@Component({
  selector: 'app-dialog-detalle-citas',
  templateUrl: './dialog-detalle-citas.component.html',
  styleUrls: ['./dialog-detalle-citas.component.scss'],
  providers: [DatePipe],
  animations: [rowsAnimation],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatMenuModule
  ]
})
export class DialogDetalleCitasComponent implements OnInit {
  asesor: any;
  fechaInicio!: string;
  fechaFin!: string;
  url_img_empleados: string = environment.imgUrl + '/empleados/';
  displayedColumns: string[] = [];
  isLoading = true;
  dataSource = new MatTableDataSource<any>();

  columnDefinitions = [
    { def: 'fecha', label: 'Fecha', visible: true },
    { def: 'cliente', label: 'Cliente', visible: true },
    { def: 'vehiculo', label: 'Vehículo', visible: true },
    { def: 'servicio', label: 'Servicio solicitado', visible: true },
    { def: 'estatus', label: 'Estatus', visible: true }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogDetalleCitasComponent>,
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar
  ) {
    this.asesor = data.asesor;
    this.fechaInicio = data.fechaInicio;
    this.fechaFin = data.fechaFin;
  }

  ngOnInit(): void {
    this.displayedColumns = this.getDisplayedColumns();
    const id = this.asesor?.id_usuario_ventas || this.asesor?.id;
    if (!id) {
      console.error('ID del asesor no definido. Datos:', this.asesor);
      this.isLoading = false;
      return;
    }

    const token = localStorage.getItem('token') || '';
    this.dashboardService
      .getCitasPorEmpleado(token, id, this.fechaInicio, this.fechaFin)
      .subscribe({
        next: (res: any) => {
          this.dataSource.data = res.data || [];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = (data: any, filter: string) =>
            Object.values(data).some(value =>
              String(value).toLowerCase().includes(filter)
            );
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error al obtener citas del asesor:', err);
          this.isLoading = false;
        }
      });
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions.filter(cd => cd.visible).map(cd => cd.def);
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  getBadgeColor(estatus: number): string {
    switch (estatus) {
      case 1: return 'badge badge-info';
      case 2: return 'badge badge-warning';
      case 3: return 'badge badge-success';
      case 4: return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  }

  getBadgeLabel(estatus: number): string {
    switch (estatus) {
      case 1: return 'Agendada';
      case 2: return 'Reagendada';
      case 3: return 'Concretada';
      case 4: return 'Cancelada';
      default: return 'Desconocido';
    }
  }

  exportExcel(): void {
    const exportData = this.dataSource.filteredData.map((x) => ({
      'Fecha': x.fecha,
      'Cliente': x.cliente,
      'Vehículo': x.vehiculo,
      'Servicio solicitado': x.servicio,
      'Estatus': this.getBadgeLabel(x.estatus)
    }));
    TableExportUtil.exportToExcel(exportData, 'citas-asesor');
  }

  close(): void {
    this.dialogRef.close();
  }
}
