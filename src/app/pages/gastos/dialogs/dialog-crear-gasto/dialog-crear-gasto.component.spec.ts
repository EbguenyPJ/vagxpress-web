import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearGastoComponent } from './dialog-crear-gasto.component';

describe('DialogCrearGastoComponent', () => {
  let component: DialogCrearGastoComponent;
  let fixture: ComponentFixture<DialogCrearGastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCrearGastoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCrearGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
