import { Component, ElementRef, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
@Component({
    selector: 'app-manage-survey-form',
    templateUrl: './manage-survey-form.component.html',
    styleUrls: ['./manage-survey-form.component.scss'],
})
export class ManageSurveyFormComponent {

    constructor(private _location: Location)
    {}

    form: any = {};
    onChange(event: any) {
        console.log(event.component);
    }

    prev() {
      this._location.back();
    }

}
