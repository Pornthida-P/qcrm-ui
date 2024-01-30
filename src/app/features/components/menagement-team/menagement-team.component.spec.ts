import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenagementTeamComponent } from './menagement-team.component';

describe('MenagementTeamComponent', () => {
  let component: MenagementTeamComponent;
  let fixture: ComponentFixture<MenagementTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenagementTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenagementTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
