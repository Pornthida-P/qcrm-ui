import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEventListComponent } from './card-event-list.component';

describe('CardEventListComponent', () => {
  let component: CardEventListComponent;
  let fixture: ComponentFixture<CardEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEventListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
