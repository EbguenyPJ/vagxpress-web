import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-panel-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss'],
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    CommonModule,
    RouterModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
  ],
  standalone: true,
})
export class CotizacionesComponent implements OnInit {
  breadscrums = [
    {
      title: 'Cotizaciones',
      items: ['Ventas'],
      active: 'Panel de Cotizaciones',
    },
  ];

  cotizacionesOptions: any[] = [];

  ngOnInit(): void {
    this.initializeMenuOptions();
  }

  private initializeMenuOptions(): void {
    const baseOptions = [
      {
        title: 'Cotización Manual',
        icon: 'edit_document',
        iconColorClass: 'icon-blue',
        description: 'Crear una cotización desde cero, seleccionando cada parte y servicio manualmente.',
        route: '/cotizaciones/manual',
        available: true,
      },
      {
        title: 'Cotización Semiautomatizada',
        icon: 'drive_file_rename_outline',
        iconColorClass: 'icon-green',
        description: 'Generar una cotización a partir de un set de servicios o refacciones precargados.',
        route: '#',
        available: true,
      },
    ];

    this.cotizacionesOptions = baseOptions.filter((opt) => opt.available);
  }
}
