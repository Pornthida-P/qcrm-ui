import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatBroadcastPageComponent } from './chat-broadcast-page.component';
import { ChatSharedModule } from '../chat-page/chat-shared.module';

@NgModule({
    declarations: [ChatBroadcastPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        ChatSharedModule,
        RouterModule.forChild([{ path: '', component: ChatBroadcastPageComponent }]),
    ],
})
export class ChatBroadcastModule {}
