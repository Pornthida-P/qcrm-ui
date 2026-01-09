import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTypeTabComponent } from './case-type-tab.component';

describe('CaseTypeTabComponent', () => {
  let component: CaseTypeTabComponent;
  let fixture: ComponentFixture<CaseTypeTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseTypeTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseTypeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

