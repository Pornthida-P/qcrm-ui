import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
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
    state: string = '';
    detailItem: any = undefined;
    copyDetailItem: any = undefined;

    userRole: string = '';
    roleCanAccessCUDForm: string[] = config.roleCanAccessCUDForm;

    constructor(
        private _location: Location,
        private surveyFormService: SurveyFormService,
        private sweetalertServices: SweetAlertService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.form = { components: [] };
    }
    ngOnInit(): void {
        const state = history.state;
        if (state.itemId) {
            this.surveyFormId = state.itemId;
            this.state = state.state;
            this.cb = state.cb;
        } else {
            this.route.queryParams.subscribe((params) => {
                this.surveyFormId = params['key'];
                this.cb = params['cb'];
            });
        }

        if (this.surveyFormId) {
            this.getSurveyById(this.surveyFormId);
        }
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.userRole = userData.role;
        console.log(this.userRole);
    }

    checkRole(): boolean {
        return this.roleCanAccessCUDForm.includes(this.userRole);
    }

    async getSurveyById(surveyFormId: string) {
        await this.surveyFormService.getSurveyFormById(surveyFormId).subscribe((res: any) => {
            this.detailItem = res[0];
            this.formName = this.detailItem.name;
            this.form = JSON.parse(this.detailItem.form);
        });
    }

    onChange(event: any) {
        console.log('Submission changed!', event);
        if (event.data) {
            console.log(event.data);
            // this.data = event.data;
        }
    }

    onSubmit(submission: any) {
        console.log(submission); // This will print out the full submission from Form.io API.
    }

    prev() {
        this._location.back();
        this.state = '';
    }

    copy() {
        const cb = this.cb;
        this.router.navigate(['/surveyform/new'], { state: { state: 'copy', itemId: this.surveyFormId, cb: cb } });
    }

    submit() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData) {
            if (this.detailItem && this.state != 'copy') {
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
                            this.sweetalertServices.handleError(error);
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
                            this.sweetalertServices.getSwal('success', 'Save data success.', '', false, '/surveyform');
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            throw error;
                        }),
                    )
                    .subscribe();
            }
        }
    }
}
