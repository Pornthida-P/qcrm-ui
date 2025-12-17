import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { faXmark, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-case-topic-management',
    standalone: false,
    templateUrl: './case-topic-management.component.html',
    styleUrl: './case-topic-management.component.scss',
})
export class CaseTopicManagementComponent implements OnInit {
    title = 'case-topic';
    activeTab: 'basic' | 'script' = 'basic';

    faXmark = faXmark;
    faPlusCircle = faPlusCircle;
    faTrash = faTrash;

    caseTopicForm: FormGroup = new FormGroup({
        code: new FormControl(''),
        name: new FormControl(''),
        script: new FormControl(''),
        subjects: new FormArray([]),
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
        public dialogRef: MatDialogRef<CaseTopicManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'view' | 'edit'; caseTopic?: any },
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        switch (this.data.mode) {
            case 'add':
                this.caseTopicForm.patchValue({
                    code: '',
                    name: '',
                    script: '',
                });
                // Clear subjects for add mode
                while (this.subjects.length !== 0) {
                    this.subjects.removeAt(0);
                }
                break;

            case 'view':
                this.populateForm(this.data.caseTopic);
                this.subjects.disable();
                this.caseTopicForm.disable();
                break;

            case 'edit':
                this.populateForm(this.data.caseTopic);
                break;

            default:
                break;
        }
    }

    private populateForm(caseTopic: any): void {
        if (!caseTopic) return;

        this.caseTopicForm.patchValue({
            code: caseTopic.code || '',
            name: caseTopic.name || '',
            script: caseTopic.script || '',
        });

        // Populate subjects FormArray
        while (this.subjects.length !== 0) {
            this.subjects.removeAt(0);
        }

        if (caseTopic.subjects && Array.isArray(caseTopic.subjects)) {
            caseTopic.subjects.forEach((subject: any) => {
                // Create FormGroup with code and name
                const subjectGroup = new FormGroup({
                    caseSubjectId: new FormControl(subject.caseSubjectId || ''),
                    code: new FormControl(subject.code || ''),
                    name: new FormControl(subject.name || ''),
                });
                this.subjects.push(subjectGroup);
            });
        }
    }

    get subjects(): FormArray {
        return this.caseTopicForm.get('subjects') as FormArray;
    }

    get scriptControl(): FormControl {
        return this.caseTopicForm.get('script') as FormControl;
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    onClickAddSubject(): void {
        const subjectGroup = new FormGroup({
            caseSubjectId: new FormControl(''),
            code: new FormControl(''),
            name: new FormControl(''),
        });
        this.subjects.push(subjectGroup);
    }

    onClickRemoveSubject(index: number): void {
        this.subjects.removeAt(index);
    }

    formatScript(script: string): string {
        if (!script) return '';
        // Convert **text** to <strong>text</strong> for bold
        // Preserve line breaks
        return script.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    }

    saveCaseTopic(): void {
        if (this.caseTopicForm.valid) {
            const formValue = this.caseTopicForm.value;
            const data = {
                code: formValue.code,
                name: formValue.name,
                script: formValue.script,
                subjects: this.subjects.value,
            };
            if (this.data.mode === 'add') {
                this.callService.createCaseTopic(data).subscribe((res: any) => {
                    if (res.success) {
                        if (data.subjects.length > 0) {
                            this.callService.createCaseSubject(data.subjects).subscribe((res: any) => {
                                if (res.success) {
                                    this.dialogRef.close(res);
                                } else {
                                    this.sweetalertService.handleError(res);
                                }
                            });
                        } else {
                            this.dialogRef.close(res);
                        }
                    } else {
                        this.sweetalertService.handleError(res);
                    }
                });
            } else if (this.data.mode === 'edit') {
                const caseTopicData = {
                    caseTopicId: this.data.caseTopic.caseTopicId,
                    code: formValue.code,
                    name: formValue.name,
                    script: formValue.script,
                };
                const caseSubjectData: any[] = this.subjects.value.map((subject: any) => ({
                    caseTopicId: this.data.caseTopic.caseTopicId,
                    caseSubjectId: subject.caseSubjectId,
                    name: subject.name,
                    code: subject.code,
                }));
                this.callService.updateCaseTopic(caseTopicData).subscribe((res: any) => {
                    if (res.success) {
                        if (caseSubjectData.length > 0) {
                            caseSubjectData.forEach((subject: any) => {
                                if (subject.caseSubjectId) {
                                    this.callService.updateCaseSubject(subject).subscribe((res: any) => {
                                        if (res.success) {
                                            this.dialogRef.close(res);
                                        } else {
                                            this.sweetalertService.handleError(res);
                                        }
                                    });
                                } else {
                                    this.callService.createCaseSubject(subject).subscribe((res: any) => {
                                        if (res.success) {
                                            this.dialogRef.close(res);
                                            this.sweetalertService.success('alert.createSuccess');
                                        } else {
                                            this.sweetalertService.handleError(res);
                                        }
                                    });
                                }
                            });
                        } else {
                            this.dialogRef.close(res);
                        }
                    } else {
                        this.sweetalertService.handleError(res);
                    }
                });
            }
        }
    }
}
