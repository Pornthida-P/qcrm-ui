import { Component, OnInit, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { SurveyForm } from 'src/app/shared/interface/survey-form';
import { Observable } from 'rxjs';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { NgbdSortableHeader, SortEvent } from './sortable.directive';
@Component({
    selector: 'app-survey-form',
    templateUrl: './survey-form.component.html',
    styleUrls: ['./survey-form.component.scss'],
})
export class SurveyFormComponent implements OnInit {
    surveyForms!: any;
    selectedSurveyForms: any = [];

    value: string | undefined;

    filterOption!: any[];
    selectedFilter: any | undefined;
    selectedForm: any | undefined;
    faPenToSquare = faPenToSquare;
    faTrashCan = faTrashCan;

    fileType: string = config.file.type;
    forms$: Observable<SurveyForm[]>;
    total$: Observable<number>;

    visibleRightSideBar: boolean = true;
    visibleLeftSideBar: boolean = true;
    detailItem: any = undefined;
    emptyItem: String = 'ว่าง';
    itemIdex: number = 0;

    @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

    constructor(private router: Router, public surveyFormService: SurveyFormService) {
        this.forms$ = surveyFormService.forms$;
        this.total$ = surveyFormService.total$;
    }

    ngOnInit() {
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'Only My', code: 'me' },
        ];
        this.selectedFilter = this.filterOption[0];
        this.getForm();
    }

    formManage() {
        this.router.navigate(['/surveyform/new']);
    }

    onSort({ column, direction }: SortEvent) {
        // resetting other headers
        this.headers.forEach((header) => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        this.surveyFormService.sortColumn = column;
        this.surveyFormService.sortDirection = direction;
    }

    exportExcel() {
        if (this.selectedSurveyForms.length != 0) {
            const columns = [['แบบฟอร์มสำรวจ', 'วันที่บันทึก', 'แบบฟอร์มสำรวจ', 'บันทึกโดย']];
            const wb = XLSX.utils.book_new();
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
            XLSX.utils.sheet_add_aoa(ws, columns);

            XLSX.utils.sheet_add_json(ws, this.selectedSurveyForms, { origin: 'A2', skipHeader: true });

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            XLSX.writeFile(wb, `แบบฟอร์มสำรวจ${this.fileType}`);
        }
    }

    editSurveyForms() {
        console.log('edit', this.selectedSurveyForms);
    }

    deleteSurveyForms() {
        console.log('delete', this.selectedSurveyForms);
    }

    onSelectionChangeForms(value: any[]) {
        console.log(this.selectedSurveyForms);
    }

    getForm() {
        this.surveyFormService.getSurveyForm().subscribe((res) => {
            this.surveyForms = res;
        });
    }
}
