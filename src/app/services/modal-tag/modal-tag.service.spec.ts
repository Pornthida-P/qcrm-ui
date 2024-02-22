import { TestBed } from '@angular/core/testing';

import { ModalTagService } from './modal-tag.service';

describe('ModalTagService', () => {
  let service: ModalTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
