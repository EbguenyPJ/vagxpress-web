import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PuntoVentaService } from 'app/services/punto-venta/punto-venta.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-procesar-venta',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './dialog-procesar-venta.component.html',
  styleUrls: ['./dialog-procesar-venta.component.scss']
})
export class DialogProcesarVentaComponent implements OnInit {

  @ViewChild('seccionCuentasBancarias') seccionCuentasBancarias!: ElementRef;

  metodosPago: any[] = [];
  clientes: any[] = [];
  cuentasBancarias: any[] = [];
  cuentasBancariasFiltradas: any[] = [];
  clientesFiltrados: Observable<any[]>;

  id_metodo_pago_seleccionado: any = null;
  id_cuenta_bancaria_seleccionada: any = null;
  clienteControl = new FormControl();
  clienteSeleccionado: any = null;

  isLoadingMetodos: boolean = true;
  isLoadingClientes: boolean = true;
  isLoadingCuentas: boolean = true;
  isProcessing: boolean = false;

  n_total_texto: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogProcesarVentaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private posService: PuntoVentaService,
    private snackBar: MatSnackBar
  ) {
    this.clientesFiltrados = this.clienteControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filtrarClientes(value || ''))
    );
  }

  ngOnInit(): void {
    this.convertirTotalATexto();
    this.cargarClientes();
    this.cargarMetodosPago();
    this.cargarCuentasBancarias();
  }

  private _filtrarClientes(value: string): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.clientes.filter(cliente =>
      cliente.s_nombre_cliente.toLowerCase().includes(filterValue)
    );
  }

  mostrarNombreCliente(cliente: any): string {
    if (!cliente) return '';
    const saldo = parseFloat(cliente.saldo_actual) || 0;
    return `${cliente.s_nombre_cliente} (Crédito disponible: $${saldo.toFixed(2)})`;
  }

  cargarClientes(): void {
    this.isLoadingClientes = true;
    this.posService.getClientes().subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.clientes = response.data || [];
          // Seleccionar por defecto "Publico General" (id_cliente: 1)
          const publicoGeneral = this.clientes.find(c => c.id_cliente === 1);
          if (publicoGeneral) {
            this.clienteSeleccionado = publicoGeneral;
            this.clienteControl.setValue(publicoGeneral);
          }
          this.isLoadingClientes = false;
        }
      },
      (error) => {
        console.error('Error al cargar clientes:', error);
        this.isLoadingClientes = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los clientes'
        });
      }
    );
  }

  cargarMetodosPago(): void {
    this.isLoadingMetodos = true;
    this.posService.getMetodosPago().subscribe(
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

  cargarCuentasBancarias(): void {
    this.isLoadingCuentas = true;
    this.posService.getCuentasBancarias().subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.cuentasBancarias = response.data || [];
          this.isLoadingCuentas = false;
        }
      },
      (error) => {
        console.error('Error al cargar cuentas bancarias:', error);
        this.isLoadingCuentas = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las cuentas bancarias'
        });
      }
    );
  }

  onClienteSeleccionado(cliente: any): void {
    this.clienteSeleccionado = cliente;
  }

  seleccionarMetodo(id_metodo: any): void {
    if (this.id_metodo_pago_seleccionado === id_metodo) {
      this.id_metodo_pago_seleccionado = null;
      this.id_cuenta_bancaria_seleccionada = null;
      this.cuentasBancariasFiltradas = [];
    } else {
      this.id_metodo_pago_seleccionado = id_metodo;
      this.id_cuenta_bancaria_seleccionada = null;
      this.filtrarCuentasBancarias(id_metodo);
    }
  }

  filtrarCuentasBancarias(id_metodo_pago: any): void {
    this.cuentasBancariasFiltradas = this.cuentasBancarias.filter(
      (cuenta: any) => cuenta.id_metodo_pago === id_metodo_pago
    );

    // Hacer scroll a la sección de cuentas bancarias si hay resultados
    if (this.cuentasBancariasFiltradas.length > 0) {
      setTimeout(() => {
        if (this.seccionCuentasBancarias) {
          this.seccionCuentasBancarias.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }

  seleccionarCuentaBancaria(id_cuenta: any): void {
    if (this.id_cuenta_bancaria_seleccionada === id_cuenta) {
      this.id_cuenta_bancaria_seleccionada = null;
    } else {
      this.id_cuenta_bancaria_seleccionada = id_cuenta;
    }
  }

  esCuentaSeleccionada(id_cuenta: any): boolean {
    return this.id_cuenta_bancaria_seleccionada === id_cuenta;
  }

  esMetodoSeleccionado(id_metodo: any): boolean {
    return this.id_metodo_pago_seleccionado === id_metodo;
  }

  finalizarVenta(): void {
    if (!this.clienteSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Cliente requerido',
        text: 'Selecciona un cliente para continuar'
      });
      return;
    }

    if (!this.id_metodo_pago_seleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Método de pago requerido',
        text: 'Selecciona un método de pago para continuar'
      });
      return;
    }

    // Validar cuenta bancaria si hay cuentas filtradas disponibles
    if (this.cuentasBancariasFiltradas.length > 0 && !this.id_cuenta_bancaria_seleccionada) {
      Swal.fire({
        icon: 'warning',
        title: 'Cuenta bancaria requerida',
        text: 'Selecciona una cuenta bancaria para continuar'
      });
      return;
    }

    this.isProcessing = true;

    const payload = {
      ...this.data.payload,
      id_cliente: this.clienteSeleccionado.id_cliente,
      id_metodo_pago: this.id_metodo_pago_seleccionado,
      id_cuenta_bancaria: this.id_cuenta_bancaria_seleccionada || null
    };

    this.posService.crearVenta(payload).subscribe(
      (response: any) => {
        this.isProcessing = false;
        if (response.status === 'success') {
          // Swal.fire({
          //   toast: true,
          //   position: 'top-end',
          //   icon: 'success',
          //   title: 'Venta procesada exitosamente',
          //   showConfirmButton: false,
          //   timer: 3000
          // });
          // this.dialogRef.close(true);
          if (response.ticket_base64) {
          this.descargarTicket(response.ticket_base64, `ticket_venta_${response.data.id_venta || 'new'}.pdf`);
        }

        // 2. Cerrar el modal y notificar éxito
        this.dialogRef.close(true); // Retorna true al cerrar
        this.snackBar.open('Venta realizada con éxito', 'Cerrar', { duration: 3000 });
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

  descargarTicket(base64String: string, fileName: string) {
  const source = `data:application/pdf;base64,${base64String}`;
  const link = document.createElement("a");
  link.href = source;
  link.download = fileName;
  link.click();
  // Opcional: Si quieres que se abra la ventana de impresión directamente
  // en lugar de descargar, podrías usar un iframe o window.open,
  // pero la descarga es lo más seguro.
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
