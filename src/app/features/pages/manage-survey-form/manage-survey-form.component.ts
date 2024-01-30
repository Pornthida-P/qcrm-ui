import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { Subject, catchError, tap } from 'rxjs';
import { FormioRefreshValue } from '@formio/angular';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
@Component({
    selector: 'app-manage-survey-form',
    templateUrl: './manage-survey-form.component.html',
    styleUrls: ['./manage-survey-form.component.scss'],
})
export class ManageSurveyFormComponent {
    form: any = {};
    formName!: string;
    isFormSelected: boolean = false;
    typeForm: string[] = ['addComponent', 'saveComponent'];

    constructor(private _location: Location, private surveyFormService: SurveyFormService, private sweetalertServices: SweetAlertService) {
        this.form = { components: [] };
    }

    onChange(event: any) {
        // if (this.typeForm.includes(event.type)) {
        //     this.surveyForm = JSON.stringify(event.form, null, 4);
        // }
    }

    prev() {
        this._location.back();
    }

    submit() {
        console.log(this.formName, this.form);
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData) {
            const data = {
                name: this.formName,
                form: this.form,
                createBy: userData.userId,
            };

            this.surveyFormService
                .createSurveyForm(data)
                .pipe(
                    tap((res) => {
                        this.sweetalertServices.getSwal('success', 'Save data success.', '', false, '');
                    }),
                    catchError((error) => {
                        this.handleError(error);
                        throw error;
                    }),
                )
                .subscribe();
        }
    }

    handleError(error: any) {
        let icon: string;
        let errorMessage: string;
        let title: string;
        let route: string;

        switch (error.status) {
            case 401:
                icon = 'warning';
                title = 'warning Authentication';
                errorMessage = 'Your session has expired. Please log in again.';
                route = 'login';
                break;
            default:
                icon = 'error';
                title = 'Survey Form Error';
                errorMessage = 'Failed to load survey forms. Please try again later.';
                route = '';
                break;
        }

        this.sweetalertServices.getSwal(icon, title, errorMessage, false, route);
    }
}
