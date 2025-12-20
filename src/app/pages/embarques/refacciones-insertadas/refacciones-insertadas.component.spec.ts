import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefaccionesInsertadasComponent } from './refacciones-insertadas.component';

describe('RefaccionesInsertadasComponent', () => {
  let component: RefaccionesInsertadasComponent;
  let fixture: ComponentFixture<RefaccionesInsertadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefaccionesInsertadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefaccionesInsertadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
