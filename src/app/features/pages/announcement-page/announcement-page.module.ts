import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementPageComponent } from './announcement-page.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableListModule } from '../../components/table-list/table-list.module';

@NgModule({
    declarations: [AnnouncementPageComponent],
    imports: [
        CommonModule,
        TableListModule,
        FontAwesomeModule,
        RouterModule.forChild([
            {
                path: '',
                component: AnnouncementPageComponent,
            },
        ]),
    ],
})
export class AnnouncementPageModule {}
