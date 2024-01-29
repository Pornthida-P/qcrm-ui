import { Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ManageSurveyFormService } from 'src/app/services/manage-survey-form/manage-survey-form.service';
@Component({
  selector: 'app-manage-survey-form',
  templateUrl: './manage-survey-form.component.html',
  styleUrls: ['./manage-survey-form.component.scss'],
})
export class ManageSurveyFormComponent {

  constructor(private _location: Location, private manageSurveyFormService: ManageSurveyFormService ) {}

  form: any = {};
  isFormSelected: boolean = false;

  typeForm: string[] = ['addComponent', 'saveComponent'];
    onChange(event: any) {
        if (this.typeForm.includes(event.type)) console.log(event.form);
    }

  prev() {
    this._location.back();
  }

  submit() {
    if (this.isFormSelected) {
      this.manageSurveyFormService.saveForm
      console.log('Submit clicked with selected form:', this.form);
    } else {
      console.log('Please select a form before submitting.');
    }
  }

}
