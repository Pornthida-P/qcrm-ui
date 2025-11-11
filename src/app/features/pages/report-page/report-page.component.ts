import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config/config';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-report-page',
    templateUrl: './report-page.component.html',
    styleUrl: './report-page.component.scss',
})
export class ReportPageComponent implements OnInit {
    reportTable!: any;
    onSelectReport: any = '';

    filterOption!: any[];

    fileType: string = config.file.type;

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userRole: string = '';
    userId: string = '';
    roleCanAccessCUDForm: string[] = config.roleCanAccessCUDForm;
    url: string = '';

    constructor(private router: Router) {}

    ngOnInit() {
        this.userRole = this.userData.role.roleTitle.toLocaleLowerCase();
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'Only My', code: this.userData.username },
        ];
        this.onChangeReport('');
    }

    checkRole(): boolean {
        return this.roleCanAccessCUDForm.includes(this.userRole);
    }

    onChannelByAgentReport() {
        this.onSelectReport = 'ChannelByAgentReport';
        this.router.navigate(['/report-page/channel-by-agent']);
    }

    onCaseTypeByAgentReport() {
        this.onSelectReport = 'CaseTypeByAgentReport';
        this.router.navigate(['/report-page/case-type-by-agent']);
    }

    onCaseDetail() {
        this.onSelectReport = 'CaseDetail';
        this.router.navigate(['/report-page']);
    }

    onSummaryByAgent() {
        this.onSelectReport = 'SummaryByAgent';
        this.router.navigate(['/report-page']);
    }

    onChangeReport(report: string) {
        this.onSelectReport = report;
        this.router.navigate(['/report-page/' + report]);
    }
}
