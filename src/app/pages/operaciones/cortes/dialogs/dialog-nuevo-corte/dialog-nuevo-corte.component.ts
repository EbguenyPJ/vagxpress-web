import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CortesService } from 'app/services/cortes/cortes.service';
import { OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { co } from '@fullcalendar/core/internal-common';


@Component({
  selector: 'app-dialog-nuevo-corte',
  imports: [MatIcon, MatDialogModule,
    MatButtonModule,
    MatIconModule, NgIf, NgFor],
  templateUrl: './dialog-nuevo-corte.component.html',
  styleUrl: './dialog-nuevo-corte.component.scss'
})
export class DialogNuevoCorteComponent implements OnInit {

  constructor(private cortesService: CortesService) { }

  consultaCorte: any = null;
  totalDia: number = 0;
  fechaConsulta: string = '';


  ventasCorte: any[] = [];
  totalVentasDia: number = 0;

  // Arrays filtrados por método de pago
  bancosCredito: any[] = [];
  bancosEfectivo: any[] = [];
  bancosTarjetaCredito: any[] = [];
  bancosDebito: any[] = [];
  bancosTransferencia: any[] = [];

  ngOnInit(): void {
    const hoy = new Date();
    this.fechaConsulta = hoy.toISOString().split('T')[0]; // formato yyyy-mm-dd
    this.cargarConsulta(this.fechaConsulta);
    this.cargarVentasCorte(this.fechaConsulta);
  }



  cargarConsulta(fecha?: string) {
    const token = localStorage.getItem('token') || '';
    this.cortesService.getCorteCajaDesglosado(token, fecha).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.consultaCorte = resp;
          this.totalDia = parseFloat(resp.total_general);
          console.log(this.consultaCorte);
          // Filtrado correcto según los IDs de método de pago
          this.bancosCredito = resp.desglose_bancos.filter((b: any) => b.id_metodo_pago === 1);
          this.bancosEfectivo = resp.desglose_bancos.filter((b: any) => b.id_metodo_pago === 2);
          this.bancosTarjetaCredito = resp.desglose_bancos.filter((b: any) => b.id_metodo_pago === 3);
          this.bancosDebito = resp.desglose_bancos.filter((b: any) => b.id_metodo_pago === 4);
          this.bancosTransferencia = resp.desglose_bancos.filter((b: any) => b.id_metodo_pago === 5);
        }
      },
      error: (err) => console.error(err)
    });
  }


  cargarVentasCorte(fecha?: string) {
    const token = localStorage.getItem('token') || '';
    this.cortesService.getVentasCorte(token, fecha).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.ventasCorte = resp.data;
          this.totalVentasDia = resp.total_dia || this.ventasCorte.reduce((sum, v) => sum + parseFloat(v.n_total), 0);
          console.log(this.ventasCorte);
        }
      },
      error: (err) => console.error(err)
    });
  }


  getMontoMetodo(idMetodo: number): string {
    if (!this.consultaCorte) return '0.00';
    const metodo = this.consultaCorte.resumen.find((r: any) => r.id_metodo_pago === idMetodo);
    return metodo ? metodo.total_dinero : '0.00';
  }
}
