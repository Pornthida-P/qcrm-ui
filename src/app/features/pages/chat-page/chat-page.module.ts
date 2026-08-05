import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ChatPageComponent } from './chat-page.component';
import { ChatCreateCasePanelComponent } from '../chat-create-case-panel/chat-create-case-panel.component';
import { ChatSharedModule } from './chat-shared.module';

@NgModule({
    declarations: [ChatPageComponent, ChatCreateCasePanelComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
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
