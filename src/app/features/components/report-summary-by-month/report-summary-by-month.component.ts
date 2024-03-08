import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report/report.service';

@Component({
    selector: 'app-report-summary-by-month',
    templateUrl: './report-summary-by-month.component.html',
    styleUrl: './report-summary-by-month.component.scss',
})
export class ReportSummaryByMonthComponent implements OnInit {
    reportTable!: any;
    topicArray!: any;
    channelArray!: any;

    constructor(private reportService: ReportService) {}

    ngOnInit(): void {
        const currentDate = new Date();
        // const firstDayOfYearFormat = moment(new Date()).format('YYYY-MM-DD');
        // const currentDateFormat = moment(new Date()).format('YYYY-MM-DD');
        this.getReport('2023', '2024');
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

            console.log(this.topicArray);
            console.log(this.channelArray);

            for (const item1 of this.topicArray) {
                const matchingItem = this.channelArray.find((item2: any) => item2.month === item1.month && item2.year === item1.year);

                if (matchingItem) {
                    const mergedItem = { ...item1, ...matchingItem };
                    this.reportTable.push(mergedItem);
                }
            }
            this.columnTotal();

            console.log(this.reportTable);
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
            row['date'] = `${row.month}/${row.year}`;
        }

        return array;
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
}
