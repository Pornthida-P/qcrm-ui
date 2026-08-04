import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ChatSubnavComponent } from './chat-subnav.component';

@NgModule({
    declarations: [ChatSubnavComponent],
    imports: [CommonModule, RouterModule, TranslateModule],
    exports: [ChatSubnavComponent, TranslateModule],
})
export class ChatSharedModule {}
