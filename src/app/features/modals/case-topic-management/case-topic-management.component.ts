import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-case-topic-management',
    standalone: false,
    templateUrl: './case-topic-management.component.html',
    styleUrl: './case-topic-management.component.scss',
})
export class CaseTopicManagementComponent implements OnInit {
    title = 'case-topic';
    faXmark = faXmark;

    caseTopicForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        code: new FormControl(''),
        script: new FormControl(''),
    });

    constructor(
        public dialogRef: MatDialogRef<CaseTopicManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; caseTopic?: any },
        private callService: CallService,
        private sweetalertService: SweetAlertService,
    ) {}

    ngOnInit(): void {
        if (this.data.mode === 'view' || this.data.mode === 'edit') {
            this.populateForm(this.data.caseTopic);
        }
        if (this.data.mode === 'view') {
            this.caseTopicForm.disable();
        }
    }

    private populateForm(caseTopic: any): void {
        if (!caseTopic) return;
        this.caseTopicForm.patchValue({
            name: caseTopic.name || '',
            code: caseTopic.code || '',
            script: caseTopic.script || '',
        });
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    saveCaseTopic(): void {
        if (!this.caseTopicForm.valid) return;
        const formValue = this.caseTopicForm.value;
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');

        if (this.data.mode === 'add') {
            this.callService
                .createCaseTopic({
                    name: formValue.name,
                    code: formValue.code || null,
                    script: formValue.script || null,
                    createdById: userData.userId,
                })
                .subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.createSuccess');
                            this.dialogRef.close(res);
                        } else {
                            this.sweetalertService.handleError(res);
                        }
                    },
                    error: (error) => this.sweetalertService.handleError(error),
                });
        } else if (this.data.mode === 'edit') {
            this.callService
                .updateCaseTopic(String(this.data.caseTopic.caseTopicId), {
                    name: formValue.name,
                    code: formValue.code || null,
                    script: formValue.script || null,
                    modifiedById: userData.userId,
                })
                .subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.updateSuccess');
                            this.dialogRef.close(res);
                        } else {
                            this.sweetalertService.handleError(res);
                        }
                    },
                    error: (error) => this.sweetalertService.handleError(error),
                });
        }
    }
}
