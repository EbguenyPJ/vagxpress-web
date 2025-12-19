import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNuevoCorteComponent } from './dialog-nuevo-corte.component';

describe('DialogNuevoCorteComponent', () => {
  let component: DialogNuevoCorteComponent;
  let fixture: ComponentFixture<DialogNuevoCorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogNuevoCorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogNuevoCorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
