import { Component, ViewChild } from '@angular/core';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmbarquesComponent } from '../embarques.component';
import { RefaccionesInsertadasComponent } from '../refacciones-insertadas/refacciones-insertadas.component';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  imports: [
    MatTabsModule, 
    MatIconModule, 
    EmbarquesComponent, 
    RefaccionesInsertadasComponent,
    CommonModule
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  tabs = ['First', 'Second', 'Third'];
  selected = new UntypedFormControl(0);

  @ViewChild(EmbarquesComponent) embarquesComponent?: EmbarquesComponent;
  @ViewChild(RefaccionesInsertadasComponent) refaccionesInsertadasComponent!: RefaccionesInsertadasComponent;

  showEmbarques = true;
  showRefaccionesInsertadas = true;



  onTabChange(event: MatTabChangeEvent) {

    if (event.index === 0) {
      this.showRefaccionesInsertadas = false; // Fuerza desmontar
      setTimeout(() => {
        this.showEmbarques = true; // Vuelve a montar
        //this.citasDiaComponent?.loadData();
      });
    }

    if (event.index === 1) {
      this.showEmbarques = false; // Fuerza desmontar
      setTimeout(() => {
        this.showRefaccionesInsertadas = true; // Vuelve a montar
        //this.citasComponent?.loadData();
      });
    }

  }

  addTab(selectAfterAdding: boolean) {
    this.tabs.push('New');
    if (selectAfterAdding) {
      this.selected.setValue(this.tabs.length - 1);
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
