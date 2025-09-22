import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-cotizacion-manual',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    BreadcrumbComponent
  ],
  templateUrl: './cotizacion-manual.component.html',
  styleUrl: './cotizacion-manual.component.scss'
})
export class CotizacionManualComponent {
  breadscrums = [
    {
      title: 'Cotización Manual',
      items: ['Ventas', 'Cotizaciones'],
      active: 'Crear',
    },
  ];
}
