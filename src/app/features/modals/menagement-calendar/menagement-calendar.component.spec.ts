import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenagementCalendarComponent } from './menagement-calendar.component';

describe('MenagementCalendarComponent', () => {
  let component: MenagementCalendarComponent;
  let fixture: ComponentFixture<MenagementCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenagementCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenagementCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
