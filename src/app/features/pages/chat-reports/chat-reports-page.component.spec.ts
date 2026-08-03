import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatReportsPageComponent } from './chat-reports-page.component';

describe('ChatReportsPageComponent', () => {
    let component: ChatReportsPageComponent;
    let fixture: ComponentFixture<ChatReportsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChatReportsPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatReportsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
