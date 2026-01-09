import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseCodeTabComponent } from './case-code-tab.component';

describe('CaseCodeTabComponent', () => {
    let component: CaseCodeTabComponent;
    let fixture: ComponentFixture<CaseCodeTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CaseCodeTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CaseCodeTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
