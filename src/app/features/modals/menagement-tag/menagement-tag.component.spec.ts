import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenagementTagComponent } from './menagement-tag.component';

describe('MenagementTagComponent', () => {
  let component: MenagementTagComponent;
  let fixture: ComponentFixture<MenagementTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenagementTagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenagementTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
