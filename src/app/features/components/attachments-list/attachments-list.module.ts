import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachmentsListComponent } from './attachments-list.component';
import { AttachmentsModule } from '../attachments/attachments.module';

@NgModule({
    declarations: [AttachmentsListComponent],
    imports: [CommonModule, AttachmentsModule],
    exports: [AttachmentsListComponent],
})
export class AttachmentsListModule {}
