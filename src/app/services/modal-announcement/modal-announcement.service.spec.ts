import { TestBed } from '@angular/core/testing';

import { ModalAnnouncementService } from './modal-announcement.service';

describe('ModalAnnouncementService', () => {
  let service: ModalAnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalAnnouncementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
