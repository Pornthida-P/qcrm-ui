import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatHistoryPageComponent } from './chat-history-page.component';
import { ChatSharedModule } from '../chat-page/chat-shared.module';

@NgModule({
    declarations: [ChatHistoryPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        ChatSharedModule,
        RouterModule.forChild([{ path: '', component: ChatHistoryPageComponent }]),
    ],
})
export class ChatHistoryModule {}
