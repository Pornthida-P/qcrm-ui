import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarCardComponent } from './calendar-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModule } from '../profile/profile.module';
import { ProfileListModule } from '../profile-list/profile-list.module';
import { AttachmentsListModule } from '../attachments-list/attachments-list.module';

@NgModule({
    declarations: [CalendarCardComponent],
    imports: [CommonModule, FontAwesomeModule, NgbTooltipModule, ProfileModule, ProfileListModule, AttachmentsListModule],
    exports: [CalendarCardComponent],
})
export class CalendarCardModule {}
