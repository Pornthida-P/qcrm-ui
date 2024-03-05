import { Component, Input } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Attachment } from 'src/app/shared/interface/attachment.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-attachments-list',
    templateUrl: './attachments-list.component.html',
    styleUrl: './attachments-list.component.scss',
})
export class AttachmentsListComponent {
    @Input() attachments: Attachment[] = [];
    @Input() isShowToolbar: boolean = false;
    @Input() mode?: 'view' | 'edit' | 'add';

    faPlus = faPlusCircle;

    constructor(private translateService: TranslateService) {}

    ngOnInit(): void {}

    onDeletedAttachment(attachmentId: string) {
        this.attachments = this.attachments.filter((attachment) => attachment.attachmentId !== attachmentId);
    }
}
