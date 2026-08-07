import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTopicTabComponent } from './case-topic-tab.component';

describe('CaseTopicTabComponent', () => {
    let component: CaseTopicTabComponent;
    let fixture: ComponentFixture<CaseTopicTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CaseTopicTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CaseTopicTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
