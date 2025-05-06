import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSurveySummaryComponent } from './report-survey-summary.component';

describe('ReportSurveySummaryComponent', () => {
  let component: ReportSurveySummaryComponent;
  let fixture: ComponentFixture<ReportSurveySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSurveySummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportSurveySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
