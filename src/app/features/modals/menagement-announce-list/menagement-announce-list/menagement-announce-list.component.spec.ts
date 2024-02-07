import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenagementAnnounceListComponent } from './menagement-announce-list.component';

describe('MenagementAnnounceListComponent', () => {
  let component: MenagementAnnounceListComponent;
  let fixture: ComponentFixture<MenagementAnnounceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenagementAnnounceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenagementAnnounceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
