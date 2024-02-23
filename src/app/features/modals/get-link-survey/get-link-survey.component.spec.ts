import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetLinkSurveyComponent } from './get-link-survey.component';

describe('GetLinkSurveyComponent', () => {
    let component: GetLinkSurveyComponent;
    let fixture: ComponentFixture<GetLinkSurveyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GetLinkSurveyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GetLinkSurveyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
