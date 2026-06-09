import { TestBed } from '@angular/core/testing';

import { CaseServiceHierarchyService } from './case-service-hierarchy.service';

describe('CaseServiceHierarchyService', () => {
  let service: CaseServiceHierarchyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseServiceHierarchyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
