import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCaseDetailComponent } from './report-case-detail.component';

describe('ReportCaseDetailComponent', () => {
  let component: ReportCaseDetailComponent;
  let fixture: ComponentFixture<ReportCaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCaseDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportCaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
