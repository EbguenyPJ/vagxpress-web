import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleCitasComponent } from './dialog-detalle-citas.component';

describe('DialogDetalleCitasComponent', () => {
  let component: DialogDetalleCitasComponent;
  let fixture: ComponentFixture<DialogDetalleCitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDetalleCitasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDetalleCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
