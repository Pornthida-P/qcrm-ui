import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenagementTeamComponent } from '../../modals/menagement-team/menagement-team.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ProfileListModule } from '../profile-list/profile-list.module';
import { ProfileModule } from '../profile/profile.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [TeamComponent, MenagementTeamComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        FormsModule,
        MatSelectModule,
        ReactiveFormsModule,
        ProfileModule,
        ProfileListModule,
        NgbModule,
        RouterModule.forChild([
            {
                path: '',
                component: TeamComponent,
            },
        ]),
    ],
})
export class TeamModule {}
