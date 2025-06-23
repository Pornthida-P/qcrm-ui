import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ReportService } from 'src/app/services/report/report.service';
import { faUser, faGear, faFileExport } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { report } from 'src/app/config/report';
import { config } from 'src/app/config/config';
@Component({
    selector: 'app-report-survey-summary',
    // standalone: true,
    // imports: [],
    templateUrl: './report-survey-summary.component.html',
    styleUrl: './report-survey-summary.component.scss',
})
export class ReportSurveySummaryComponent {
    reportTable!: any;
    datePick: FormGroup = new FormGroup({});
    dateFilterType: string = '';
    filterDateType: any | undefined;
    startDate: any | undefined;
    endDate: any | undefined;
    dateRangeForm!: FormGroup;

    faGear = faGear;
    faUser = faUser;
    faFileExport = faFileExport;

    columnName: any = report.surveySendSummary;
    fileType: string = config.file.type;

    columnVisibility: { [key: string]: boolean } = {};

    filterDate!: any[];

    constructor(private reportService: ReportService, private fb: FormBuilder) {}

    ngOnInit() {
        console.log('columnName object:', this.columnName);
        console.log('columnName keys:', Object.keys(this.columnName));

        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        const firstDayOfYearFormat = moment(new Date()).format('YYYY-MM-DD');
        const currentDateFormat = moment(new Date()).format('YYYY-MM-DD');

        this.dateRangeForm = this.fb.group({
            startDate: [''],
            endDate: [''],
        });

        this.filterDate = [
            { name: 'กรุณาเลือกวันที่', type: '' },
            { name: 'วันนี้', type: 'toDay' },
            { name: 'อาทิตย์นี้', type: 'thisWeek' },
            { name: 'เดือนนี้', type: 'thisMonth' },
            { name: 'เลือกวันที่', type: 'custom' },
        ];

        this.filterDateType = this.filterDate[1].type;

        this.dateRangeForm.get('startDate')!.valueChanges.subscribe((value) => {
            this.startDate = moment(value).format('YYYY-MM-DD');
            console.log('startDate', this.startDate);
            this.getSurveySendSummary();
        });
        this.dateRangeForm.get('endDate')!.valueChanges.subscribe((value) => {
            this.endDate = moment(value).format('YYYY-MM-DD');
            console.log('endDate', this.endDate);
            this.getSurveySendSummary();
        });
        this.getSurveySendSummary();
        this.columnNames.forEach((key) => {
            this.columnVisibility[key] = true;
        });
    }

    onDateFilterChange(newDateFilterType: string) {
        this.filterDateType = newDateFilterType;
        console.log('Selected filter type:', this.filterDateType);
        this.getSurveySendSummary();
    }

    getSurveySendSummary() {
        this.reportService.getSurveySummary(this.startDate, this.endDate, this.filterDateType).subscribe((res: any) => {
            console.log('Survey Send Summary:', res);
            this.reportTable = res.value;

            if (this.reportTable && this.reportTable.length !== 0) {
                this.columnTotal();
            }
        });
    }

    columnTotal() {
        const totals: Record<string, number> = {};

        for (const row of this.reportTable) {
            Object.keys(row).forEach((column: string) => {
                if (column !== 'createdDate' && column !== 'ResendDate') {
                    if (!totals[column]) {
                        totals[column] = 0;
                    }

                    if (row[column] !== '-') {
                        const value = Number(row[column]);
                        if (!isNaN(value)) {
                            totals[column] += value;
                        }
                    }
                }
            });
        }

        const totalsRow: Record<string, number | string> = { createdDate: 'Total:' };
        Object.keys(totals).forEach((column: string) => {
            totalsRow[column] = totals[column];
        });

        this.reportTable.push(totalsRow);
    }

    onStartDateChange(event: any) {}
    onEndDateChange(event: any) {}

    clickgo() {
        this.getSurveySendSummary();
    }

    get columnVisibilityKeys(): string[] {
        return Object.keys(this.columnVisibility);
    }

    get columnNames(): string[] {
        return Object.keys(this.columnName);
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

            XLSX.writeFile(wb, `Survey-Send-Report-By-Agent${this.fileType}`);
        }
    }

    getTotal(column: string) {
        if (Array.isArray(this.reportTable) && this.reportTable.length > 0) {
            const lastRow = this.reportTable[this.reportTable.length - 1];
            return lastRow ? lastRow[column] : null;
        }
        return null;
    }
}
