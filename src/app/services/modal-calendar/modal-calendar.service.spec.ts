import { TestBed } from '@angular/core/testing';

import { ModalCalendarService } from './modal-calendar.service';

describe('ModalCalendarService', () => {
  let service: ModalCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
