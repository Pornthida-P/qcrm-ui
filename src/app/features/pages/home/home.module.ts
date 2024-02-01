import { NgModule, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamActivitiesComponent } from '../../components/team-activities/team-activities.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { HomeComponent } from './home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AnnounceComponent } from '../../components/announce/announce.component';
import { AnnounceListComponent } from '../../components/announce-list/announce-list.component';
import { AnnounceCardComponent } from '../../components/announce-card/announce-card.component';
import { CalendarCardComponent } from '../../components/calendar-card/calendar-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MenagementCalendarComponent } from '../../modals/menagement-calendar/menagement-calendar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ProfileListComponent } from '../../components/profile-list/profile-list.component';

@NgModule({
    declarations: [
        HomeComponent,
        TeamActivitiesComponent,
        AnnounceComponent,
        AnnounceListComponent,
        AnnounceCardComponent,
        CalendarCardComponent,
        MenagementCalendarComponent,
        ProfileListComponent,
    ],
    imports: [
        MatCardModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomeComponent,
            },
        ]),
    ],
    providers: [],
})
export class HomeModule {}
