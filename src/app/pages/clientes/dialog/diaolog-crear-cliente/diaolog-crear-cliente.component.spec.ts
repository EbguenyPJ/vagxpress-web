import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaologCrearClienteComponent } from './diaolog-crear-cliente.component';

describe('DiaologCrearClienteComponent', () => {
  let component: DiaologCrearClienteComponent;
  let fixture: ComponentFixture<DiaologCrearClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaologCrearClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaologCrearClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
