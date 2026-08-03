import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatMonitorPageComponent } from './chat-monitor-page.component';
import { ChatSharedModule } from '../chat-page/chat-shared.module';

@NgModule({
    declarations: [ChatMonitorPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        ChatSharedModule,
        RouterModule.forChild([{ path: '', component: ChatMonitorPageComponent }]),
    ],
})
export class ChatMonitorModule {}
