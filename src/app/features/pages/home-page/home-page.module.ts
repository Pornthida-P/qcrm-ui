import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { HomePageComponent } from './home-page.component';
import { HomeComponent } from '../../components/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AnnounceComponent } from '../../components/announce/announce.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MenagementCalendarComponent } from '../../modals/menagement-calendar/menagement-calendar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MenagementAnnounceComponent } from '../../modals/menagement-announce/menagement-announce.component';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountProfileModule } from '../../components/account-profile/account-profile.module';
import { ProfileListModule } from '../../components/profile-list/profile-list.module';
import { ProfileModule } from '../../components/profile/profile.module';
import { UserMenagementModule } from '../../modals/user-menagement/user-menagement.module';
import { CalendarPreviewModule } from '../../components/calendar-preview/calendar-preview.module';
import { CalendarCardModule } from '../../components/calendar-card/calendar-card.module';
import { CardEventListModule } from '../../components/card-event-list/card-event-list.module';
import { AttachmentsListModule } from '../../components/attachments-list/attachments-list.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/nea-qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [HomePageComponent, AnnounceComponent, MenagementCalendarComponent, MenagementAnnounceComponent, HomeComponent],
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
        CalendarCardModule,
        CardEventListModule,
        NgbModule,
        CalendarPreviewModule,
        AttachmentsListModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePageComponent,
            },
        ]),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [],
    exports: [],
})
export class HomePageModule {}
