import { TestBed } from '@angular/core/testing';

import { ModalUserService } from './modal-user.service';

describe('ModalUserService', () => {
  let service: ModalUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
