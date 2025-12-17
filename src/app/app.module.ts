import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TokenInterceptor } from './core/interceptor/token.interceptor';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LoaderModule } from './features/components/loader/loader.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

interface VocabItem {
    id: number;
    key: string;
    value: string;
    language: string;
    section: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: number;
}

export class CustomTranslateLoader implements TranslateLoader {
    constructor(private http: HttpClient) {}

    getTranslation(lang: string): Observable<any> {
        // ดึงข้อมูล vocabs จาก API แทนไฟล์ JSON
        const apiUrl = `${environment.api.url}/vocabs?lang=${lang}`;
        return this.http.get<VocabItem[]>(apiUrl).pipe(
            map((vocabs: VocabItem[]) => {
                // แปลง array เป็น object { key: value } สำหรับ ngx-translate
                const translations: { [key: string]: string } = {};
                vocabs.forEach((vocab) => {
                    translations[vocab.key] = vocab.value;
                });
                return translations;
            }),
        );
    }
}

export function HttpLoaderFactory(http: HttpClient) {
    return new CustomTranslateLoader(http);
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        NgbModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgbDatepickerModule,
        LoaderModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
