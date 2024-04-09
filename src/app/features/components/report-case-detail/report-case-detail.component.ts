import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { faFileExport, faGear } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { config } from 'src/app/config/config';
import { report } from 'src/app/config/report';
import { ReportService } from 'src/app/services/report/report.service';

@Component({
    selector: 'app-report-case-detail',
    templateUrl: './report-case-detail.component.html',
    styleUrl: './report-case-detail.component.scss',
})
export class ReportCaseDetailComponent {
    reportTable!: any;
    datePick: FormGroup = new FormGroup({});

    faGear = faGear;
    faFileExport = faFileExport;
    displayedColumns: string[] = [];
    columnVisibility: { [key: string]: boolean } = {};
    displayedColumnsTemp: any = null;

    columnName: any = report.cases;
    fileType: string = config.file.type;

    constructor(private reportService: ReportService, private fb: FormBuilder) {}

    ngOnInit(): void {
        const currentDate = new Date();
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const firstDayOfYearFormat = moment(firstDayOfYear).format('YYYY-MM-DD');
        const currentDateFormat = moment(new Date()).format('YYYY-MM-DD');
        this.datePick = this.fb.group({
            startDate: [firstDayOfYearFormat, Validators.required],
            endDate: [currentDate, Validators.required],
        });
        this.getReport(firstDayOfYearFormat, currentDateFormat);
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

    onStartDateChange(event: any) {
        this.datePick.get('startDate')!.setValue(event.value);
    }

    onEndDateChange(event: any) {
        this.datePick.get('endDate')!.setValue(event.value);
    }

    async getReport(startDate: string, endDate: string) {
        this.reportTable = [];
        await this.reportService.getCaseDetail(startDate, endDate).subscribe((res: any) => {
            this.reportTable = res.value;
            if (this.reportTable.length != 0) {
                this.columnTotal();
            }
            if (!this.displayedColumnsTemp) {
                this.setDisplayAllFields();
            }
        });
    }

    columnTotal() {
        const totals: Record<string, number> = {};

        for (const row of this.reportTable) {
            Object.keys(row).forEach((column: string) => {
                if (row['created']) {
                    const dateCreated = new Date(row['created']);
                    row['created'] = dateCreated.toLocaleString();
                }

                if (row['updated']) {
                    const dateCreated = new Date(row['updated']);
                    row['updated'] = dateCreated.toLocaleString();
                }
            });
        }

        const totalsRow: Record<string, number | string> = { channel: 'Totals :' + this.reportTable.length };
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

            XLSX.writeFile(wb, `Channel-By-Agent-Report${this.fileType}`);
        }
    }
}
