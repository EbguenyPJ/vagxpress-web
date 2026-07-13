import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { DOCUMENT, NgClass } from '@angular/common';
import { Component, Inject, ElementRef, OnInit, Renderer2, HostListener, OnDestroy, } from '@angular/core';
import { AuthService } from '@core';
import { RouteInfo } from './sidebar.metadata';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgScrollbar } from 'ngx-scrollbar';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { SidebarService } from './sidebar.service';
import { DialogPerfilUsuarioComponent } from './dialogs/dialog-perfil-usuario/dialog-perfil-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { environment } from 'environments/environment';
import { EmpleadosService } from 'app/services/empleados/empleados.service';
import { UsuariosService } from 'app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    NgScrollbar,
    MatButtonModule,
    RouterLink,
    MatTooltipModule,
    RouterLinkActive,
    NgClass,
  ],
})
export class SidebarComponent extends UnsubscribeOnDestroyAdapter implements OnInit, OnDestroy {
  public sidebarItems!: RouteInfo[];
  public innerHeight?: number;
  public bodyTag!: HTMLElement;
  private openCategories: Set<string> = new Set<string>();
  public isSidebarCollapsed = false;
  private bodyClassObserver!: MutationObserver;
  listMaxHeight?: string;
  listMaxWidth?: string;

  userImg?: string;
  userType?: string;
  headerHeight = 60;
  currentRoute?: string;

  nombreDeUsuario?: any;
  idUsuario?: any;

  userPhoto: string = 'empleado-default.png';
  ruta_img: string = environment.imgUrl + "/empleados/";
  userPosition: string = '';

  hasWebAccess: boolean = false;
  hasMobileAccess: boolean = false;

