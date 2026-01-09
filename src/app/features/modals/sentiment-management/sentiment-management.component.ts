import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-sentiment-management',
    standalone: false,
    templateUrl: './sentiment-management.component.html',
    styleUrl: './sentiment-management.component.scss',
})
export class SentimentManagementComponent implements OnInit {
    title = 'sentiment';

    faXmark = faXmark;

    sentimentForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });

    constructor(
        public dialogRef: MatDialogRef<SentimentManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; sentiment?: any },
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        switch (this.data.mode) {
            case 'add':
                this.sentimentForm.patchValue({
                    name: '',
                });
                break;

            case 'view':
                this.populateForm(this.data.sentiment);
                this.sentimentForm.disable();
                break;

            case 'edit':
                this.populateForm(this.data.sentiment);
                break;

            default:
                break;
        }
    }

    private populateForm(sentiment: any): void {
        if (!sentiment) return;

        this.sentimentForm.patchValue({
            name: sentiment.name || '',
        });
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    saveSentiment(): void {
        if (this.sentimentForm.valid) {
            const formValue = this.sentimentForm.value;
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');

            if (this.data.mode === 'add') {
                const createData = {
                    name: formValue.name,
                    createdById: userData.userId,
                };
                this.callService.createSentiment(createData).subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.createSentimentSuccess');
                            this.dialogRef.close(res);
                        } else {
                            this.sweetalertService.handleError(res);
                        }
                    },
                    error: (error) => {
                        this.sweetalertService.handleError(error);
                    },
                });
            } else if (this.data.mode === 'edit') {
                const updateData = {
                    name: formValue.name,
                    modifiedById: userData.userId,
                };
                this.callService.updateSentiment(this.data.sentiment.id, updateData).subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.updateSentimentSuccess');
                            this.dialogRef.close(res);
                        } else {
                            this.sweetalertService.handleError(res);
                        }
                    },
                    error: (error) => {
                        this.sweetalertService.handleError(error);
                    },
                });
            }
        }
    }
}

