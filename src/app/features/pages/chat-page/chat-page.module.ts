import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ChatPageComponent } from './chat-page.component';
import { ChatSharedModule } from './chat-shared.module';

@NgModule({
    declarations: [ChatPageComponent],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
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
