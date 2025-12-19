import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAsignarPermisosComponent } from './dialog-asignar-permisos.component';

describe('DialogAsignarPermisosComponent', () => {
  let component: DialogAsignarPermisosComponent;
  let fixture: ComponentFixture<DialogAsignarPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAsignarPermisosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAsignarPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
