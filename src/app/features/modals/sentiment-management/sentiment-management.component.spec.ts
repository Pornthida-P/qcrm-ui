import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentManagementComponent } from './sentiment-management.component';

describe('SentimentManagementComponent', () => {
  let component: SentimentManagementComponent;
  let fixture: ComponentFixture<SentimentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SentimentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

