import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TableListModule } from '../table-list/table-list.module';
import { MenagementTagComponent } from '../../modals/menagement-tag/menagement-tag.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [TagComponent, MenagementTagComponent],
    imports: [
        CommonModule,
        FontAwesomeModule,
        MatTableModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatMenuModule,
        TableListModule,
        RouterModule.forChild([
            {
                path: '',
                component: TagComponent,
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
    exports: [TagComponent],
})
export class TagModule {}
