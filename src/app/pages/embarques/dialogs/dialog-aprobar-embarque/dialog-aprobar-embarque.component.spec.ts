import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAprobarEmbarqueComponent } from './dialog-aprobar-embarque.component';

describe('DialogAprobarEmbarqueComponent', () => {
  let component: DialogAprobarEmbarqueComponent;
  let fixture: ComponentFixture<DialogAprobarEmbarqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAprobarEmbarqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAprobarEmbarqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
