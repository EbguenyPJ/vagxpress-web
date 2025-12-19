import { TestBed } from '@angular/core/testing';

import { EmbarqueService } from './embarque.service';

describe('EmbarqueService', () => {
  let service: EmbarqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmbarqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
