import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeTabComponent } from './service-type-tab.component';

describe('ServiceTypeTabComponent', () => {
  let component: ServiceTypeTabComponent;
  let fixture: ComponentFixture<ServiceTypeTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTypeTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceTypeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

