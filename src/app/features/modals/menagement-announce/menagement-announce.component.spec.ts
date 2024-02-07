import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenagementAnnounceComponent } from './menagement-announce.component';

describe('MenagementAnnounceComponent', () => {
  let component: MenagementAnnounceComponent;
  let fixture: ComponentFixture<MenagementAnnounceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenagementAnnounceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenagementAnnounceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
