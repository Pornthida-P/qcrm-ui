import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChatPageComponent } from './chat-page.component';
import { ChatCreateCasePanelComponent } from '../chat-create-case-panel/chat-create-case-panel.component';
import { ChatSharedModule } from './chat-shared.module';

@NgModule({
    declarations: [ChatPageComponent, ChatCreateCasePanelComponent],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        NgSelectModule,
        ChatSharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: ChatPageComponent,
            },
        ]),
    ],
})
export class ChatPageModule {}
