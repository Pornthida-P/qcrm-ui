import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCreateCasePanelComponent } from './chat-create-case-panel.component';

describe('ChatCreateCasePanelComponent', () => {
    let component: ChatCreateCasePanelComponent;
    let fixture: ComponentFixture<ChatCreateCasePanelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChatCreateCasePanelComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatCreateCasePanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
