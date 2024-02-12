import { TestBed } from '@angular/core/testing';

import { ModalTeamService } from './modal-team.service';

describe('ModalTeamService', () => {
  let service: ModalTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
