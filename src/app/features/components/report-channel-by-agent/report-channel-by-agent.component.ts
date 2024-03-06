import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from 'src/app/services/report/report.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import * as moment from 'moment';

@Component({
    selector: 'app-report-channel-by-agent',
    templateUrl: './report-channel-by-agent.component.html',
    styleUrl: './report-channel-by-agent.component.scss',
})
export class ReportChannelByAgentComponent implements OnInit {
    reportTable!: any;
    datePick: FormGroup = new FormGroup({});

    constructor(
        private router: Router,
        private reportService: ReportService,
        private activeRoute: ActivatedRoute,
        private sweetalertServices: SweetAlertService,
        private fb: FormBuilder,
    ) {}

    ngOnInit(): void {
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

    async getReport(startDate: string, endDate: string) {
        await this.reportService.getChannelByAgent(startDate, endDate).subscribe((res: any) => {
            this.reportTable = res.value;
            if (this.reportTable.length != 0) {
                this.rowTotal();
                this.columnTotal();
            }
        });
    }

    rowTotal() {
        const totals: Record<string, number> = {};

        for (const row of this.reportTable) {
            if (!totals[row.username]) {
                totals[row.username] = 0;
            }

            totals[row.username] +=
                Number(row.HotIn) +
                Number(row.HotOut) +
                Number(row.MailIn) +
                Number(row.MailOut) +
                Number(row.Mobile) +
                Number(row.LiveChat) +
                Number(row.Other);
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
