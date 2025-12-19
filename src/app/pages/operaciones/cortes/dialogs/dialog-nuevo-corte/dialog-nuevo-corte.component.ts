import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-dialog-nuevo-corte',
  imports: [MatIcon,  MatDialogModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './dialog-nuevo-corte.component.html',
  styleUrl: './dialog-nuevo-corte.component.scss'
})
export class DialogNuevoCorteComponent {

}
