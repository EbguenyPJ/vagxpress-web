import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialog, } from '@angular/material/dialog';
import { Component, ElementRef, Inject, OnInit, signal, ViewChild } from '@angular/core';
import { Validators, UntypedFormGroup, ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectionListChange } from '@angular/material/list';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { environment } from 'environments/environment';
import { refaccionInsertadaModel } from 'app/models/refaccionInsertadaModel';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from "@angular/material/divider";
import Swal from "sweetalert2";




export interface DialogData {
  evidencias: any;
  tipo: any;
}




@Component({
  selector: 'app-evidencias-reparto-dialog',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogClose,
    MatNativeDateModule,
    MatMomentDateModule,
    MatCardModule,
    MatAutocompleteModule,
    MatExpansionModule,
    DragDropModule,
    CommonModule,
    MatDividerModule
  ],
  templateUrl: './evidencias-reparto-dialog.component.html',
  styleUrl: './evidencias-reparto-dialog.component.scss'
})
export class EvidenciasRepartoDialogComponent {
  evidencias: any;
  tipo: any;
  indexActual = 0;
  url: any;

  constructor(
    public dialogRef: MatDialogRef<EvidenciasRepartoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialog: MatDialog,
  ){
    this.evidencias =  data.evidencias;
    this.tipo = data.tipo;
    console.log("Evidencias: ", this.evidencias);
    console.log("Tipo: ", this.tipo);
    if(this.tipo === 1){
      this.url = environment.imgUrl + "/evidenciasVXM/imgEvidenciasSalidaReparto/";
    }
    if(this.tipo === 2){
      this.url = environment.imgUrl + "/evidenciasVXM/imgEvidenciasFinReparto/";
    }
    if(this.tipo === 3){
      this.url = environment.imgUrl + "/evidenciasVXM/imgFirmas/";
    }
  }



  anterior() {
    if (this.indexActual > 0) {
      this.indexActual--;
    }
  }

  siguiente() {
    if (this.indexActual < this.evidencias.length - 1) {
      this.indexActual++;
    }
  }

}
