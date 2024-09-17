import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report/report.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faFileExport, faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { report } from 'src/app/config/report';
import { config } from 'src/app/config/config';

@Component({
    selector: 'app-report-send-survey',
    templateUrl: './report-send-survey.component.html',
    styleUrl: './report-send-survey.component.scss',
})
export class ReportSendSurveyComponent {
    reportTable!: any;
    datePick: FormGroup = new FormGroup({});
    selectedItems: string[] = [];

    faGear = faGear;
    faUser = faUser;
    faFileExport = faFileExport;
    displayedColumns: string[] = [];
    columnVisibility: { [key: string]: boolean } = {};
    usersVisibility: { [key: string]: boolean } = {};
    displayedColumnsTemp: any = null;
    displayedUsersTemp: any = null;

    columnName: any = report.survey;
    fileType: string = config.file.type;

    constructor(private reportService: ReportService, private fb: FormBuilder) {}

    ngOnInit() {
        const currentDate = new Date();
        /* const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1); */ //First day of the year
        const firstDayOfYearFormat = moment(new Date()).format('YYYY-MM-DD');
        const currentDateFormat = moment(new Date()).format('YYYY-MM-DD');
        this.datePick = this.fb.group({
            startDate: [firstDayOfYearFormat, Validators.required],
            endDate: [currentDate, Validators.required],
        });
        // this.getReport(firstDayOfYearFormat, currentDateFormat);
        this.getAgent(firstDayOfYearFormat, currentDateFormat);
    }

    async getReport(startDate: string, endDate: string) {
        this.reportTable = [];
        await this.reportService.getEmailSurvey(startDate, endDate, this.displayedUsersTemp).subscribe((res: any) => {
            this.reportTable = res.value;
            if (this.reportTable.length != 0) {
                // this.rowTotal();
                this.columnTotal();
            }
            if (!this.displayedColumnsTemp) {
                this.setDisplayAllFields();
            }
            // this.filterTotal();
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

    clickGetReport() {
        const startDate = moment(this.datePick.get('startDate')!.value).format('YYYY-MM-DD');
        const endDate = moment(this.datePick.get('endDate')!.value).format('YYYY-MM-DD');
        this.getReport(startDate, endDate);
    }

    getTotal(column: string) {
        if (this.reportTable[this.reportTable.length - 1]) return this.reportTable[this.reportTable.length - 1][column];
        else return null;
    }

    get columnVisibilityKeys(): string[] {
        return Object.keys(this.columnVisibility);
    }

    get usersVisibilityKeys(): string[] {
        return Object.keys(this.usersVisibility);
    }

    get columnNames(): string[] {
        return Object.keys(this.columnName);
    }

    applyColumnVisibility(): void {
        this.displayedColumnsTemp = this.columnVisibility;
        this.clickGetReport();
    }

    applyUserVisibility(): void {
        this.displayedUsersTemp = this.usersVisibility;
        this.displayedUsersTemp = Object.keys(this.usersVisibility).filter((key) => this.usersVisibility[key] == true);
        this.clickGetReport();
    }

    setDisplayAllFields(): void {
        if (this.reportTable !== null && this.reportTable !== undefined) {
            Object.keys(this.reportTable[0])!.forEach((column) => {
                if (column != 'month' && column != 'year') this.columnVisibility[column] = true;
            });
        }
    }

    columnTotal() {
        const totals: Record<string, number> = {};
        const totalSuvey = this.reportTable.length;
        for (const row of this.reportTable) {
            if (row['date']) {
                const dateCreated = new Date(row['date']);
                row['date'] = dateCreated.toLocaleString();
            }
            if (row['errorSend'] != null) {
                if (row['errorSend'] == 1) {
                    row['successSend'] = 0;
                } else {
                    row['successSend'] = 1;
                }
            }

            if (row['errorResend'] != null) {
                if (row['errorResend'] == 1) {
                    row['successResend'] = 0;
                } else {
                    row['successResend'] = 1;
                }
            }

            Object.keys(row).forEach((column: string) => {
                if (column !== 'date') {
                    if (column !== 'email' && column !== 'contactName' && column !== 'surveyName' && column !== 'agent') {
                        if (!totals[column]) {
                            totals[column] = 0;
                        }

                        if (row[column] !== '-') {
                            totals[column] += Number(row[column]);
                        }
                    }
                }
            });
        }

        const totalsRow: Record<string, number | string> = { date: 'Totals : ' + totalSuvey };
        Object.keys(totals).forEach((column: string) => {
            totalsRow[column] = totals[column];
        });

        this.reportTable?.push(totalsRow);
    }

    exportExcel() {
        if (this.reportTable.length != 0) {
            var columnFilter: any = [];
            const processedForms = this.reportTable.reduce((acc: any, cur: any) => {
                const processedForm: any = {};
                Object.keys(this.columnName).forEach((column: string) => {
                    if (this.columnVisibility[column]) {
                        processedForm[column] = cur[column];
                    }
                });
                acc.push(processedForm);
                return acc;
            }, []);
            Object.keys(processedForms[0]).forEach((column: string) => {
                if (this.columnVisibility[column]) columnFilter.push(this.columnName[column]);
            });

            const columns = [columnFilter];
            const wb = XLSX.utils.book_new();
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
            XLSX.utils.sheet_add_aoa(ws, columns);

            XLSX.utils.sheet_add_json(ws, processedForms, { origin: 'A2', skipHeader: true });

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            XLSX.writeFile(wb, `Survey-Send-Report${this.fileType}`);
        }
    }

    async getAgent(firstDayOfYearFormat: any, currentDateFormat: any) {
        this.reportTable = [];
        await this.reportService.getAgent().subscribe((res: any) => {
            let users = res.value;
            for (let i = 0; i < users.length; i++) {
                this.usersVisibility[users[i].username] = true;
            }
            this.displayedUsersTemp = Object.keys(this.usersVisibility).filter((key) => this.usersVisibility[key] == true);
            this.getReport(firstDayOfYearFormat, currentDateFormat);
        });
    }
}
