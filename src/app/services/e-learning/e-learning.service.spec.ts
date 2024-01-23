import { TestBed } from '@angular/core/testing';

import { ELearningService } from './e-learning.service';

describe('ELearningService', () => {
  let service: ELearningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ELearningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
