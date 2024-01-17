import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ELearningComponent } from './e-learning.component';

describe('ELearningComponent', () => {
  let component: ELearningComponent;
  let fixture: ComponentFixture<ELearningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ELearningComponent]
    });
    fixture = TestBed.createComponent(ELearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
