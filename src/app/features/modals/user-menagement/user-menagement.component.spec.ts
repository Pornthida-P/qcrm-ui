import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMenagementComponent } from './user-menagement.component';

describe('UserMenagementComponent', () => {
  let component: UserMenagementComponent;
  let fixture: ComponentFixture<UserMenagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserMenagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
