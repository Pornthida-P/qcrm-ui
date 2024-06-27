import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report/report.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faFileExport, faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { report } from 'src/app/config/report';
import { config } from 'src/app/config/config';

@Component({
    selector: 'app-report-survey-form',
    templateUrl: './report-survey-form.component.html',
    styleUrl: './report-survey-form.component.scss',
})
export class ReportSurveyFormComponent {
    reportTable!: any;
    reportColumn: any = {};
    reportSubColumn = false;
    reportPanel: any[] = [];
    datePick: FormGroup = new FormGroup({});
    selectedItems: string[] = [];

    optionForms: { surveyFormId: string; name: string }[] = [];
    selectedForms: string = '';
    selectedFormsName: string = '';

    faGear = faGear;
    faUser = faUser;
    faFileExport = faFileExport;
    displayedColumns: string[] = [];
    columnVisibility: { [key: string]: boolean } = {};
    displayedColumnsTemp: any = null;

    selectText: string = 'report.select-survey-form';
    loadingText: string = 'report.select-survey-form';

    columnName: any = report.survey;
    fileType: string = config.file.type;

    constructor(private reportService: ReportService, private fb: FormBuilder) {}

    ngOnInit() {
        const currentDate = new Date();
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const firstDayOfYearFormat = moment(firstDayOfYear).format('YYYY-MM-DD');
        const currentDateFormat = moment(new Date()).format('YYYY-MM-DD');
        this.datePick = this.fb.group({
            startDate: [firstDayOfYearFormat, Validators.required],
            endDate: [currentDate, Validators.required],
        });
        this.getSurvey();
    }

    async getReport() {
        this.loadingText = 'report.loading';
        this.reportTable = [];
        if (this.selectedForms == '') return;
        const startDate = moment(this.datePick.get('startDate')!.value).format('YYYY-MM-DD');
        const endDate = moment(this.datePick.get('endDate')!.value).format('YYYY-MM-DD');
        this.reportService.getSurveyForm(startDate, endDate, this.selectedForms).subscribe(async (res: any) => {
            await this.genColumnForm(JSON.parse(res.form[0].form), 0);
            this.genSurveyForm(res.answer);
        });
    }

    isObject(value: any): boolean {
        return typeof value === 'object' && value !== null;
    }

    async genSurveyForm(data: any) {
        if (data.length) {
            for (const survey of data) {
                let Survey = JSON.parse(survey.surveyData);
                Survey['name'] = survey.firstName;

                Object.keys(Survey)!.forEach((column) => {
                    if (this.reportColumn[column]?.type == 'survey') {
                        if (!this.reportColumn[column]?.survey) {
                            this.reportColumn[column]['survey'] = {};
                            Object.keys(Survey[column])!.forEach((survey) => {
                                this.reportColumn[column]['survey'][survey] = {
                                    label: survey,
                                };
                                this.reportSubColumn = true;
                                this.reportColumn[column]['colspan']++;
                                if (this.reportColumn[column]['panelkey'] !== '') {
                                    for (const panels of this.reportPanel) {
                                        if (panels.key === this.reportColumn[column]['panelkey']) {
                                            panels.colspan++;
                                        }
                                    }
                                }
                            });
                        }
                    }
                });

                this.reportTable.push(Survey);
            }
        } else {
            this.loadingText = 'report.data-not-found';
        }
    }

    async genColumnForm(data: any, level: number, panel?: string, panelKey?: string) {
        if (data['components']) {
            for (const component of data.components) {
                if (component.input) {
                    this.reportColumn[component.key] = {
                        label: component.label,
                        key: component.key,
                        type: component.type,
                        value: component.values,
                        colspan: 1,
                        panel: panel || '',
                        panelkey: panelKey || '',
                    };
                    if (panel !== '') {
                        for (const panels of this.reportPanel) {
                            if (panels.key === panelKey) {
                                panels.colspan++;
                            }
                        }
                    }
                    if (component.type == 'selectboxes') {
                        this.reportColumn[component.key].colspan += component.values.length;
                        this.reportSubColumn = true;
                        for (const panels of this.reportPanel) {
                            if (panels.key === panelKey) {
                                panels.colspan += this.reportColumn[component.key].colspan;
                            }
                        }
                    }
                } else {
                    if (component.label === 'Columns') {
                        for (const column of component.columns) {
                            await this.genColumnForm(column, level++, panel || '');
                        }
                    } else if (component.type === 'panel') {
                        let Panel = panel || component.title;
                        let key = component.key;
                        if (level == 0) {
                            this.reportPanel.push({ key: component.key, label: Panel, colspan: 0 });
                        } else {
                            for (const panels of this.reportPanel) {
                                if (panels.label === Panel) {
                                    key = panels.key;
                                }
                            }
                        }
                        await this.genColumnForm(component, level + 1, Panel, key);
                    }
                }
            }
        }
    }

    clickgo() {
        const startDate = moment(this.datePick.get('startDate')!.value).format('YYYY-MM-DD');
        const endDate = moment(this.datePick.get('endDate')!.value).format('YYYY-MM-DD');
        this.getReport();
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
        this.getReport();
    }

    getTotal(column: string) {
        if (this.reportTable[this.reportTable.length - 1]) return this.reportTable[this.reportTable.length - 1][column];
        else return null;
    }

    get columnVisibilityKeys(): string[] {
        return Object.keys(this.columnVisibility);
    }

    get columnNames(): string[] {
        return Object.keys(this.reportColumn);
    }

    getNumColumn() {
        return Object.keys(this.reportColumn).length;
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

    async getSurvey() {
        await this.reportService.getSurvey().subscribe((res: any) => {
            this.optionForms = res.value;
        });
    }

    onChangeForm(event: any) {
        this.selectedForms = event.target.value;
        this.selectedFormsName = event.target.options[event.target.selectedIndex].text;
        this.reportTable = [];
        this.reportColumn = [];
        this.reportPanel = [];
        this.getReport();
    }

    displayIf() {
        return this.selectedForms !== '' ? 'block' : 'none';
    }

    exportExcel(tableId: string) {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById(tableId));

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, `Survey-Form-Report-${this.selectedFormsName}${this.fileType}`);
    }
}
