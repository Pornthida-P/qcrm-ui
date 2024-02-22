import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachmentsComponent } from './attachments.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FileSizePipe } from 'src/app/shared/pipe/file-size.pipe';

@NgModule({
    declarations: [AttachmentsComponent, FileSizePipe],
    imports: [CommonModule, FontAwesomeModule],
    exports: [AttachmentsComponent],
})
export class AttachmentsModule {}
