import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialog, } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.scss'],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogContent,
    MatDialogClose
  ]
})

export class AcercaDeComponent {
  dialogTitle:    string;
  ultimaVersion:  string;
  fechaUltimaVersion: string;

  constructor(
    public dialogRef: MatDialogRef<AcercaDeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ultimaVersionGeneral: any },
  ) {
 
    const version = data.ultimaVersionGeneral;

    this.ultimaVersion = version.s_nombre_version;
    this.fechaUltimaVersion = version.d_fecha_actualizacion_version;

    this.dialogTitle = 'Acerca de';
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
