import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatCardModule, MatCard, MatCardTitle, MatCardContent, MatCardHeader } from '@angular/material/card';
import { PermisosComponent } from './permisos/permisos.component';

@Component({
  selector: 'app-configuraciones',
  imports: [MatCard, MatCardTitle, MatCardContent, MatCardHeader, MatIcon, CommonModule, MatTooltipModule],
  templateUrl: './configuraciones.component.html',
  styleUrl: './configuraciones.component.scss'
})
export class ConfiguracionesComponent implements OnInit {

  breadscrums = [
    {
      title: 'Configuraciones',
      items: ['Sistema'],
      active: 'Configuraciones',
    },
  ];

  configOptions: any[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initializeMenuOptions();
  }

  private initializeMenuOptions(): void {
    // Obtenemos el usuario directamente del localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userType = currentUser?.id_tipo_usuario;

    // Opciones base del menú
    const baseOptions = [
      {
        title: 'Administrar Empleados',
        icon: 'manage_accounts',
        iconColorClass: 'icon-red',
        description: 'Administrar permisos de usuarios y roles',
        route: 'empleados',
        available: false
      },
      {
        title: 'Administrar Usuarios',
        icon: 'people_alt',
        iconColorClass: 'icon-blue',
        description: 'Gestionar usuarios del sistema',
        route: 'usuarios',
        available: false
      },
        {
        title: 'Administrar Permisos',
        icon: 'admin_panel_settings',
        iconColorClass: 'icon-red',
        description: 'Administrar permisos de usuarios y roles',
        route: 'permisos',
        available: false
      },

    ];

    if (userType) {
      const isAdminOrSupervisor = ["1", "2"].includes(String(userType));

      this.configOptions = baseOptions.map(option => ({
        ...option,
        available: isAdminOrSupervisor || option.available
      }));
    } else {
      this.configOptions = baseOptions.filter(option => option.available);
    }
  }

  navegar(ruta: string): void {
    this.router.navigate([ruta]);
  }

}
