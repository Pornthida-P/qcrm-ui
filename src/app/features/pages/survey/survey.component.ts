import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormioComponent } from '@formio/angular';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit {
    formId: string = '';
    userId: string = '';
    formName: string = '';
    surveyForm: any;
    form: any;
    thanks: boolean = false;
    existing: boolean = false;

    constructor(
        private surveyFormService: SurveyFormService,
        private activeRoute: ActivatedRoute,
        private sweetalertService: SweetAlertService,
        private surveyService: SurveyService,
    ) {
        this.activeRoute.queryParams.subscribe((params) => {
            if (params['key1'] != undefined && params['key1'] != '') {
                this.formId = params['key1'];
            }
            if (params['key2'] != undefined && params['key2'] != '') {
                this.userId = params['key2'];
            }
        });
        this.checkExisting();
        this.getForm();
    }

    ngOnInit() {}

    getForm() {
        this.surveyFormService.getSurveyFormById(this.formId).subscribe((res) => {
            this.surveyForm = res;
            this.form = JSON.parse(this.surveyForm[0].form);
            this.formName = this.surveyForm[0].name;
        });
    }

    @ViewChild(FormioComponent, { static: false })
    formio!: FormioComponent;

    submitButton() {
        if (this.formio) {
            const isValid = this.formio.formio.checkValidity();
            this.formio.formio.emit('submitButton');
            if (!isValid) {
                this.sweetalertService.getSwal('warning', 'Warning', 'Please fill all the required fields.', false, '');
            }
        }
    }

    onSubmit(submission: any) {
        if (submission) {
            const submissionData = {
                data: submission.data,
            };
            if (submissionData.data) {
                const surveyData = {
                    surveyData: submissionData,
                    contactId: this.userId,
                    surveyFormId: this.formId,
                    channel: '',
                    description: null,
                    createdBy: null,
                };
                this.surveyFormService.saveSurveyData(surveyData).subscribe((res: any) => {
                    if (res.success) {
                        this.sweetalertService.getSwal('success', 'Success', 'Survey submitted successfully.', false, '');
                        this.thanks = true;
                    } else {
                        this.sweetalertService.getSwal('error', 'Error', res.message, false, '');
                    }
                });
            }
        }
    }

    checkExisting() {
        this.surveyService.checkExisting(this.formId, this.userId).subscribe((res: any) => {
            this.existing = res;
        });
    }
}
