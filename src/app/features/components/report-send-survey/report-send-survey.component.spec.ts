import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSendSurveyComponent } from './report-send-survey.component';

describe('ReportSendSurveyComponent', () => {
    let component: ReportSendSurveyComponent;
    let fixture: ComponentFixture<ReportSendSurveyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReportSendSurveyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ReportSendSurveyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
