import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleGastoComponent } from './dialog-detalle-gasto.component';

describe('DialogDetalleGastoComponent', () => {
  let component: DialogDetalleGastoComponent;
  let fixture: ComponentFixture<DialogDetalleGastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDetalleGastoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetalleGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
