import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ReportService } from 'src/app/services/report/report.service';
import { faUser, faGear, faFileExport } from '@fortawesome/free-solid-svg-icons';
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

    columnName: any = report.survey;

    constructor(private reportService: ReportService, private fb: FormBuilder) {}

    ngOnInit() {
        console.log('testest');

        const currentDate = new Date();
        const firstDayOfYearFormat = moment(new Date()).format('YYYY-MM-DD');
        const currentDateFormat = moment(new Date()).format('YYYY-MM-DD');
        this.datePick = this.fb.group({
            startDate: [firstDayOfYearFormat, Validators.required],
            endDate: [currentDate, Validators.required],
        });
        const id = 'system';
        this.getSurveySendByAgent(id, firstDayOfYearFormat, currentDateFormat);
        this.getAgent(firstDayOfYearFormat, currentDateFormat);
    }

    getSurveySendByAgent(id: string, startDate: string, endDate: string) {
        this.reportService.getSurveySendById(id, startDate, endDate).subscribe((res: any) => {
            console.log(res);
          this.reportTable = res.value.value;
          console.log(this.reportTable);
        });
    }

    onStartDateChange(event: any) {}

    onEndDateChange(event: any) {}

    applyUserVisibility() {}

    applyColumnVisibility() {}

    clickgo() {
        const startDate = moment(this.datePick.get('startDate')!.value).format('YYYY-MM-DD');
        const endDate = moment(this.datePick.get('endDate')!.value).format('YYYY-MM-DD');
        const id = 'system';
        this.getSurveySendByAgent(id, startDate, endDate);
    }

    exportExcel() {}

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
            for (let i = 0; i < users.length; i++) {
                this.usersVisibility[users[i].username] = true;
            }
            this.displayedUsersTemp = Object.keys(this.usersVisibility).filter((key) => this.usersVisibility[key] == true);
            // this.getSurveySendByAgent(id ,firstDayOfYearFormat, currentDateFormat);
        });
    }
}
