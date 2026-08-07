import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSubjectManagementComponent } from './case-subject-management.component';

describe('CaseSubjectManagementComponent', () => {
    let component: CaseSubjectManagementComponent;
    let fixture: ComponentFixture<CaseSubjectManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CaseSubjectManagementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CaseSubjectManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
