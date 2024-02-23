import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopOversEventComponent } from './pop-overs-event.component';

describe('PopOversEventComponent', () => {
  let component: PopOversEventComponent;
  let fixture: ComponentFixture<PopOversEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopOversEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopOversEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
