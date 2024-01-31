import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenagementPasswordComponent } from './menagement-password.component';

describe('MenagementPasswordComponent', () => {
  let component: MenagementPasswordComponent;
  let fixture: ComponentFixture<MenagementPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenagementPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenagementPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
