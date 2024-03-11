import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportChannelByAgentComponent } from './report-channel-by-agent.component';

describe('ReportChannelByAgentComponent', () => {
  let component: ReportChannelByAgentComponent;
  let fixture: ComponentFixture<ReportChannelByAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportChannelByAgentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportChannelByAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
