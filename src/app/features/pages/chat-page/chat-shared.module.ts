import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatSubnavComponent } from './chat-subnav.component';

@NgModule({
    declarations: [ChatSubnavComponent],
    imports: [CommonModule, RouterModule],
    exports: [ChatSubnavComponent],
})
export class ChatSharedModule {}
