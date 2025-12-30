import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CotizacionService } from 'app/services/cotizacion/cotizacion.service';
import { ClienteService } from 'app/services/cliente/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog-guardar-cotizacion',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './dialog-guardar-cotizacion.component.html',
  styleUrl: './dialog-guardar-cotizacion.component.scss'
})
export class DialogGuardarCotizacionComponent implements OnInit {

  clienteControl = new FormControl();
  clientes: any[] = [];
  clientesFiltrados: Observable<any[]>;
  isLoadingClientes = true;
  isGuardando = false;
  clienteSeleccionado: any = null;

  constructor(
    public dialogRef: MatDialogRef<DialogGuardarCotizacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cotizacionService: CotizacionService,
    private clienteService: ClienteService
  ) {
    this.clientesFiltrados = this.clienteControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filtrarClientes(value || ''))
    );
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.isLoadingClientes = true;

    this.clienteService.getClientes(this.data.s_token).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.clientes = response.data || [];

          // Seleccionar cliente con id_cliente = 1 por defecto
          const clienteDefault = this.clientes.find((c: any) => c.id_cliente === 1);
          if (clienteDefault) {
            this.clienteSeleccionado = clienteDefault;
            this.clienteControl.setValue(clienteDefault);
          }
        }
        this.isLoadingClientes = false;
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

  private _filtrarClientes(value: string): any[] {
    if (typeof value !== 'string') {
      return this.clientes;
    }

    const filterValue = value.toLowerCase();
    return this.clientes.filter((cliente: any) =>
      cliente.s_nombre_cliente?.toLowerCase().includes(filterValue) ||
      cliente.s_razon_social?.toLowerCase().includes(filterValue) ||
      cliente.s_rfc?.toLowerCase().includes(filterValue)
    );
  }

  mostrarCliente(cliente: any): string {
    if (!cliente) return '';
    if (typeof cliente === 'string') return cliente;
    return cliente.s_nombre_cliente || cliente.s_razon_social || '';
  }

  onClienteSeleccionado(event: any): void {
    this.clienteSeleccionado = event.option.value;
  }

  guardarCotizacion(): void {
    if (!this.clienteSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Cliente requerido',
        text: 'Debes seleccionar un cliente para continuar'
      });
      return;
    }

    this.isGuardando = true;

    // Construir payload
    const payload = {
      id_cliente: this.clienteSeleccionado.id_cliente,
      id_usuario: this.data.id_usuario,
      refacciones: this.data.carrito.map((item: any) => ({
        id_refaccion: item.producto.id_refaccion,
        n_cantidad: item.n_cantidad,
        id_porcentaje_utilidad: item.id_porcentaje_utilidad
      }))
    };

    this.cotizacionService.crearCotizacion(this.data.s_token, payload).subscribe(
      (response: any) => {
        this.isGuardando = false;
        if (response.status === 'success') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Cotización guardada correctamente',
            showConfirmButton: false,
            timer: 3000
          });
          this.dialogRef.close(true);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'No se pudo guardar la cotización'
          });
        }
      },
      (error) => {
        console.error('Error al guardar cotización:', error);
        this.isGuardando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al guardar la cotización'
        });
      }
    );
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}
