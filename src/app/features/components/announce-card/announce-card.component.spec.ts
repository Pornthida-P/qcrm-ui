import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounceCardComponent } from './announce-card.component';

describe('AnnounceCardComponent', () => {
  let component: AnnounceCardComponent;
  let fixture: ComponentFixture<AnnounceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnounceCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnounceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
