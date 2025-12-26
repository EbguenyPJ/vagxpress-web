import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CortesService } from 'app/services/cortes/cortes.service';
import { OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-dialog-nuevo-corte',
  imports: [MatIcon, MatDialogModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    NgFor,
    FormsModule],
  templateUrl: './dialog-nuevo-corte.component.html',
  styleUrl: './dialog-nuevo-corte.component.scss'
})
export class DialogNuevoCorteComponent implements OnInit {

  constructor(private cortesService: CortesService) { }



  // Fecha del GET (SE USA TAMBIÉN PARA EL POST)
  fechaConsulta: string = '';

  // Datos generales
  tipoCorte: number | null = null;
  descripcion: string = '';
  comentario: string = '';

  consultaCorte: any = null;
  totalDia: number = 0;
  ventasVisible = false;

  ventasCorte: any[] = [];
  totalVentasDia: number = 0;

  // Montos editables (sin inicializar en 0)
  montoCredito: number | null = null;
  montoEfectivo: number | null = null;
  montoTarjetaCredito: number | null = null;
  montoTarjetaDebito: number | null = null;
  montoTransferencia: number | null = null;


  // Bancos
  bancosCredito: any[] = [];
  bancosEfectivo: any[] = [];
  bancosTarjetaCredito: any[] = [];
  bancosDebito: any[] = [];
  bancosTransferencia: any[] = [];

  diferencia: number = 0;
  mostrarAdvertencia: boolean = false;

  evidencias: any[] = [];



  ngOnInit(): void {
    const hoy = new Date();
    this.fechaConsulta = hoy.toISOString().split('T')[0]; // yyyy-mm-dd
    this.cargarConsulta(this.fechaConsulta);
    this.cargarVentasCorte(this.fechaConsulta);
  }

  onFechaChange(event: any) {
    this.fechaConsulta = event.target.value;
    this.cargarConsulta(this.fechaConsulta);
    this.cargarVentasCorte(this.fechaConsulta); // para ventas
  }


