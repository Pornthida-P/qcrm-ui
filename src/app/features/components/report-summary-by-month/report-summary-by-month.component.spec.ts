import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSummaryByMonthComponent } from './report-summary-by-month.component';

describe('ReportSummaryByMonthComponent', () => {
  let component: ReportSummaryByMonthComponent;
  let fixture: ComponentFixture<ReportSummaryByMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSummaryByMonthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportSummaryByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
