import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGroupTabComponent } from './service-group-tab.component';

describe('ServiceGroupTabComponent', () => {
  let component: ServiceGroupTabComponent;
  let fixture: ComponentFixture<ServiceGroupTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceGroupTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceGroupTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

