import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetLinkSurveyComponent } from './get-link-survey.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
    declarations: [GetLinkSurveyComponent],
    imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, FormsModule, QRCodeModule],
    exports: [GetLinkSurveyComponent],
})
export class GetLinkSurveyModule {}
