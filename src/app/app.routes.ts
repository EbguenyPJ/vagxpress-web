import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './authentication/page404/page404.component';
// import { UsuariosComponent } from './pages/administracion/usuarios/usuarios.component';
// import { EmpleadosComponent } from './pages/administracion/empleados/empleados.component';
import { CatalogoRefaccionesComponent } from './pages/catalogoRefacciones/catalogoRefacciones.component';
import { CotizacionesComponent } from './pages/cotizaciones/cotizaciones.component';
import { CotizacionManualComponent } from './pages/cotizaciones/cotizacion-manual/cotizacion-manual.component';
import { PuntoVentaComponent } from './pages/punto-venta/punto-venta.component';
import { BitacoraVentasComponent } from './pages/bitacora-ventas/bitacora-ventas.component';
import { RequisicionesComponent } from './pages/compras/requisiciones/requisiciones.component';
import { OrdenesCompraComponent } from './pages/compras/ordenes-compra/ordenes-compra.component';

export const APP_ROUTE: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
      },

      // ----------------------- Rutas Definidas por desarrolladores -----------------------
      // { path: 'usuarios', component: UsuariosComponent },
      // { path: 'empleados', component: EmpleadosComponent },
      { path: 'refacciones', component: CatalogoRefaccionesComponent },
      {
        path: 'cotizaciones',
        children: [
          { path: '', component: CotizacionesComponent },
          { path: 'manual', component: CotizacionManualComponent },
        ],
      },
      { path: 'punto-venta', component: PuntoVentaComponent },
      { path: 'bitacora-ventas', component: BitacoraVentasComponent },
      { path: 'requisiciones', component: RequisicionesComponent },
      { path: 'ordenes-compra', component: OrdenesCompraComponent },
    ],
  },

  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
  },
  { path: '**', component: Page404Component },
];
