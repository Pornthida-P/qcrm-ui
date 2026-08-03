import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSettingsPageComponent } from './chat-settings-page.component';

describe('ChatSettingsPageComponent', () => {
    let component: ChatSettingsPageComponent;
    let fixture: ComponentFixture<ChatSettingsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChatSettingsPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatSettingsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
