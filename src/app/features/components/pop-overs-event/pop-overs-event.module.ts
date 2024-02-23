import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopOversEventComponent } from './pop-overs-event.component';
import { CalendarCardModule } from '../calendar-card/calendar-card.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [PopOversEventComponent],
    imports: [CommonModule, CalendarCardModule, FontAwesomeModule],
    exports: [PopOversEventComponent],
})
export class PopOversEventModule {}
