import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenagementAppearanceComponent } from './menagement-appearance.component';

describe('MenagementAppearanceComponent', () => {
  let component: MenagementAppearanceComponent;
  let fixture: ComponentFixture<MenagementAppearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenagementAppearanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenagementAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
