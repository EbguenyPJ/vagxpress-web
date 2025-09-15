import { DOCUMENT, NgClass } from '@angular/common';
import { Component, Inject, ElementRef, OnInit, Renderer2, OnDestroy,} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '@config';
import { InConfiguration, AuthService, RightSidebarService } from '@core';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';


// agregados
// import { AlertasService } from 'app/services/alertas/alertas.service';
import { VersionesService } from 'app/services/versiones/versiones.service';
import { AcercaDeComponent } from './dialogs/acerca-de/acerca-de.component';

// Animations
import Swal from "sweetalert2";

interface Notifications {
  message: string;
  time: string;
  icon: string;
  color: string;
  status: string;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        RouterLink,
        NgClass,
        MatButtonModule,
        MatMenuModule,
        NgScrollbar,
        MatBadgeModule,
        CommonModule,
        MatIconModule,
        MatTooltipModule
    ],
    providers: [RightSidebarService]
})

export class HeaderComponent implements OnInit
{
  public config!: InConfiguration;
  isNavbarCollapsed = true;
  isOpenSidebar?: boolean;
  docElement?: HTMLElement;
  isFullScreen = false;
  usuario : any;
  // alertasGeneral: any;
  // ultimaAlertaId: number | null = null;
  // tieneNuevaAlerta: boolean = false;
  // contadorNuevasAlertas: number = 0;
  // stopAlertasPolling = false;
  // alertasVistasIds: number[] = [];
  // nuevasAlertasIds: number[] = [];

