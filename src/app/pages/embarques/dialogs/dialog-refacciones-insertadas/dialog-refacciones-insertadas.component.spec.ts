import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRefaccionesInsertadasComponent } from './dialog-refacciones-insertadas.component';

describe('DialogRefaccionesInsertadasComponent', () => {
  let component: DialogRefaccionesInsertadasComponent;
  let fixture: ComponentFixture<DialogRefaccionesInsertadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRefaccionesInsertadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRefaccionesInsertadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
