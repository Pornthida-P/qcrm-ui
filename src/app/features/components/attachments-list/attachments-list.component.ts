import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    faFileImage,
    faFilePdf,
    faFileWord,
    faFile,
    faDownload,
    faXmark,
    IconDefinition,
    faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Attachment } from 'src/app/shared/interface/attachment.interface';

@Component({
    selector: 'app-attachments-list',
    templateUrl: './attachments-list.component.html',
    styleUrl: './attachments-list.component.scss',
})
export class AttachmentsListComponent {
    @Input() attachments: Attachment[] = [];
    @Input() isAction: boolean = false;

    faPlus = faPlusCircle;

    ngOnInit(): void {}

    onDeletedAttachment(attachmentId: string) {
        this.attachments = this.attachments.filter((attachment) => attachment.attachmentId !== attachmentId);
    }
}
