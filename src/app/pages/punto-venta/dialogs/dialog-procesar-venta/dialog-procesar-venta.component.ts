import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PuntoVentaService } from 'app/services/punto-venta/punto-venta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-procesar-venta',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dialog-procesar-venta.component.html',
  styleUrls: ['./dialog-procesar-venta.component.scss']
})
export class DialogProcesarVentaComponent implements OnInit {

  metodosPago: any[] = [];
  id_metodo_pago_seleccionado: any = null;
  isLoadingMetodos: boolean = true;
  isProcessing: boolean = false;

  n_total_texto: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogProcesarVentaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private posService: PuntoVentaService
  ) {}

  ngOnInit(): void {
    this.convertirTotalATexto();
    this.cargarMetodosPago();
  }

  cargarMetodosPago(): void {
    this.isLoadingMetodos = true;
    this.posService.getMetodosPago(this.data.s_token).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.metodosPago = response.data || [];
          this.isLoadingMetodos = false;
        }
      },
      (error) => {
        console.error('Error al cargar métodos de pago:', error);
        this.isLoadingMetodos = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los métodos de pago'
        });
      }
    );
  }

  seleccionarMetodo(id_metodo: any): void {
    if (this.id_metodo_pago_seleccionado === id_metodo) {
      this.id_metodo_pago_seleccionado = null;
    } else {
      this.id_metodo_pago_seleccionado = id_metodo;
    }
  }

  esMetodoSeleccionado(id_metodo: any): boolean {
    return this.id_metodo_pago_seleccionado === id_metodo;
  }

  finalizarVenta(): void {
    if (!this.id_metodo_pago_seleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Método de pago requerido',
        text: 'Selecciona un método de pago para continuar'
      });
      return;
    }

    this.isProcessing = true;

    const payload = {
      ...this.data.payload,
      id_metodo_pago: this.id_metodo_pago_seleccionado
    };

    this.posService.crearVenta(this.data.s_token, payload).subscribe(
      (response: any) => {
        this.isProcessing = false;
        if (response.status === 'success') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Venta procesada exitosamente',
            showConfirmButton: false,
            timer: 3000
          });
          this.dialogRef.close(true);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudo procesar la venta'
          });
        }
      },
      (error) => {
        this.isProcessing = false;
        console.error('Error al procesar venta:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al procesar la venta. Intenta nuevamente.'
        });
      }
    );
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }

  convertirTotalATexto(): void {
    const total = this.data.n_total;
    const parteEntera = Math.floor(total);
    const parteDecimal = Math.round((total - parteEntera) * 100);

    const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    const convertirGrupo = (num: number): string => {
      if (num === 0) return '';
      if (num === 100) return 'CIEN';

      let texto = '';
      const c = Math.floor(num / 100);
      const d = Math.floor((num % 100) / 10);
      const u = num % 10;

      if (c > 0) texto += centenas[c] + ' ';

      if (d === 1) {
        texto += especiales[u] + ' ';
      } else {
        if (d > 0) texto += decenas[d];
        if (d > 0 && u > 0) texto += ' Y ';
        if (u > 0) texto += unidades[u];
      }

      return texto.trim();
    };

    let textoFinal = '';

    if (parteEntera === 0) {
      textoFinal = 'CERO PESOS';
    } else if (parteEntera < 1000) {
      textoFinal = convertirGrupo(parteEntera) + ' PESOS';
    } else {
      const miles = Math.floor(parteEntera / 1000);
      const resto = parteEntera % 1000;

      if (miles === 1) {
        textoFinal = 'MIL';
      } else {
        textoFinal = convertirGrupo(miles) + ' MIL';
      }

      if (resto > 0) {
        textoFinal += ' ' + convertirGrupo(resto);
      }

      textoFinal += ' PESOS';
    }

    if (parteDecimal > 0) {
      textoFinal += ' CON ' + parteDecimal.toString().padStart(2, '0') + '/100 M.N.';
    } else {
      textoFinal += ' 00/100 M.N.';
    }

    this.n_total_texto = textoFinal;
  }
}
