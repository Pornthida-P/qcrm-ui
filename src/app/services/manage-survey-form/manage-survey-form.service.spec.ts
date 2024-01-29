import { TestBed } from '@angular/core/testing';

import { ManageSurveyFormService } from './manage-survey-form.service';

describe('ManageSurveyFormService', () => {
  let service: ManageSurveyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSurveyFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
