import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-manage-survey-form',
    templateUrl: './manage-survey-form.component.html',
    styleUrls: ['./manage-survey-form.component.scss'],
})
export class ManageSurveyFormComponent {
    form: any = {};
    onChange(event: any) {
        console.log(event.component);
    }
}
