import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatReportsPageComponent } from './chat-reports-page.component';
import { ChatSharedModule } from '../chat-page/chat-shared.module';

@NgModule({
    declarations: [ChatReportsPageComponent],
    imports: [
        CommonModule,
        ChatSharedModule,
        RouterModule.forChild([{ path: '', component: ChatReportsPageComponent }]),
    ],
})
export class ChatReportsModule {}
