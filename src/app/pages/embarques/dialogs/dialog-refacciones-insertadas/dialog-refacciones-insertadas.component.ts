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
import { environment } from 'environments/environment';
import { refaccionInsertadaModel } from 'app/models/refaccionInsertadaModel';
import { CommonModule } from '@angular/common';
// Animations
import Swal from "sweetalert2";
import { EmbarqueService } from 'app/services/embarque/embarque.service';
import { MatDividerModule } from "@angular/material/divider";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


export interface DialogData {
  id_refaccion: number;
  id_pre_registro_refaccion: number;
  action: string;
  refaccionInsertadaModel: refaccionInsertadaModel;
}

@Component({
  selector: 'app-dialog-refacciones-insertadas',
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
  templateUrl: './dialog-refacciones-insertadas.component.html',
  styleUrl: './dialog-refacciones-insertadas.component.scss'
})
export class DialogRefaccionesInsertadasComponent {
  dialogTitle: string;
  id_refaccion: number;
  id_pre_registro_refaccion: number;
  embarques: any;


  constructor(
    public dialogRef: MatDialogRef<DialogRefaccionesInsertadasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private EmbarqueService: EmbarqueService,
    private sanitizer: DomSanitizer
  ){
    this.dialogTitle = 'Embarques';
    console.log("Data: ", data);
    this.id_refaccion = data?.refaccionInsertadaModel?.id_refaccion;
    this.id_pre_registro_refaccion = data?.refaccionInsertadaModel?.id_pre_registro_refaccion;
  }


  ngOnInit() {
    if(this.id_refaccion){
      this.getEmbarquesRefaccionesInsertadas();
    }else{
      this.getEmbarquesRefaccionesInsertadasNuevas();
    }
  }


  getEmbarquesRefaccionesInsertadas(): void {
    Swal.fire({
      title: '¡Espere un momento!',
      html: 'Cargando datos...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.EmbarqueService.getEmbarquesRefaccion(this.id_refaccion).subscribe({
      next: (response: any) => {
        this.embarques = response;
        this.embarques = this.embarques.data;
        
        console.log("Embarques: ", this.embarques);
        Swal.close();
      },
      error: (error: any) => {
        Swal.close();
        Swal.fire('Error', 'Hubo un error', 'error');
        console.log(error);
      }
    }); 
  }


  getEmbarquesRefaccionesInsertadasNuevas(): void {
    Swal.fire({
      title: '¡Espere un momento!',
      html: 'Cargando datos...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });

    this.EmbarqueService.getEmbarquesPreRegistro(this.id_pre_registro_refaccion).subscribe({
      next: (response: any) => {
        this.embarques = response;
        this.embarques = this.embarques.data;
        
        console.log("Embarques: ", this.embarques);
        Swal.close();
      },
      error: (error: any) => {
        Swal.close();
        Swal.fire('Error', 'Hubo un error', 'error');
        console.log(error);
      }
    });
  }
}
