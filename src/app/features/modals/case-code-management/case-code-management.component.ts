import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-case-code-management',
    standalone: false,
    templateUrl: './case-code-management.component.html',
    styleUrl: './case-code-management.component.scss',
})
export class CaseCodeManagementComponent implements OnInit {
    title = 'case-code';
    activeTab: 'basic' | 'script' = 'basic';

    faXmark = faXmark;

    caseCodeForm: FormGroup = new FormGroup({
        code: new FormControl(''),
        script: new FormControl(''),
    });

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '250px',
        maxHeight: '350px',
        placeholder: this.translateService.instant('form.scriptPlaceholder'),
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        defaultFontSize: '14px',
        toolbarHiddenButtons: [['insertImage', 'insertVideo', 'insertHorizontalRule', 'link', 'unlink']],
        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText',
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
    };

    constructor(
        public dialogRef: MatDialogRef<CaseCodeManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; caseCode?: any },
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        switch (this.data.mode) {
            case 'add':
                this.caseCodeForm.patchValue({
                    code: '',
                    script: '',
                });
                break;

            case 'view':
                this.populateForm(this.data.caseCode);
                this.caseCodeForm.disable();
                break;

            case 'edit':
                this.populateForm(this.data.caseCode);
                break;

            default:
                break;
        }
    }

    private populateForm(caseCode: any): void {
        if (!caseCode) return;

        this.caseCodeForm.patchValue({
            code: caseCode.code || '',
            script: caseCode.script || '',
        });
    }

    get scriptControl(): FormControl {
        return this.caseCodeForm.get('script') as FormControl;
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    formatScript(script: string): string {
        if (!script) return '';
        return script.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    }

    saveCaseCode(): void {
        if (this.caseCodeForm.valid) {
            const formValue = this.caseCodeForm.value;
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');

            if (this.data.mode === 'add') {
                const createData = {
                    code: formValue.code,
                    script: formValue.script,
                    createdById: userData.userId,
                };
                this.callService.createCaseCode(createData).subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.createCaseCodeSuccess');
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
                    code: formValue.code,
                    script: formValue.script,
                    modifiedById: userData.userId,
                };
                this.callService.updateCaseCode(this.data.caseCode.id, updateData).subscribe({
                    next: (res: any) => {
                        if (res.success) {
                            this.sweetalertService.success('alert.updateCaseCodeSuccess');
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

