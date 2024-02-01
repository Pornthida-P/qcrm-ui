import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { faArrowLeft, faArrowRight, faPenToSquare, faTrashCan, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import * as XLSX from 'xlsx';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { SurveyForm } from 'src/app/shared/interface/survey-form';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import Swal from 'sweetalert2';

@Pipe({
    name: 'searchFilter',
})
export class SearchPipe implements PipeTransform {
    transform(value: any, args: any, filter: any): any {
        if (value) {
            return value.filter((val: SurveyForm) => {
                switch (filter) {
                    case 'all':
                        if (!args) return true;
                        else return val.name.toLocaleLowerCase().includes(args);
                    default:
                        if (!args) return val.createdBy.toLocaleLowerCase().includes(filter);
                        else return val.createdBy.toLocaleLowerCase().includes(filter) && val.name.toLocaleLowerCase().includes(args);
                }
            });
        }
    }
}

@Component({
    selector: 'app-survey-form',
    templateUrl: './survey-form.component.html',
    styleUrls: ['./survey-form.component.scss'],
})
export class SurveyFormComponent implements OnInit {
    surveyForms!: any;
    selectedSurveyForms: any = [];
    valueSearch!: string;

    filterOption!: any[];
    selectedFilter: any | undefined;
    selectedForm: any | undefined;

    fileType: string = config.file.type;

    faPenToSquare = faPenToSquare;
    faTrashCan = faTrashCan;
    faArrowRight = faArrowRight;
    faArrowLeft = faArrowLeft;
    faCircleXmark = faCircleXmark;

    pageSizeOptions = [10, 20];
    pageSize = 10;
    currentPage = 1;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;

    visibleRightSideBar: boolean = true;
    visibleLeftSideBar: boolean = true;
    detailItem: any = undefined;
    emptyItem: String = 'ว่าง';
    itemIdex: number = 0;

    sortId: string = '-';
    sortOrder: string = 'ASC';
    sortIcon: string = '';

    constructor(
        private router: Router,
        public surveyFormService: SurveyFormService,
        private activeRoute: ActivatedRoute,
        private sweetalertServices: SweetAlertService,
    ) {}

    ngOnInit() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'Only My', code: userData.username },
        ];
        this.activeRoute.queryParams.subscribe((params) => {
            if (params['cb'] != undefined && params['cb'] != '') {
                const cbArray = params['cb'].split(',').map(Number);
                this.pageSize = cbArray[0];
                this.currentPage = cbArray[1];
                this.totalItems = cbArray[2];
                this.totalPages = cbArray[3];
            }
        });
        this.selectedFilter = this.filterOption[0].code;
        this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }

    async getForm(page: number, pageSize: number) {
        await this.surveyFormService.getSurveyFormByPage(page, pageSize, `${this.sortId},${this.sortOrder}`).subscribe((res: any) => {
            this.surveyForms = res;
        });
    }

    async getFormSideBar(page: number, pageSize: number, value: string) {
        await this.surveyFormService
            .getSurveyFormByPage(page, pageSize, `${this.sortId},${this.sortOrder}`)
            .subscribe((res: any) => {
                this.surveyForms = res;
            })
            .add(() => {
                if (value == 'right') this.showSideBar(0);
                else if (value == 'left') this.showSideBar(this.pageSize - 1);
            });
    }

    async getPage() {
        await this.surveyFormService.countSurveyForm().subscribe((res: any) => {
            this.totalItems = res.count;
        });
    }

    get pages(): number[] {
        var page: number[] = [];
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        for (var i = -this.pagesToShow; i <= this.pagesToShow; i++) {
            if (this.currentPage + i > 0 && this.currentPage + i <= this.totalPages) {
                page.push(this.currentPage + i);
            }
        }
        return page;
    }

    async pageChange(page: number) {
        if (page != this.currentPage) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                await this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
            }
        }
    }

    pageChangeSideBar(page: number, value: string): void {
        if (page != this.currentPage) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.getFormSideBar((this.currentPage - 1) * this.pageSize, this.pageSize, value);
            }
        }
    }

    pageSizeChange() {
        this.currentPage = 1;
        this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    showSideBar(value: number) {
        this.itemIdex = value;
        this.detailItem = this.surveyForms[this.itemIdex];
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;

        if (this.itemIdex == 0 && this.currentPage == 1) this.visibleLeftSideBar = false;
        if (this.itemIdex == this.surveyForms.length - 1 && this.currentPage == this.totalPages) this.visibleRightSideBar = false;
    }

    sort(value: string) {
        if (this.sortId == value) {
            if (this.sortIcon == 'fa-solid fa-sort-down') {
                this.sortIcon = 'fa-solid fa-sort-up';
                this.sortOrder = 'DESC';
            } else {
                this.sortIcon = 'fa-solid fa-sort-down';
                this.sortOrder = 'ASC';
            }
        } else {
            this.sortId = value;
        }
        this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    async changeSideBar(value: string) {
        if (value == 'right') {
            if (this.itemIdex >= this.pageSize - 1) {
                await this.pageChangeSideBar(this.currentPage + 1, value);
            } else {
                this.showSideBar(this.itemIdex + 1);
            }
        } else if (value == 'left') {
            if (this.itemIdex == 0) {
                await this.pageChangeSideBar(this.currentPage - 1, value);
            } else {
                this.showSideBar(this.itemIdex - 1);
            }
        }
    }

    edit(item: any) {
        const cb = `${this.pageSize},${this.currentPage},${this.totalItems},${this.totalPages}`;
        this.router.navigate(['/surveyform/edit'], { queryParams: { itemId: item.surveyFormId, cb: cb } });
    }

    deleteForm(id: string) {
        Swal.fire({
            icon: 'warning',
            title: 'Do you want to delete this form?',
            showCancelButton: true,
            confirmButtonColor: '#3066be',
            cancelButtonColor: '#ec5365',
            width: '50%',
        }).then((result) => {
            if (result.isConfirmed) {
                this.surveyFormService
                    .deleteSurveyForm(id)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'Delete data success.', '', false, '');
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.handleError(error);
                            throw error;
                        }),
                    )
                    .subscribe();
            }
        });
    }

    formManage() {
        this.router.navigate(['/surveyform/new']);
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

    handleError(error: any) {
        let icon: string;
        let errorMessage: string;
        let title: string;
        let route: string;

        switch (error.status) {
            case 401:
                icon = 'warning';
                title = 'warning Authentication';
                errorMessage = 'Your session has expired. Please log in again.';
                route = 'login';
                break;
            default:
                icon = 'error';
                title = 'Survey Form Error';
                errorMessage = 'Failed to load survey forms. Please try again later.';
                route = '';
                break;
        }

        this.sweetalertServices.getSwal(icon, title, errorMessage, false, route);
    }
}
