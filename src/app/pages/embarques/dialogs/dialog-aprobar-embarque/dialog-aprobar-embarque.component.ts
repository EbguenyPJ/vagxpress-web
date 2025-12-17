import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialog, } from '@angular/material/dialog';
import { Component, Inject, OnInit, signal } from '@angular/core';
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
import { conexion } from 'app/conexion';
import { embarqueModel } from 'app/models/embarqueModel';
import { CommonModule } from '@angular/common';
// Animations
import Swal from "sweetalert2";



import { EmbarqueService } from 'app/services/embarque/embarque.service';
import { MatDividerModule } from "@angular/material/divider";




export interface DialogData {
  id_embarque: number;
  action: string;
  embarqueModel: embarqueModel;
  
}

@Component({
  selector: 'app-dialog-aprobar-embarque',
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
  templateUrl: './dialog-aprobar-embarque.component.html',
  styleUrl: './dialog-aprobar-embarque.component.scss'
})
export class DialogAprobarEmbarqueComponent {
  // Variables globales
  action: string;
  dialogTitle: string;
  embarque: any;
  id_embarque: any;

  constructor(
    public dialogRef: MatDialogRef<DialogAprobarEmbarqueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private EmbarqueService: EmbarqueService,
  ){
    this.action = data.action;
    this.dialogTitle = 'Aprobar Embarque';
    this.id_embarque = data.embarqueModel.id_embarque;
    console.log("Data: ", data);
    
  }


  ngOnInit() {
    this.getEmbarque();
  }



  async getEmbarque(){
    Swal.fire({
      title: '¡Espere un momento!',
      html: 'Cargando datos...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.EmbarqueService.getEmbarque("", this.id_embarque).subscribe({
      next: (response) => {
        this.embarque = response;
        this.embarque = this.embarque.data;
        console.log("Embarque: ", this.embarque);
        Swal.close();
      },
      error: (error) => {
        Swal.close();
        Swal.fire('Error', 'Hubo un error', 'error');
        console.log(error);
      }
    });
  }

}
