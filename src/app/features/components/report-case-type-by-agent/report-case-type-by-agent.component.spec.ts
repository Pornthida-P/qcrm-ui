import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCaseTypeByAgentComponent } from './report-case-type-by-agent.component';

describe('ReportCaseTypeByAgentComponent', () => {
    let component: ReportCaseTypeByAgentComponent;
    let fixture: ComponentFixture<ReportCaseTypeByAgentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReportCaseTypeByAgentComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ReportCaseTypeByAgentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
