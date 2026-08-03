import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMonitorPageComponent } from './chat-monitor-page.component';

describe('ChatMonitorPageComponent', () => {
    let component: ChatMonitorPageComponent;
    let fixture: ComponentFixture<ChatMonitorPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChatMonitorPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatMonitorPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
