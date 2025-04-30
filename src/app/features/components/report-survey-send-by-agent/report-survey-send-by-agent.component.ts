import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ReportService } from 'src/app/services/report/report.service';
import { faUser, faGear, faFileExport } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { report } from 'src/app/config/report';
import { config } from 'src/app/config/config';
@Component({
    selector: 'app-report-survey-send-by-agent',
    // standalone: true,
    // imports: [],
    templateUrl: './report-survey-send-by-agent.component.html',
    styleUrl: './report-survey-send-by-agent.component.scss',
})
export class ReportSurveySendByAgentComponent {
    reportTable!: any;
    datePick: FormGroup = new FormGroup({});

    faGear = faGear;
    faUser = faUser;
    faFileExport = faFileExport;

    columnVisibility: { [key: string]: boolean } = {};
    displayedColumns: string[] = [];
    displayedUsersTemp: any = null;
    usersVisibility: { [key: string]: boolean } = {};

    columnName: any = report.surveySendById;
    filterDate!: any[];
    selectedFilter: any | undefined;
    filterOption!: any[];

    dateFilterType: string = '';
    filterDateType: any | undefined;
    startDate: any | undefined;
    endDate: any | undefined;
    dateRangeForm!: FormGroup;
    selectedUserId: string | undefined;

    fileType: string = config.file.type;

    constructor(private reportService: ReportService, private fb: FormBuilder) {}

    ngOnInit() {
        const currentDate = new Date();
        const firstDayOfYearFormat = moment(new Date()).format('YYYY-MM-DD');
        const currentDateFormat = moment(new Date()).format('YYYY-MM-DD');

        this.dateRangeForm = this.fb.group({
            startDate: [''],
            endDate: [''],
        });
        const id = 'system';
        this.getSurveySendByAgent();
        this.getAgent(firstDayOfYearFormat, currentDateFormat);
        console.log('columnNames', this.columnNames);
        console.log('columnName: ', this.columnName);

        this.columnNames.forEach((key) => {
            this.columnVisibility[key] = true;
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
            this.getSurveySendByAgent();
        });
        this.dateRangeForm.get('endDate')!.valueChanges.subscribe((value) => {
            this.endDate = moment(value).format('YYYY-MM-DD');
            console.log('endDate', this.endDate);
            this.getSurveySendByAgent();
        });
    }

    getSurveySendByAgent() {
        const selectedUserIds = Object.keys(this.usersVisibility).filter((key) => this.usersVisibility[key] === true);

        this.reportService.getSurveySendById(selectedUserIds, this.startDate, this.endDate, this.filterDateType).subscribe((res: any) => {
            this.reportTable = res.value.value;
        });
        // if (this.reportTable.length != 0) {
        //     // this.rowTotal();
        //     this.columnTotal();
        // }
    }

    onStartDateChange(event: any) {}

    onEndDateChange(event: any) {}

    applyColumnVisibility() {}

    clickgo() {
        const startDate = moment(this.datePick.get('startDate')!.value).format('YYYY-MM-DD');
        const endDate = moment(this.datePick.get('endDate')!.value).format('YYYY-MM-DD');
        const id = 'system';
        this.getSurveySendByAgent();
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

    get columnVisibilityKeys(): string[] {
        return Object.keys(this.columnVisibility);
    }

    get columnNames(): string[] {
        return Object.keys(this.columnName);
    }

    get usersVisibilityKeys(): string[] {
        return Object.keys(this.usersVisibility);
    }

    getTotal(column: string) {
        if (this.reportTable[this.reportTable.length - 1]) return this.reportTable[this.reportTable.length - 1][column];
        else return null;
    }

    async getAgent(firstDayOfYearFormat: any, currentDateFormat: any) {
        this.reportTable = [];
        await this.reportService.getAgent().subscribe((res: any) => {
            let users = res.value;
            users.forEach((user: any) => {
                this.usersVisibility[user.username] = true;
            });

            this.displayedUsersTemp = Object.keys(this.usersVisibility).filter((key) => this.usersVisibility[key]);
            if (this.displayedUsersTemp.length) {
                this.getSurveySendByAgent();
            }
        });
    }

    onDateFilterChange(newDateFilterType: string) {
        this.filterDateType = newDateFilterType;
        console.log('Selected filter type:', this.filterDateType);
        this.getSurveySendByAgent();
    }

    applyUserVisibility(): void {
        this.displayedUsersTemp = this.usersVisibility;
        this.displayedUsersTemp = Object.keys(this.usersVisibility).filter((key) => this.usersVisibility[key] == true);
        this.getSurveySendByAgent();
    }

    columnTotal() {
        const totals: Record<string, number> = {};
        const totalSurvey = this.reportTable.length;

        for (const row of this.reportTable) {
            Object.keys(row).forEach((column: string) => {
                if (column !== 'date') {
                    if (!totals[column]) {
                        totals[column] = 0;
                    }

                    if (row[column] !== '-') {
                        totals[column] += Number(row[column]);
                    }
                }
            });
        }

        const totalsRow: Record<string, number | string> = { date: 'Totals : ' + totalSurvey };
        Object.keys(totals).forEach((column: string) => {
            totalsRow[column] = totals[column];
        });

        this.reportTable.push(totalsRow);
    }
}
