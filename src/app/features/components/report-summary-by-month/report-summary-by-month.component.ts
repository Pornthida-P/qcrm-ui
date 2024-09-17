import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from 'src/app/services/report/report.service';
import * as moment from 'moment';
import { faFileExport, faGear } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { config } from 'src/app/config/config';
import { report } from 'src/app/config/report';

@Component({
    selector: 'app-report-summary-by-month',
    templateUrl: './report-summary-by-month.component.html',
    styleUrl: './report-summary-by-month.component.scss',
})
export class ReportSummaryByMonthComponent implements OnInit {
    reportTable!: any;
    topicArray!: any;
    channelArray!: any;
    datePick: FormGroup = new FormGroup({});

    faGear = faGear;
    faFileExport = faFileExport;
    displayedColumns: string[] = [];
    columnVisibility: { [key: string]: boolean } = {};
    displayedColumnsTemp: any = null;

    columnName: any = report.summary;
    fileType: string = config.file.type;

    constructor(private reportService: ReportService, private fb: FormBuilder) {}

    ngOnInit(): void {
        const currentDate = new Date();
        /* const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1); */ //First day of the year
        const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1); //Set the 1st day of the previous month
        const firstDayOfYearFormat = moment(oneMonthAgo).format('YYYY-MM-DD');
        const currentDateFormat = moment(new Date()).format('YYYY-MM-DD');
        this.datePick = this.fb.group({
            startDate: [firstDayOfYearFormat],
            endDate: [currentDateFormat],
        });
        this.getReport(firstDayOfYearFormat, currentDateFormat);
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

    clickGetReport() {
        const startDate = moment(this.datePick.get('startDate')!.value).format('YYYY-MM-DD');
        const endDate = moment(this.datePick.get('endDate')!.value).format('YYYY-MM-DD');
        this.getReport(startDate, endDate);
    }

    async getReport(startYear: string, endYear: string) {
        this.reportTable = [];

        await this.reportService.getSummaryByMonth(startYear, endYear).subscribe((res: any) => {
            this.topicArray = res.value;
            this.channelArray = res.value1;

            if (this.topicArray.length != 0) {
                this.topicArray = this.rowTotalTopic(this.topicArray);
            }

            if (this.channelArray.length != 0) {
                this.channelArray = this.rowTotalChannel(this.channelArray);
            }

            for (const item1 of this.channelArray) {
                const matchingItem = this.topicArray.find((item2: any) => item2.month === item1.month && item2.year === item1.year);

                if (matchingItem) {
                    const mergedItem = { ...item1, ...matchingItem };
                    this.reportTable.push(mergedItem);
                }
            }

            this.columnTotal();
            if (!this.displayedColumnsTemp) this.setDisplayAllFields();
            this.filterTotal();
        });
    }

    rowTotalChannel(array: any) {
        const totals: Record<string, number> = {};
        for (const row of array) {
            if (!totals[`${row.month}-${row.year}`]) {
                totals[`${row.month}-${row.year}`] = 0;
            }

            totals[`${row.month}-${row.year}`] +=
                Number(row.HotIn) +
                Number(row.HotOut) +
                Number(row.MailIn) +
                Number(row.MailOut) +
                Number(row.Mobile) +
                Number(row.LiveChat) +
                Number(row.Other);
        }
        for (const row of array) {
            row['TotalChannel'] = totals[`${row.month}-${row.year}`];
        }
        return array;
    }

    filterTotal() {
        const totalsChannel: Record<string, number> = {};
        const totalsTopic: Record<string, number> = {};

        for (const row of this.reportTable) {
            if (!totalsChannel[`${row.month}-${row.year}`]) {
                totalsChannel[`${row.month}-${row.year}`] = 0;
            }
            if (!totalsTopic[`${row.month}-${row.year}`]) {
                totalsTopic[`${row.month}-${row.year}`] = 0;
            }
            totalsChannel[`${row.month}-${row.year}`] +=
                (this.columnVisibility['HotIn'] ? Number(row.HotIn) : 0) +
                (this.columnVisibility['HotOut'] ? Number(row.HotOut) : 0) +
                (this.columnVisibility['MailIn'] ? Number(row.MailIn) : 0) +
                (this.columnVisibility['MailOut'] ? Number(row.MailOut) : 0) +
                (this.columnVisibility['Mobile'] ? Number(row.Mobile) : 0) +
                (this.columnVisibility['LiveChat'] ? Number(row.LiveChat) : 0) +
                (this.columnVisibility['Other'] ? Number(row.Other) : 0);

            totalsTopic[`${row.month}-${row.year}`] +=
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
            row['TotalChannel'] = totalsChannel[`${row.month}-${row.year}`];
            row['TotalTopic'] = totalsTopic[`${row.month}-${row.year}`];
            row['date'] = row['date'] == 'Total' ? 'Total' : `${row.month}/${row.year}`;
        }
    }

    rowTotalTopic(array: any) {
        const totals: Record<string, number> = {};
        for (const row of array) {
            if (!totals[`${row.month}-${row.year}`]) {
                totals[`${row.month}-${row.year}`] = 0;
            }

            totals[`${row.month}-${row.year}`] +=
                Number(row.Topic1) +
                Number(row.Topic2) +
                Number(row.Topic3) +
                Number(row.Topic4) +
                Number(row.Topic5) +
                Number(row.Topic6) +
                Number(row.Topic7) +
                Number(row.Topic8);
        }
        for (const row of array) {
            row['TotalTopic'] = totals[`${row.month}-${row.year}`];
            row['date'] = `${row.month}/${row.year}`;
        }
        return array;
    }

    columnTotal() {
        const totals: Record<string, number> = {};

        for (const row of this.reportTable) {
            Object.keys(row).forEach((column: string) => {
                if (column !== 'year') {
                    if (column !== 'month') {
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

        const totalsRow: Record<string, number | string> = { month: 99, year: 99 };
        Object.keys(totals).forEach((column: string) => {
            totalsRow[column] = totals[column];
        });
        totalsRow['date'] = 'Total';
        this.reportTable?.push(totalsRow);
    }

    exportExcel() {
        if (this.reportTable.length != 0) {
            var columnFilter: any = [];
            const processedForms = this.reportTable.reduce((acc: any, cur: any) => {
                const processedForm: any = {};
                Object.keys(this.columnName).forEach((column: string) => {
                    if (this.columnVisibility[column]) {
                        if (column == 'date') processedForm[column] = cur[column];
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
