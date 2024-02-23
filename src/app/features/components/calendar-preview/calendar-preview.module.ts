import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarPreviewComponent } from './calendar-preview.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PopOversEventModule } from '../pop-overs-event/pop-overs-event.module';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [CalendarPreviewComponent],
    imports: [CommonModule, FontAwesomeModule, PopOversEventModule, NgbPopover],
    exports: [CalendarPreviewComponent],
})
export class CalendarPreviewModule {}
