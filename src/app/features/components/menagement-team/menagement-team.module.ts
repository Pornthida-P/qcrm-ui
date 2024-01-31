import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenagementTeamComponent } from './menagement-team.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [MenagementTeamComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        RouterModule.forChild([
            {
                path: '',
                component: MenagementTeamComponent,
            },
        ]),
    ],
})
export class MenagementTeamModule {}
