import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenciasRepartoDialogComponent } from './evidencias-reparto-dialog.component';

describe('EvidenciasRepartoDialogComponent', () => {
  let component: EvidenciasRepartoDialogComponent;
  let fixture: ComponentFixture<EvidenciasRepartoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvidenciasRepartoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenciasRepartoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