  modulos: any;
  routes: any = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private empleadosService: EmpleadosService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private sidebarService: SidebarService,
    public dialog: MatDialog,
  ) {
    super();
    this.subs.sink = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
  }


  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }

  callToggleMenu(event: Event, length: number): void {
    if (!this.isValidLength(length) || !this.isValidEvent(event)) {
      return;
    }

    const parentElement = (event.target as HTMLElement).closest('li');
    if (!parentElement) {
      return;
    }

    const activeClass = parentElement.classList.contains('active');

    if (activeClass) {
      this.renderer.removeClass(parentElement, 'active');
    } else {
      this.renderer.addClass(parentElement, 'active');
    }
  }

  private isValidLength(length: number): boolean {
    return length > 0;
  }

  private isValidEvent(event: Event): boolean {
    return event && event.target instanceof HTMLElement;
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }

  

  ngOnInit() {
    // if (this.authService.currentUserValue) {
    //   this.sidebarService.getRouteInfo().subscribe((routes: RouteInfo[]) => {
    //     this.sidebarItems = routes.filter((sidebarItem) => sidebarItem);

    //     console.log("Modulos: ", this.sidebarItems);
    //   });
    // }
    const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    //console.log("Currente user: ", currentUserData)
    this.loadUserData();
    this.nombreDeUsuario = currentUserData['s_nombre_completo'];
    this.idUsuario = currentUserData['id_usuario'];


    this.userPosition = currentUserData['s_tipo_empleado'] ? currentUserData['s_tipo_empleado'] : 'Manager';
    this.loadEmployeePhoto();

    this.getUserModules();
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
    this.isSidebarCollapsed = this.document.body.classList.contains('submenu-closed');
    this.bodyClassObserver = new MutationObserver(() => {
      this.isSidebarCollapsed = this.document.body.classList.contains('submenu-closed');
    });

    this.bodyClassObserver.observe(this.document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }




  // async getUserModules()
  // {
  //   this.sidebarService.getUserModules('',this.idUsuario).subscribe
  //   (data =>
  //     {
  //       this.modulos = data;
  //       this.modulos = this.modulos.data;

  //       this.modulos.forEach((element:any) => {
  //         this.routes.push({
  //           "path": element.s_ruta,
  //           "title": element.s_modulo,
  //           "iconType": "material-icons-outlined",
  //           "icon": element.s_icono,
  //           "class": "",
  //           "groupTitle": false,
  //           "badge": "",
  //           "badgeClass": "",
  //           "submenu": []
  //         });
  //       });

  //       this.sidebarItems = this.routes;

  //       console.log("Modulos: ", this.sidebarItems);
  //     }
  //   )
  // }




  getUserModules(): void {
    forkJoin({
      modulos: this.sidebarService.getUserModules(this.idUsuario),
      categorias: this.sidebarService.getCategoriasModulos(),
    }).subscribe(({ modulos: moduloResponse, categorias: categoriaResponse }) => {
      const modulos = moduloResponse.data;
      const categorias = categoriaResponse.data;

      this.sidebarItems = categorias
        .map((categoria) => {
          const modulosDeCategoria = modulos.filter(
            (mod) => mod.id_categoria_modulo === categoria['id_categoria_modulo'],
          );

          // Una categoría solo aparece si el usuario tiene módulos en ella.
          if (modulosDeCategoria.length === 0) {
            return null;
          }

          return {
            path: '',
            title: String(categoria['s_categoria_modulo'] ?? ''),
            iconType: '',
            icon: '',
            class: '',
            badge: '',
            badgeClass: '',
            groupTitle: true,
            submenu: modulosDeCategoria.map((mod) => ({
              path: mod.s_ruta ?? '',
              title: mod.s_modulo ?? '',
              iconType: 'material-icons-outlined',
              icon: mod.s_icono ?? '',
              class: '',
              groupTitle: false,
              badge: '',
              badgeClass: '',
              submenu: [] as RouteInfo[],
            })),
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
    });
  }































  perfilDeUsuario() {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }

    const dialogRef = this.dialog.open(DialogPerfilUsuarioComponent, {
      width: '60vw',
      maxWidth: '100vw',
      //height: '90vh',
      data: { id_usuario: this.idUsuario },
      direction: varDirection,
      autoFocus: false,
    });
  }

  loadEmployeePhoto() {
    const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const idEmpleado = currentUserData['id_empleado'];

    if (!idEmpleado) {
      this.userPhoto = 'empleado-default.png';
      return;
    }

    this.empleadosService.getEmpleados().subscribe({
      next: (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          const empleado = response.data.find((e: any) => e.id_empleado == idEmpleado);

          if (empleado && empleado.s_foto_empleado) {
            this.userPhoto = empleado.s_foto_empleado.trim() || 'empleado-default.png';
          } else {
            this.userPhoto = 'empleado-default.png';
          }
        } else {
          this.userPhoto = 'empleado-default.png';
        }
      },
      error: (err: any) => {
        this.userPhoto = 'empleado-default.png';
      }
    });
  }

  getPhotoPath(): string {
    const fotoValida = this.userPhoto &&
      this.userPhoto.trim() !== '' &&
      this.userPhoto !== 'null' &&
      this.userPhoto !== 'undefined' &&
      !this.userPhoto.includes('default');

    const foto = fotoValida ? this.userPhoto : 'empleado-default.png';

    let baseUrl = this.ruta_img.endsWith('/') ?
      this.ruta_img :
      this.ruta_img + '/';

    let fotoPath = foto.startsWith('/') ?
      foto.substring(1) :
      foto;

    if (baseUrl.includes('empleados/') && fotoPath.includes('empleados/')) {
      fotoPath = fotoPath.replace('empleados/', '');
    }

    return baseUrl + fotoPath;
  }

  loadUserData(): void {
    const sesion = this.authService.sesion;
    if (!sesion) {
      return;
    }

    this.usuariosService.getPerfil(sesion.id_usuario).subscribe({
      next: (response: any) => {
        if (response?.data) {
          const userData = response.data;
          this.hasWebAccess = userData.b_usuario_web == 1;
          this.hasMobileAccess = userData.b_usuario_movil == 1;
        }
      },
      error: (err: any) => {
        console.error('Error al cargar datos del usuario', err);
      }
    });
  }

  toggleCategory(categoryTitle: string): void {
    if (this.openCategories.has(categoryTitle)) {
      this.openCategories.delete(categoryTitle);
    } else {
      this.openCategories.add(categoryTitle);
    }
  }

  isCategoryOpen(categoryTitle: string): boolean {
    return this.openCategories.has(categoryTitle);
  }









  initLeftSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      this.isSidebarCollapsed = true;
    }
  }
  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      this.isSidebarCollapsed = true;
    } else {
      this.isSidebarCollapsed = false;
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.bodyClassObserver) {
      this.bodyClassObserver.disconnect();
    }
  }
}
