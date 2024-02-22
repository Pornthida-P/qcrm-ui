import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarPreviewComponent } from './calendar-preview.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [CalendarPreviewComponent],
    imports: [CommonModule, FontAwesomeModule],
    exports: [CalendarPreviewComponent],
})
export class CalendarPreviewModule {}
