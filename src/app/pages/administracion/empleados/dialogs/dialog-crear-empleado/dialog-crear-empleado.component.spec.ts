import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearEmpleadoComponent } from './dialog-crear-empleado.component';

describe('DialogCrearEmpleadoComponent', () => {
  let component: DialogCrearEmpleadoComponent;
  let fixture: ComponentFixture<DialogCrearEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCrearEmpleadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCrearEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
