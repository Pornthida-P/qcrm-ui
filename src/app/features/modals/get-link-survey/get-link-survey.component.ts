import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';

@Component({
    selector: 'app-get-link-survey',
    templateUrl: './get-link-survey.component.html',
    styleUrl: './get-link-survey.component.scss',
})
export class GetLinkSurveyComponent {
    public qrCodeDownloadLink: SafeUrl = '';

    faXmark = faXmark;
    url!: string;
    formId: any;
    surveyForm: any;
    formName: string = '';

    constructor(
        private surveyFormService: SurveyFormService,
        public dialogRef: MatDialogRef<GetLinkSurveyComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { surveyFormId?: string },
    ) {
        const baseUrl = window.location.origin;
        this.url = baseUrl + '/survey?key1=' + data.surveyFormId;
        this.formId = data?.surveyFormId;
        this.getForm();
        console.log(this.url);
    }

    ngOnInit(): void {}

    onClickClose(): void {
        this.dialogRef.close();
    }

    getForm() {
        this.surveyFormService.getSurveyFormById(this.formId).subscribe((res) => {
            this.surveyForm = res;
            this.formName = this.surveyForm[0].name;
        });
    }

    onChangeURL(url: SafeUrl) {
        this.qrCodeDownloadLink = url;
    }
}
