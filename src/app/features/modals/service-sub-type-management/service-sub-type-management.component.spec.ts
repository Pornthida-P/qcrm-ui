import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSubTypeManagementComponent } from './service-sub-type-management.component';

describe('ServiceSubTypeManagementComponent', () => {
  let component: ServiceSubTypeManagementComponent;
  let fixture: ComponentFixture<ServiceSubTypeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceSubTypeManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceSubTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

