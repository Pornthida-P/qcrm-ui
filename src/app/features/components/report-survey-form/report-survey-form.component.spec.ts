import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSurveyFormComponent } from './report-survey-form.component';

describe('ReportSurveyFormComponent', () => {
    let component: ReportSurveyFormComponent;
    let fixture: ComponentFixture<ReportSurveyFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReportSurveyFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ReportSurveyFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
