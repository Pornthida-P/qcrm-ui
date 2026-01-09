import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGroupManagementComponent } from './service-group-management.component';

describe('ServiceGroupManagementComponent', () => {
  let component: ServiceGroupManagementComponent;
  let fixture: ComponentFixture<ServiceGroupManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceGroupManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceGroupManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

