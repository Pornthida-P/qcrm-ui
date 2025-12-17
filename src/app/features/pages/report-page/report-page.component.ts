import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';
import { ReportService } from 'src/app/services/report/report.service';

@Component({
    selector: 'app-report-page',
    templateUrl: './report-page.component.html',
    styleUrl: './report-page.component.scss',
})
export class ReportPageComponent implements OnInit, OnDestroy {
    reportList: any[] = [];
    selectedReportLink: string = '';
    language: string = 'th';
    private langSubscription: Subscription = new Subscription();

    constructor(
        private router: Router,
        private http: HttpClient,
        private reportService: ReportService,
        private translateService: TranslateService,
        private languageService: LanguageService,
    ) {}

    ngOnInit() {
        this.language = this.languageService.current();
        this.langSubscription = this.translateService.onLangChange.subscribe(() => {
            this.language = this.languageService.current();
        });
        this.getReportList();
    }

    ngOnDestroy() {
        this.langSubscription.unsubscribe();
    }

    getReportList() {
        this.reportService.getReportList().subscribe((res: any) => {
            this.reportList = res;
            console.log(this.reportList);
            this.selectedReportLink = this.reportList[0].link;
        });
    }

    onSelectReport(name: string) {
        this.selectedReportLink = this.reportList.find((rp: { nameTH: string }) => rp.nameTH === name).link;
    }
}
