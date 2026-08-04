import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ChatSettingsPageComponent } from './chat-settings-page.component';
import { ChatSharedModule } from '../chat-page/chat-shared.module';

@NgModule({
    declarations: [ChatSettingsPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ChatSharedModule,
        RouterModule.forChild([{ path: '', component: ChatSettingsPageComponent }]),
    ],
})
export class ChatSettingsModule {}
