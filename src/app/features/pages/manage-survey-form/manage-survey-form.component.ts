import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { Subject, catchError, filter, tap } from 'rxjs';
import { FormioRefreshValue } from '@formio/angular';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
@Component({
    selector: 'app-manage-survey-form',
    templateUrl: './manage-survey-form.component.html',
    styleUrls: ['./manage-survey-form.component.scss'],
})
export class ManageSurveyFormComponent implements OnInit {
    form: any = {};
    formName!: string;
    isFormSelected: boolean = false;
    typeForm: string[] = ['addComponent', 'saveComponent'];
    surveyFormId: string = '';
    cb: string = '';
    detailItem: any = undefined;

    constructor(
        private _location: Location,
        private surveyFormService: SurveyFormService,
        private sweetalertServices: SweetAlertService,
        private route: ActivatedRoute,
    ) {
        this.form = { components: [] };
    }
    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.surveyFormId = params['itemId'];
            this.cb = params['cb'];
        });
        this.getSurveyById(this.surveyFormId);
    }

    async getSurveyById(surveyFormId: string) {
        await this.surveyFormService.getSurveyFormById(surveyFormId).subscribe((res: any) => {
            this.detailItem = res[0];
            this.formName = this.detailItem.name;
            this.form = JSON.parse(this.detailItem.form);
        });
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
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData) {
            if (this.detailItem) {
                const data = {
                    id: this.detailItem.surveyFormId,
                    name: this.formName,
                    form: this.form,
                    description: null,
                    modifiedBy: userData.userId,
                };

                this.surveyFormService
                    .editSurveyForm(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'Save data success.', '', false, '/surveyform');
                        }),
                        catchError((error) => {
                            this.handleError(error);
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                const data = {
                    name: this.formName,
                    form: this.form,
                    description: null,
                    createdBy: userData.userId,
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
