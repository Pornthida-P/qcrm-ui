import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTopicComponent } from './case-topic.component';

describe('CaseTopicComponent', () => {
  let component: CaseTopicComponent;
  let fixture: ComponentFixture<CaseTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseTopicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
