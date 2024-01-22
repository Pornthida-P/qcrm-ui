import { Component, OnInit } from '@angular/core';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { SurveyService } from 'src/app/services/survey/survey.service';
import * as XLSX from 'xlsx';
import { config } from 'src/app/config/config';

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit {
    value: string | undefined;
    filterOption!: any[];
    selectedFilter: any | undefined;
    surveys!: any[];
    selectedSurvey: any = [];
    fileType: string = config.file.type;
    faPenToSquare = faPenToSquare;

    constructor(private surveyService: SurveyService) {}

    ngOnInit() {
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'Only My', code: 'me' },
        ];
        this.selectedFilter = this.filterOption[0];

        this.surveys = this.surveyService.getData();
    }

    onSelectionChange(value: any[]) {
        console.log(this.selectedSurvey);
    }

    editSurveys() {
        console.log('edit', this.selectedSurvey);
    }

    exportExcel() {
        if (this.selectedSurvey.length != 0) {
            const columns = [['เลขที่การทำแบบสำรวจ', 'ชื่อผู้ติดตามและประเมินผลฯ', 'แบบฟอร์มสำรวจ', 'ประจำปี (ค.ศ.)', 'วันที่บันทึก']];
            const wb = XLSX.utils.book_new();
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
            XLSX.utils.sheet_add_aoa(ws, columns);

            XLSX.utils.sheet_add_json(ws, this.selectedSurvey, { origin: 'A2', skipHeader: true });

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            XLSX.writeFile(wb, `การติดตามและประเมินผล${this.fileType}`);
        }
    }

    deleteSurvey() {
        console.log('delete', this.selectedSurvey);
    }
}
