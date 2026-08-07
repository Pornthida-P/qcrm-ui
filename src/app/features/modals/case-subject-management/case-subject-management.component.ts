import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-case-subject-management',
    standalone: false,
    templateUrl: './case-subject-management.component.html',
    styleUrl: './case-subject-management.component.scss',
})
export class CaseSubjectManagementComponent implements OnInit {
    title = 'case-subject';
    faXmark = faXmark;
    caseTopics: any[] = [];

    caseSubjectForm: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        code: new FormControl(''),
        description: new FormControl(''),
        caseTopicId: new FormControl('', Validators.required),
    });

    constructor(
        public dialogRef: MatDialogRef<CaseSubjectManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; caseSubject?: any },
        private callService: CallService,
        private sweetalertService: SweetAlertService,
    ) {}

    ngOnInit(): void {
        this.callService.getCaseTopics().subscribe({
            next: (res: any) => {
                this.caseTopics = Array.isArray(res) ? res : [];
            },
        });
        if (this.data.mode === 'view' || this.data.mode === 'edit') {
            this.populateForm(this.data.caseSubject);
        }
        if (this.data.mode === 'view') {
            this.caseSubjectForm.disable();
        }
    }

    private populateForm(caseSubject: any): void {
        if (!caseSubject) return;
        this.caseSubjectForm.patchValue({
            name: caseSubject.name || '',
            code: caseSubject.code || '',
            description: caseSubject.description || '',
            caseTopicId: caseSubject.caseTopicId || '',
        });
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    saveCaseSubject(): void {
        if (!this.caseSubjectForm.valid) return;
        const formValue = this.caseSubjectForm.value;
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');

        if (this.data.mode === 'add') {
            this.callService
                .createCaseSubject({
                    name: formValue.name,
                    code: formValue.code || null,
                    description: formValue.description || null,
                    caseTopicId: formValue.caseTopicId,
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
                .updateCaseSubject(String(this.data.caseSubject.caseSubjectId), {
                    name: formValue.name,
                    code: formValue.code || null,
                    description: formValue.description || null,
                    caseTopicId: formValue.caseTopicId,
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
