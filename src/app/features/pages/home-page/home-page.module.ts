import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamActivitiesComponent } from '../../components/team-activities/team-activities.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { HomePageComponent } from './home-page.component';
import { HomeComponent } from '../../components/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AnnounceComponent } from '../../components/announce/announce.component';
import { AnnounceListComponent } from '../../components/announce-list/announce-list.component';
import { CalendarCardComponent } from '../../components/calendar-card/calendar-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MenagementCalendarComponent } from '../../modals/menagement-calendar/menagement-calendar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AttachmentsComponent } from '../../components/attachments/attachments.component';
import { AttachmentsListComponent } from '../../components/attachments-list/attachments-list.component';
import { FileSizePipe } from 'src/app/shared/pipe/file-size.pipe';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MenagementAnnounceComponent } from '../../modals/menagement-announce/menagement-announce.component';
import { MenagementAnnounceListComponent } from '../../modals/menagement-announce-list/menagement-announce-list/menagement-announce-list.component';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountProfileModule } from '../../components/account-profile/account-profile.module';
import { ProfileListModule } from '../../components/profile-list/profile-list.module';
import { ProfileModule } from '../../components/profile/profile.module';
import { UserMenagementModule } from '../../modals/user-menagement/user-menagement.module';
import { CalendarPreviewModule } from '../../components/calendar-preview/calendar-preview.module';

@NgModule({
    declarations: [
        HomePageComponent,
        TeamActivitiesComponent,
        AnnounceComponent,
        AnnounceListComponent,
        CalendarCardComponent,
        MenagementCalendarComponent,
        AttachmentsComponent,
        AttachmentsListComponent,
        MenagementAnnounceComponent,
        HomeComponent,
        MenagementAnnounceListComponent,
        FileSizePipe,
    ],
    imports: [
        MatCardModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        MatTableModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        AngularEditorModule,
        MatButtonToggleModule,
        NgbTooltipModule,
        AccountProfileModule,
        ProfileModule,
        UserMenagementModule,
        ProfileListModule,
        NgbModule,
        CalendarPreviewModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePageComponent,
            },
        ]),
    ],
    providers: [],
    exports: [],
})
export class HomePageModule {}
