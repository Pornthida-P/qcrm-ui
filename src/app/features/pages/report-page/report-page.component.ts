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
    surveyForms!: any;
    reportTable!: any;
    onSelectReport: any = '';

    selectedSurveyForms: any = [];
    valueSearch!: string;
    checkedValues: string[] = [];

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

    exportExcel() {
        if (this.checkedValues.length != 0) {
            this.selectedSurveyForms = this.surveyForms.filter((form: any) => this.checkedValues.includes(form.surveyFormId));
        }

        if (this.selectedSurveyForms.length != 0) {
            const processedForms = this.selectedSurveyForms.reduce(
                (acc: any, cur: any) => [
                    ...acc,
                    {
                        name: cur.name,
                        createdAt: cur.createdAt,
                        createdBy: cur.createdBy,
                    },
                ],
                [],
            );

            const columns = [['แบบฟอร์มสำรวจ', 'วันที่บันทึก', 'บันทึกโดย']];
            const wb = XLSX.utils.book_new();
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
            XLSX.utils.sheet_add_aoa(ws, columns);

            XLSX.utils.sheet_add_json(ws, processedForms, { origin: 'A2', skipHeader: true });

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            XLSX.writeFile(wb, `แบบฟอร์มสำรวจ${this.fileType}`);
        }
    }
}
