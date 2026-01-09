import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSubTypeTabComponent } from './service-sub-type-tab.component';

describe('ServiceSubTypeTabComponent', () => {
    let component: ServiceSubTypeTabComponent;
    let fixture: ComponentFixture<ServiceSubTypeTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceSubTypeTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ServiceSubTypeTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
