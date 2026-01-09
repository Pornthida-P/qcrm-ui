import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseCodeManagementComponent } from './case-code-management.component';

describe('CaseCodeManagementComponent', () => {
  let component: CaseCodeManagementComponent;
  let fixture: ComponentFixture<CaseCodeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseCodeManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseCodeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

