import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatBotPageComponent } from './chat-bot-page.component';
import { ChatSharedModule } from '../chat-page/chat-shared.module';

@NgModule({
    declarations: [ChatBotPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        ChatSharedModule,
        RouterModule.forChild([{ path: '', component: ChatBotPageComponent }]),
    ],
})
export class ChatBotModule {}
