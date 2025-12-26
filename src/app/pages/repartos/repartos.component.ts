import { Component } from '@angular/core';
import Swal from "sweetalert2";
import { CommonModule } from '@angular/common';


import { RepartosService } from 'app/services/repartos/repartos.service';
import { DetalleRepartoDialogComponent } from './dialogs/detalle-reparto-dialog/detalle-reparto-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-repartos',
  imports: [
    CommonModule
  ],
  templateUrl: './repartos.component.html',
  styleUrl: './repartos.component.scss'
})
export class RepartosComponent {
  repartos: any;


  constructor(
    private RepartosService: RepartosService,
    public dialog: MatDialog,
  ){

  }

  ngOnInit() {
    this.getRepartos();
  }



  async getRepartos(){
    Swal.fire({
      title: '¡Espere un momento!',
      html: 'Cargando datos...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.RepartosService.getAllRepartos("").subscribe({
      next: (response) => {
        this.repartos = response;
        this.repartos = this.repartos.data;
        
        console.log("Repartos: ", this.repartos);
        Swal.close();
      },
      error: (error) => {
        Swal.close();
        Swal.fire('Error', 'Hubo un error', 'error');
        console.log(error);
      }
    });
  }


  abrirDetalleReparto(id_orden: any){
    const dialogRef = this.dialog.open(DetalleRepartoDialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { id_orden: id_orden },
      autoFocus: false,
    });
  }
  
}
