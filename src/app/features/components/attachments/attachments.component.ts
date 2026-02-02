import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    IconDefinition,
    faDownload,
    faEye,
    faFile,
    faFileExcel,
    faFileImage,
    faFilePdf,
    faFileText,
    faFileWord,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { catchError } from 'rxjs';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { Attachment } from 'src/app/shared/interface/attachment.interface';

@Component({
    selector: 'app-attachments',
    templateUrl: './attachments.component.html',
    styleUrl: './attachments.component.scss',
})
export class AttachmentsComponent implements OnInit {
    @Input() attachment?: Attachment;
    @Input() isShowToolbar: boolean = false;
    @Input() mode?: 'view' | 'edit' | 'add';
    @Output() deleteAttachmentId: EventEmitter<string> = new EventEmitter<string>();

    faFileImage = faFileImage;
    faFileDdf = faFilePdf;
    faFileWord = faFileWord;
    faFileExcel = faFileExcel;
    faFileText = faFileText;
    faFile = faFile;
    faEye = faEye;
    faDownload = faDownload;
    faXmark = faXmark;

    constructor(private attachmentService: AttachmentService, private sweetalertServices: SweetAlertService) {}

    ngOnInit(): void {}

    getIconClass(fileType: string): IconDefinition {
        switch (fileType) {
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
                return faFileImage;
            case 'application/pdf':
                return faFilePdf;
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return faFileWord;
            case 'application/vnd.ms-excel':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return faFileExcel;
            case 'text/plain':
                return faFileText;
            default:
                return faFile;
        }
    }

    onClickViewAttachment(attachment: Attachment) {
        if (attachment.filepath) {
            this.attachmentService.view(attachment.filepath);
        } else {
            this.sweetalertServices.warning('alert.internetProblem');
        }
    }

    onClickDownloadAttachment(attachment: Attachment) {
        if (attachment.filepath) {
            this.attachmentService.download(attachment.filepath);
        } else {
            this.sweetalertServices.warning('alert.internetProblem');
        }
    }

    async onClickDeleteAttachment(attachment: Attachment) {
        if (!attachment.attachmentId) {
            this.sweetalertServices.warning('alert.internetProblem');
            return;
        }

        const confirmed = await this.sweetalertServices.confirmDelete();
        if (!confirmed?.isConfirmed) {
            return;
        }

        this.attachmentService
            .delete(attachment.attachmentId)
            .pipe(
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    throw error;
                }),
            )
            .subscribe(() => {
                this.deleteAttachmentId.emit(attachment.attachmentId);
            });
    }
}
