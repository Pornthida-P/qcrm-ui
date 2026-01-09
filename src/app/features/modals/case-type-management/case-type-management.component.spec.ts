import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTypeManagementComponent } from './case-type-management.component';

describe('CaseTypeManagementComponent', () => {
  let component: CaseTypeManagementComponent;
  let fixture: ComponentFixture<CaseTypeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseTypeManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

