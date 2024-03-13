import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report/report.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faFileExport, faGear } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { report } from 'src/app/config/report';
import { config } from 'src/app/config/config';

@Component({
    selector: 'app-report-case-type-by-agent',
    templateUrl: './report-case-type-by-agent.component.html',
    styleUrl: './report-case-type-by-agent.component.scss',
})
export class ReportCaseTypeByAgentComponent implements OnInit {
    reportTable!: any;
    datePick: FormGroup = new FormGroup({});
    selectedItems: string[] = [];

    faGear = faGear;
    faFileExport = faFileExport;
    displayedColumns: string[] = [];
    columnVisibility: { [key: string]: boolean } = {};
    displayedColumnsTemp: any = null;

    columnName: any = report.topic;
    fileType: string = config.file.type;

    constructor(private reportService: ReportService, private fb: FormBuilder) {}

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
        this.reportTable = [];
        await this.reportService.getCaseTypeByAgent(startDate, endDate).subscribe((res: any) => {
            this.reportTable = res.value;
            if (this.reportTable.length != 0) {
                this.rowTotal();
                this.columnTotal();
            }
            if (!this.displayedColumnsTemp) {
                this.setDisplayAllFields();
            }
            this.filterTotal();
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

    get columnNames(): string[] {
        return Object.keys(this.columnName);
    }

    applyColumnVisibility(): void {
        this.displayedColumnsTemp = this.columnVisibility;
        this.clickGetReport();
    }

    setDisplayAllFields(): void {
        if (this.reportTable !== null && this.reportTable !== undefined) {
            Object.keys(this.reportTable[0])!.forEach((column) => {
                if (column != 'month' && column != 'year') this.columnVisibility[column] = true;
            });
        }
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

    filterTotal() {
        const totals: Record<string, number> = {};
        for (const row of this.reportTable) {
            if (!totals[row.username]) {
                totals[row.username] = 0;
            }
            totals[row.username] +=
                (this.columnVisibility['Topic1'] ? Number(row.Topic1) : 0) +
                (this.columnVisibility['Topic2'] ? Number(row.Topic2) : 0) +
                (this.columnVisibility['Topic3'] ? Number(row.Topic3) : 0) +
                (this.columnVisibility['Topic4'] ? Number(row.Topic4) : 0) +
                (this.columnVisibility['Topic5'] ? Number(row.Topic5) : 0) +
                (this.columnVisibility['Topic6'] ? Number(row.Topic6) : 0) +
                (this.columnVisibility['Topic7'] ? Number(row.Topic7) : 0) +
                (this.columnVisibility['Topic8'] ? Number(row.Topic8) : 0);
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

    exportExcel() {
        if (this.reportTable.length != 0) {
            var columnFilter: any = [];
            const processedForms = this.reportTable.reduce((acc: any, cur: any) => {
                const processedForm: any = {};
                Object.keys(this.columnName).forEach((column: string) => {
                    if (this.columnVisibility[column]) {
                        if (column == 'username') processedForm[column] = cur[column];
                        else processedForm[column] = Number(cur[column]);
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

            XLSX.writeFile(wb, `Summary-By-Month-Report${this.fileType}`);
        }
    }
}
