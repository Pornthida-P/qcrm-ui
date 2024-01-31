import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamActivitiesComponent } from './team-activities.component';

describe('TeamActivitiesComponent', () => {
  let component: TeamActivitiesComponent;
  let fixture: ComponentFixture<TeamActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamActivitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
