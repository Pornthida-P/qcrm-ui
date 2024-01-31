import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamActivitiesComponent } from '../../components/team-activities/team-activities.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HomeComponent } from './home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AnnounceComponent } from '../../components/announce/announce.component';
import { AnnounceListComponent } from '../../components/announce-list/announce-list.component';
import { AnnounceCardComponent } from '../../components/announce-card/announce-card.component';
import { CalendarCardComponent } from '../../components/calendar-card/calendar-card.component';

@NgModule({
    declarations: [
        HomeComponent,
        TeamActivitiesComponent,
        AnnounceComponent,
        AnnounceListComponent,
        AnnounceCardComponent,
        CalendarCardComponent,
    ],
    imports: [
        MatCardModule,
        MatDatepickerModule,
        CommonModule,
        FontAwesomeModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomeComponent,
            },
        ]),
    ],
    providers: [provideNativeDateAdapter()],
})
export class HomeModule {}
