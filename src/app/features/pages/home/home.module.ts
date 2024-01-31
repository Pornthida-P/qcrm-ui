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

@NgModule({
    declarations: [HomeComponent, TeamActivitiesComponent, AnnounceComponent],
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
