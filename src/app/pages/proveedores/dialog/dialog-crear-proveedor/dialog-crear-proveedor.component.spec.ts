import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearProveedorComponent } from './dialog-crear-proveedor.component';

describe('DialogCrearProveedorComponent', () => {
  let component: DialogCrearProveedorComponent;
  let fixture: ComponentFixture<DialogCrearProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCrearProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCrearProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
