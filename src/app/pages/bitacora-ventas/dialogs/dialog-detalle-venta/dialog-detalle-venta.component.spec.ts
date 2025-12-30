import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleVentaComponent } from './dialog-detalle-venta.component';

describe('DialogDetalleVentaComponent', () => {
  let component: DialogDetalleVentaComponent;
  let fixture: ComponentFixture<DialogDetalleVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDetalleVentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetalleVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
