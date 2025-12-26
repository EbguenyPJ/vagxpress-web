import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleRepartoDialogComponent } from './detalle-reparto-dialog.component';

describe('DetalleRepartoDialogComponent', () => {
  let component: DetalleRepartoDialogComponent;
  let fixture: ComponentFixture<DetalleRepartoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleRepartoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleRepartoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
