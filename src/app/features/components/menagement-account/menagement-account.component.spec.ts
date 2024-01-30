import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenagementAccountComponent } from './menagement-account.component';

describe('MenagementAccountComponent', () => {
  let component: MenagementAccountComponent;
  let fixture: ComponentFixture<MenagementAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenagementAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenagementAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
