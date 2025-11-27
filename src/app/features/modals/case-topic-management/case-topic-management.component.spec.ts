import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTopicManagementComponent } from './case-topic-management.component';

describe('CaseTopicManagementComponent', () => {
  let component: CaseTopicManagementComponent;
  let fixture: ComponentFixture<CaseTopicManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseTopicManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseTopicManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
