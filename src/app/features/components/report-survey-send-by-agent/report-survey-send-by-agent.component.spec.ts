import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSurveySendByAgentComponent } from './report-survey-send-by-agent.component';

describe('ReportSurveySendByAgentComponent', () => {
  let component: ReportSurveySendByAgentComponent;
  let fixture: ComponentFixture<ReportSurveySendByAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSurveySendByAgentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportSurveySendByAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
