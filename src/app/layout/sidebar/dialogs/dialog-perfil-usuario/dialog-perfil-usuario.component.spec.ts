import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPerfilUsuarioComponent } from './dialog-perfil-usuario.component';

describe('DialogPerfilUsuarioComponent', () => {
  let component: DialogPerfilUsuarioComponent;
  let fixture: ComponentFixture<DialogPerfilUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogPerfilUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPerfilUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
