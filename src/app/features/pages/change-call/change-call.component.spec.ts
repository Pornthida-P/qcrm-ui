import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCallComponent } from './change-call.component';

describe('ChangeCallComponent', () => {
  let component: ChangeCallComponent;
  let fixture: ComponentFixture<ChangeCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeCallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
