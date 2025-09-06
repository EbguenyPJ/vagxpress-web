import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBox2Component } from './info-box2.component';

describe('InfoBox2Component', () => {
  let component: InfoBox2Component;
  let fixture: ComponentFixture<InfoBox2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoBox2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoBox2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
