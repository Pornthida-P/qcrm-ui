import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ELearningEditComponent } from './e-learning-edit.component';

describe('ELearningEditComponent', () => {
    let component: ELearningEditComponent;
    let fixture: ComponentFixture<ELearningEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ELearningEditComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ELearningEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
