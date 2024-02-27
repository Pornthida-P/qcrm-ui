import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardEventListComponent } from './card-event-list.component';
import { CalendarCardModule } from '../calendar-card/calendar-card.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [CardEventListComponent],
    imports: [CommonModule, CalendarCardModule, FontAwesomeModule, ReactiveFormsModule, FormsModule],
    exports: [CardEventListComponent],
})
export class CardEventListModule {}
