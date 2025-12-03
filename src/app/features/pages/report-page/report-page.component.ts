import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from 'src/app/services/report/report.service';
import { TranslateService } from 'src/app/services/translate/translate.service';

@Component({
    selector: 'app-report-page',
    templateUrl: './report-page.component.html',
    styleUrl: './report-page.component.scss',
})
export class ReportPageComponent implements OnInit {
    reportList: any[] = [];
    selectedReportLink: string = '';
    language: string = 'th';
    constructor(
        private router: Router,
        private http: HttpClient,
        private reportService: ReportService,
        private translateService: TranslateService,
    ) {}

    ngOnInit() {
        this.language = this.translateService.getCurrentLanguage();
        this.getReportList();
    }

    getReportList() {
        this.reportService.getReportList().subscribe((res: any) => {
            this.reportList = res;
            this.selectedReportLink = this.reportList[0].link;
        });
    }

    onSelectReport(name: string) {
        this.selectedReportLink = this.reportList.find((rp: { nameTH: string }) => rp.nameTH === name).link;
    }
}
