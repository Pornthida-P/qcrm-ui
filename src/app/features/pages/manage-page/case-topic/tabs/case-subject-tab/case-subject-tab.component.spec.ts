import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSubjectTabComponent } from './case-subject-tab.component';

describe('CaseSubjectTabComponent', () => {
    let component: CaseSubjectTabComponent;
    let fixture: ComponentFixture<CaseSubjectTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CaseSubjectTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CaseSubjectTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
