import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from 'src/app/services/report/report.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-report-channel-by-agent',
    templateUrl: './report-channel-by-agent.component.html',
    styleUrl: './report-channel-by-agent.component.scss',
})
export class ReportChannelByAgentComponent implements OnInit {
    reportTable!: any;

    constructor(
        private router: Router,
        private reportService: ReportService,
        private activeRoute: ActivatedRoute,
        private sweetalertServices: SweetAlertService,
    ) {}

    ngOnInit() {
        this.getReport();
    }

    async getReport() {
        await this.reportService.getchannelByAgent().subscribe((res: any) => {
            this.reportTable = res.value;
            this.calculateTotal();
        });
    }

    calculateTotal() {
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

    getTotal(column: string): number {
        return this.reportTable?.reduce((total: any, product: any) => {
            if (product[column] !== '-') {
                return total + Number(product[column]);
            }
            return total;
        }, 0);
    }
}
