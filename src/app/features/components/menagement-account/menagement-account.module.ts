import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenagementAccountComponent } from './menagement-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountProfileModule } from '../account-profile/account-profile.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/nea-qcrm-ui/i18n/', '.json');
}

@NgModule({
    declarations: [MenagementAccountComponent],
    imports: [
        CommonModule,
        FormsModule,
        AccountProfileModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: MenagementAccountComponent,
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
    exports: [],
})
export class MenagementAccountModule {}
