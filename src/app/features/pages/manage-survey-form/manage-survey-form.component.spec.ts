import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSurveyFormComponent } from './manage-survey-form.component';

describe('ManageSurveyFormComponent', () => {
  let component: ManageSurveyFormComponent;
  let fixture: ComponentFixture<ManageSurveyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageSurveyFormComponent]
    });
    fixture = TestBed.createComponent(ManageSurveyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
