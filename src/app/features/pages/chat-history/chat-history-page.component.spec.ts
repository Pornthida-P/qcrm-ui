import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatHistoryPageComponent } from './chat-history-page.component';

describe('ChatHistoryPageComponent', () => {
    let component: ChatHistoryPageComponent;
    let fixture: ComponentFixture<ChatHistoryPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChatHistoryPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatHistoryPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
