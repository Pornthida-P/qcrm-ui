import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTagListComponent } from './event-tag-list.component';

describe('EventTagListComponent', () => {
  let component: EventTagListComponent;
  let fixture: ComponentFixture<EventTagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTagListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
