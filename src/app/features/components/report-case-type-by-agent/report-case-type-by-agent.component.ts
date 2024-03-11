import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from 'src/app/services/report/report.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-report-case-type-by-agent',
    templateUrl: './report-case-type-by-agent.component.html',
    styleUrl: './report-case-type-by-agent.component.scss',
})
export class ReportCaseTypeByAgentComponent implements OnInit {
    reportTable!: any;
    datePick: FormGroup = new FormGroup({});

    constructor(
        private router: Router,
        private reportService: ReportService,
        private activeRoute: ActivatedRoute,
        private sweetalertServices: SweetAlertService,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        const currentDate = new Date();
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const firstDayOfYearFormat = moment(firstDayOfYear).format('YYYY-MM-DD');
        const currentDateFormat = moment(new Date()).format('YYYY-MM-DD');
        this.getReport(firstDayOfYearFormat, currentDateFormat);
        this.datePick = this.fb.group({
            startDate: [firstDayOfYearFormat, Validators.required],
            endDate: [currentDate, Validators.required],
        });
    }

    async getReport(startDate: string, endDate: string) {
        await this.reportService.getCaseTypeByAgent(startDate, endDate).subscribe((res: any) => {
            this.reportTable = res.value;
            if (this.reportTable.length != 0) {
                this.rowTotal();
                this.columnTotal();
            }
        });
    }

    clickgo() {
        const startDate = moment(this.datePick.get('startDate')!.value).format('YYYY-MM-DD');
        const endDate = moment(this.datePick.get('endDate')!.value).format('YYYY-MM-DD');
        this.getReport(startDate, endDate);
    }

    onStartDateChange(event: any) {
        this.datePick.get('startDate')!.setValue(event.value);
    }

    onEndDateChange(event: any) {
        this.datePick.get('endDate')!.setValue(event.value);
    }

    rowTotal() {
        const totals: Record<string, number> = {};

        for (const row of this.reportTable) {
            if (!totals[row.username]) {
                totals[row.username] = 0;
            }

            totals[row.username] +=
                Number(row.Topic1) +
                Number(row.Topic2) +
                Number(row.Topic3) +
                Number(row.Topic4) +
                Number(row.Topic5) +
                Number(row.Topic6) +
                Number(row.Topic7) +
                Number(row.Topic8);
        }
        for (const row of this.reportTable) {
            row['Total'] = totals[row.username];
        }
    }

    columnTotal() {
        const totals: Record<string, number> = {};

        for (const row of this.reportTable) {
            Object.keys(row).forEach((column: string) => {
                if (column !== 'username') {
                    if (!totals[column]) {
                        totals[column] = 0;
                    }

                    if (row[column] !== '-') {
                        totals[column] += Number(row[column]);
                    }
                }
            });
        }

        const totalsRow: Record<string, number | string> = { username: 'Totals' };
        Object.keys(totals).forEach((column: string) => {
            totalsRow[column] = totals[column];
        });

        this.reportTable?.push(totalsRow);
    }
}