  ultimaVersionGeneral: any;
  id_tipo_usuario: any;




  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private rightSidebarService: RightSidebarService,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    // public alertasService: AlertasService,
    public VersionesService: VersionesService,
    public dialog: MatDialog,
  ) { }

  ngOnInit()
  {
    this.config = this.configService.configData;
    this.docElement = document.documentElement;
    const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.usuario = currentUserData['username'];
    this.id_tipo_usuario = currentUserData['id_tipo_usuario'];

    // this.obtenerAlertasConDelay();

    this.getUltimaVersion();

  }


  // obtenerAlertasConDelay() {
  //   if (this.stopAlertasPolling) {
  //     return;
  //   }

  //   this.getAlertas(); // Llamada inicial

  //   setTimeout(() => {
  //     this.obtenerAlertasConDelay(); // Llamada recursiva con retraso
  //   }, 60000); // Cada 60 segundos
  //   console.log("Se obtiene la alerta cada minuto")
  // }

  // async getAlertas() {
  //   this.alertasService.getAlertas("").subscribe(async (respuesta: any) => {
  //     let nuevasAlertas = respuesta.data;

  //     if (nuevasAlertas.length > 0) {
  //       const nuevaUltimaId = nuevasAlertas[0].id_alerta;

  //       if (this.ultimaAlertaId === null) {
  //         this.ultimaAlertaId = nuevaUltimaId;
  //         this.nuevasAlertasIds = [];
  //       } else if (nuevaUltimaId !== this.ultimaAlertaId) {
  //         const nuevasIds = nuevasAlertas
  //           .filter((a: any) => a.id_alerta > this.ultimaAlertaId!)
  //           .map((a: any) => a.id_alerta);

  //         this.nuevasAlertasIds = [...new Set([...this.nuevasAlertasIds, ...nuevasIds])];
  //         this.ultimaAlertaId = nuevaUltimaId;
  //       }
  //     }
  //     const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
  //     const userId = currentUserData?.id_usuario;

  //     for (const alerta of nuevasAlertas) {
  //       const requiereCierre = alerta.b_recordatorio_cierre === 1 || alerta.b_recordatorio_cierre === '1';
  //       const horaCierreDate = alerta.t_hora_cierre;
  //       const horaActualDate = alerta.hora_actual;
  //       const id_usuario = alerta.id_usuario;
  //       //console.log("Datos de la alerta: ", requiereCierre, horaCierreDate, horaActualDate, id_usuario);

  //       // Mostrar la alerta roja, solo si es nueva, requiere cierre y la hora de cierre es mayor que la hora actual
  //       if ((requiereCierre && userId === id_usuario) && horaActualDate > horaCierreDate) {
  //         //console.log("Entra al if");
  //         await Swal.fire({
  //           html: `
  //             <div style="display: flex; flex-direction: column; align-items: center;">
  //               <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWVoeW10Z2tiZjQ1cWJ4aHJpcXo5ZHRldGlhdHJhbW1xbHQwNnp2MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MF0QiCa9JPEI6HiaCK/giphy.gif" style="width: 80px; margin-bottom: 15px;">
  //               <p style="color: #fff; text-align: center;">${alerta.s_descripcion}</p>
  //               <br>
  //               <p style="color: #fff; text-align: center;">Alerta #${alerta.id_alerta}</p>
  //             </div>
  //           `,
  //           width: 600,
  //           padding: "3em",
  //           background: "#000",
  //           backdrop: `
  //             rgba(255, 0, 0, 1)
  //             no-repeat
  //           `
  //         });
  //       }
  //     }

  //     // Marcar alertas
  //     this.alertasGeneral = nuevasAlertas.map((alerta: any) => ({
  //       ...alerta,
  //       esNueva: this.nuevasAlertasIds.includes(alerta.id_alerta)
  //     }));

  //     this.contadorNuevasAlertas = this.nuevasAlertasIds.length;
  //     this.tieneNuevaAlerta = this.contadorNuevasAlertas > 0;

  //   }, error => {
  //     // Manejo de error si lo necesitas
  //   });
  // }

  // marcarAlertasComoVistas() {
  //   this.nuevasAlertasIds = [];
  //   this.alertasGeneral = this.alertasGeneral.map((alerta: any) => ({
  //     ...alerta,
  //     esNueva: false
  //   }));
  //   this.contadorNuevasAlertas = 0;
  //   this.tieneNuevaAlerta = false;
  // }




  // onClickAlerta(alertaId: number) {
  //   // Cuando el usuario hace clic en una alerta para verla
  //   if (!this.alertasVistasIds.includes(alertaId)) {
  //     this.alertasVistasIds.push(alertaId);

  //     // Guardar en localStorage para persistir
  //     localStorage.setItem('alertasVistasIds', JSON.stringify(this.alertasVistasIds));
  //   }

  //   // Actualizar la lista para que esa alerta ya no tenga badge
  //   this.alertasGeneral = this.alertasGeneral.map((alerta: any) => ({
  //     ...alerta,
  //     esNueva: alerta.id_alerta !== alertaId && alerta.esNueva
  //   }));

  //   // Opcional: reducir contador si lo usas
  //   this.contadorNuevasAlertas = this.alertasGeneral.filter((a: any) => a.esNueva).length;
  //   this.tieneNuevaAlerta = this.contadorNuevasAlertas > 0;
  // }


  onClickCampana() {
    // this.tieneNuevaAlerta = false;
    // this.contadorNuevasAlertas = 0; // Reiniciamos el contador
  }


  async getUltimaVersion() {
    this.VersionesService.getUltimaVersion("").subscribe(
      (respuesta: any) => {
        const data = respuesta?.data;
        if (Array.isArray(data) && data.length > 0) {
          this.ultimaVersionGeneral = data[0];
          console.log("ultima version: ", this.ultimaVersionGeneral);
        } else {
          Swal.fire('Advertencia', 'No se encontró ninguna versión registrada', 'warning');
        }
      },
      error => {
        Swal.fire('Error', 'No se pudo cargar la última versión', 'error');
      }
    );
  }


  callFullscreen()
  {
    if (!this.isFullScreen) {
      if (this.docElement?.requestFullscreen != null) {
        this.docElement?.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }


  mobileMenuSidebarOpen(event: Event, className: string)
  {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }


  callSidemenuCollapse()
  {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
    }
  }


  logout()
  {
    // this.stopAlertasPolling = true;
    this.authService.logout().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(['/authentication/signin']);
      }
    });
  }

  abrirVersiones()
  {
    this.router.navigate(['/versiones']);
  }

  abrirAcercaDe(ultimaVersionGeneral: any)
  {
    console.log("Abrir dialog acerca de con ultima version: ", ultimaVersionGeneral);
    const dialogRef = this.dialog.open(AcercaDeComponent, {
      width: '60vw',
      maxWidth: '100vw',
      autoFocus: false,
      data: { ultimaVersionGeneral },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // actualizamos la tabla después de cerrar el dialog
    });
  }

  mostrarBoton(id_tipo_usuario: any){
    if(id_tipo_usuario === 1 || id_tipo_usuario === '1'){
      return true;
    }
    else{
      return false;
    }
  }

  quitarHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  quitarCierrede(html: string): string {
    return html.replace('Cierre de', 'Nueva');
  }

}//End class