  cargarConsulta(fecha?: string) {
    const token = localStorage.getItem('token') || '';

    // Limpiar datos antes de la nueva consulta
    this.consultaCorte = null;
    this.totalDia = 0;
    this.bancosCredito = [];
    this.bancosEfectivo = [];
    this.bancosTarjetaCredito = [];
    this.bancosDebito = [];
    this.bancosTransferencia = [];

    this.cortesService.getCorteCajaDesglosado(token, fecha).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.consultaCorte = resp;
          this.totalDia = parseFloat(resp.total_general);

          this.bancosCredito = resp.desglose_bancos.filter((b: any) => b.id_metodo_pago === 1);
          this.bancosEfectivo = resp.desglose_bancos.filter((b: any) => b.id_metodo_pago === 2);
          this.bancosTarjetaCredito = resp.desglose_bancos.filter((b: any) => b.id_metodo_pago === 3);
          this.bancosDebito = resp.desglose_bancos.filter((b: any) => b.id_metodo_pago === 4);
          this.bancosTransferencia = resp.desglose_bancos.filter((b: any) => b.id_metodo_pago === 5);
        } else {
          // Si no hay movimientos, aseguramos que todo esté limpio
          this.consultaCorte = null;
          this.totalDia = 0;
        }
      },
      error: (err) => {
        console.error(err);
        this.consultaCorte = null;
        this.totalDia = 0;
        this.bancosCredito = [];
        this.bancosEfectivo = [];
        this.bancosTarjetaCredito = [];
        this.bancosDebito = [];
        this.bancosTransferencia = [];
      }
    });
  }

  cargarVentasCorte(fecha?: string) {
    const token = localStorage.getItem('token') || '';

    // Limpiar datos antes de la nueva consulta
    this.ventasCorte = [];
    this.totalVentasDia = 0;

    this.cortesService.getVentasCorte(token, fecha).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.ventasCorte = resp.data;
          this.totalVentasDia = resp.total_dia || this.ventasCorte.reduce((sum, v) => sum + parseFloat(v.n_total), 0);
        } else {
          // Si no hay ventas, aseguramos que todo esté limpio
          this.ventasCorte = [];
          this.totalVentasDia = 0;
        }
      },
      error: (err) => {
        console.error(err);
        this.ventasCorte = [];
        this.totalVentasDia = 0;
      }
    });
  }



  getMontoMetodo(idMetodo: number): string {
    if (!this.consultaCorte) return '0.00';
    const metodo = this.consultaCorte.resumen.find((r: any) => r.id_metodo_pago === idMetodo);
    return metodo ? metodo.total_dinero : '0.00';
  }


  toggleVentasVisibility() {
    this.ventasVisible = !this.ventasVisible;
  }


  guardarCorte() {
    if (!this.tipoCorte) {
      Swal.fire({ icon: 'warning', title: 'Seleccione el tipo de corte' });
      return;
    }

    const token = localStorage.getItem('token') || '';
    const idUsuario = Number(localStorage.getItem('id_usuario'));
    if (!idUsuario) {
      Swal.fire({ icon: 'error', title: 'No se pudo identificar el usuario' });
      return;
    }

    const data = {
      id_tipo_corte: this.tipoCorte,
      id_usuario: idUsuario,
      fecha_corte: this.fechaConsulta,
      monto_efectivo: this.montoEfectivo || 0,
      monto_transferencia: this.montoTransferencia || 0,
      monto_credito: this.montoCredito || 0,
      monto_tarjeta_debito: this.montoTarjetaDebito || 0,
      monto_tarjeta_credito: this.montoTarjetaCredito || 0,
      descripcion: this.descripcion || '',
      comentario: this.comentario || ''
    };

    console.log('Payload que se enviará al backend:', data);

    const totalUser = this.totalUsuario;
    const totalSistema = this.totalDia;

    // Verificar si hay diferencia (menor o mayor)
    if (totalUser !== totalSistema) {
      Swal.fire({
        icon: 'warning',
        title: 'Diferencia detectada',
        html: `El monto ingresado no coincide con el total del sistema.<br>
             Total Usuario: <b>$${totalUser}</b><br>
             Total Sistema: <b>$${totalSistema}</b><br>
             ¿Desea continuar de todas formas?`,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmarGuardarCorte(token, data);
        } else {
          console.log('Usuario canceló el guardado del corte');
        }
      });
    } else {
      // Si coincide exactamente, guardar directamente
      this.confirmarGuardarCorte(token, data);
    }
  }


  // Función separada para no duplicar código
  private confirmarGuardarCorte(token: string, data: any) {
    Swal.fire({ title: 'Guardando corte...', didOpen: () => Swal.showLoading(), allowOutsideClick: false });

    this.cortesService.crearCorte(token, data).subscribe({
      next: (resp: any) => {
        if (!resp?.id_corte) {
          Swal.fire({ icon: 'error', title: 'No se recibió el ID del corte' });
          return;
        }

        const idCorte = resp.id_corte;

        if (this.evidencias.length > 0) {
          Swal.fire({ title: 'Subiendo evidencias...', didOpen: () => Swal.showLoading(), allowOutsideClick: false });

          this.cortesService.subirEvidenciasCorte(token, idCorte, this.evidencias).subscribe({
            next: (res) => {
              this.evidencias = [];
              Swal.fire({ icon: 'success', title: 'Corte y evidencias guardados correctamente' });
              this.resetMontos();
              this.cargarConsulta(this.fechaConsulta);
              this.cargarVentasCorte(this.fechaConsulta);
              console.log('Respuesta al subir evidencias:', res);
            },
            error: (err) => {
              console.error('Error al subir evidencias:', err);
              Swal.fire({ icon: 'warning', title: 'Corte guardado, pero error al subir evidencias' });
              this.resetMontos();
            }
          });

        } else {
          Swal.fire({ icon: 'success', title: 'Corte guardado correctamente' });
          this.resetMontos();
          this.cargarConsulta(this.fechaConsulta);
          this.cargarVentasCorte(this.fechaConsulta);
        }
      },
      error: (err) => {
        console.error('Error al guardar el corte:', err);
        Swal.fire({ icon: 'error', title: 'Error al guardar el corte' });
      }
    });
  }

  resetMontos() {
    this.montoCredito = null;
    this.montoEfectivo = null;
    this.montoTarjetaCredito = null;
    this.montoTarjetaDebito = null;
    this.montoTransferencia = null;
  }



  get totalUsuario(): number {
    return (this.montoCredito || 0) +
      (this.montoEfectivo || 0) +
      (this.montoTarjetaCredito || 0) +
      (this.montoTarjetaDebito || 0) +
      (this.montoTransferencia || 0);
  }

  verificarDiferencia() {
    const totalUser = this.totalUsuario || 0;
    const totalSistema = this.totalDia || 0;

    this.diferencia = totalUser - totalSistema;
    this.mostrarAdvertencia = this.diferencia !== 0;
  }

  getMetodoIcon(metodo: string): string {
    const icons: { [key: string]: string } = {
      'Crédito': 'payments',
      'Efectivo': 'payments',
      'Tarjeta Crédito': 'credit_card',
      'Tarjeta Débito': 'credit_card',
      'Transferencia': 'account_balance'
    };
    return icons[metodo] || 'payment';
  }

  onSeleccionarEvidencia(event: any, idMetodoPago: number) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      this.evidencias.push({
        archivo: files[i],
        id_metodo_pago: idMetodoPago,
        id_tipo_evidencia: 1,
        s_descripcion: `Evidencia método ${idMetodoPago}`
      });
    }

    event.target.value = '';
  }



}
