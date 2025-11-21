import { TestBed } from '@angular/core/testing';

import { CallListService } from './call-list.service';

describe('CallListService', () => {
  let service: CallListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
