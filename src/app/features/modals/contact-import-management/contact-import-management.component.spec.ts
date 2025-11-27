import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactImportManagementComponent } from './contact-import-management.component';

describe('ContactImportManagementComponent', () => {
  let component: ContactImportManagementComponent;
  let fixture: ComponentFixture<ContactImportManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactImportManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactImportManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
