import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faArrowRight, faPenToSquare, faTrashCan, faCircleXmark, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import * as XLSX from 'xlsx';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import Swal from 'sweetalert2';
import { Clipboard } from '@angular/cdk/clipboard';
import { ReportService } from 'src/app/services/report/report.service';

@Component({
    selector: 'app-report-page',
    templateUrl: './report-page.component.html',
    styleUrl: './report-page.component.scss',
})
export class ReportPageComponent implements OnInit {
    surveyForms!: any;
    reportTable!: any;
    selectedSurveyForms: any = [];
    valueSearch!: string;
    checkedValues: string[] = [];

    filterOption!: any[];
    selectedFilter: any | undefined;
    selectedForm: any | undefined;

    fileType: string = config.file.type;

    faPenToSquare = faPenToSquare;
    faTrashCan = faTrashCan;
    faArrowRight = faArrowRight;
    faArrowLeft = faArrowLeft;
    faCircleXmark = faCircleXmark;
    faEye = faEye;
    faClipboard = faClipboard;

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
    sideBarItemIndex: number = 0;

    sortId: string = 'createdAt';
    sortOrder: string = 'DESC';
    sortIcon: string = '';

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userRole: string = '';
    userId: string = '';
    roleCanAccessCUDForm: string[] = config.roleCanAccessCUDForm;
    url: string = '';

    constructor(
        private router: Router,
        private surveyFormService: SurveyFormService,
        private reportService: ReportService,
        private activeRoute: ActivatedRoute,
        private sweetalertServices: SweetAlertService,
        private clipboard: Clipboard,
    ) {}

    ngOnInit() {
        this.userRole = this.userData.role.roleTitle.toLocaleLowerCase();
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'Only My', code: this.userData.username },
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
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        }
        this.getReport();
        // this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
        // this.getPage();
    }

    checkRole(): boolean {
        return this.roleCanAccessCUDForm.includes(this.userRole);
    }

    updateCheckedValues(formId: string): void {
        if (this.checkedValues.includes(formId)) {
            this.checkedValues = this.checkedValues.filter((id) => id !== formId);
        } else {
            this.checkedValues.push(formId);
        }
    }

    checkAll(ev: any) {
        this.surveyForms.forEach((x: any) => {
            x.state = ev.target.checked;
            if (ev.target.checked) {
                this.checkedValues.push(x.surveyFormId);
            } else {
                this.checkedValues = [];
            }
        });
    }

    isAllChecked() {
        return this.surveyForms && this.surveyForms.every((_: any) => _.state);
    }

    async getForm(page: number, pageSize: number) {
        await this.surveyFormService
            .getSurveyFormByPage(page, pageSize, `${this.sortId},${this.sortOrder}`, this.valueSearch, this.selectedFilter)
            .subscribe((res: any) => {
                this.surveyForms = res;
                // this.spareSurveyForms = res;
            });
    }

    async getReport() {
        await this.reportService.getchannelByAgent().subscribe((res: any) => {
            this.reportTable = res.value;
            this.calculateTotal();
        });
    }

    // async getPage() {
    //     await this.surveyFormService.countSurveyForm(this.valueSearch, this.userId).subscribe((res: any) => {
    //         this.totalItems = res.count;
    //     });
    // }

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
                // await this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
                this.checkedValues = [];
            }
        }
    }

    pageSizeChange() {
        this.currentPage = 1;
        // this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    showSideBar(value: number, itemId: string) {
        this.itemIdex = value;
        this.detailItem = this.surveyForms.find((form: any) => form.surveyFormId == itemId);
        this.sideBarItemIndex = this.surveyForms.findIndex((form: any) => form.surveyFormId == itemId);
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;

        if (this.itemIdex == 0 && this.currentPage == 1) this.visibleLeftSideBar = false;
        if (this.itemIdex == this.surveyForms.length - 1) this.visibleRightSideBar = false;
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
        // this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    edit(item: any) {
        const cb = `${this.pageSize},${this.currentPage},${this.totalItems},${this.totalPages}`;
        this.router.navigate(['/surveyform/edit'], { queryParams: { key: item.surveyFormId, cb: cb } });
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
                const data = {
                    body: [id],
                };
                this.surveyFormService
                    .deleteSurveyForm(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'Delete data success.', '', false, '');
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            throw error;
                        }),
                    )
                    .subscribe();
            }
        });
    }

    deleteSelectForm() {
        Swal.fire({
            icon: 'warning',
            title: 'Do you want to delete this form?',
            showCancelButton: true,
            confirmButtonColor: '#3066be',
            cancelButtonColor: '#ec5365',
            width: '50%',
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    body: this.checkedValues,
                };
                this.surveyFormService
                    .deleteSurveyForm(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'Delete data success.', '', false, '');
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
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
        if (this.checkedValues.length != 0) {
            this.selectedSurveyForms = this.surveyForms.filter((form: any) => this.checkedValues.includes(form.surveyFormId));
        }

        if (this.selectedSurveyForms.length != 0) {
            const processedForms = this.selectedSurveyForms.reduce(
                (acc: any, cur: any) => [
                    ...acc,
                    {
                        name: cur.name,
                        createdAt: cur.createdAt,
                        createdBy: cur.createdBy,
                    },
                ],
                [],
            );

            const columns = [['แบบฟอร์มสำรวจ', 'วันที่บันทึก', 'บันทึกโดย']];
            const wb = XLSX.utils.book_new();
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
            XLSX.utils.sheet_add_aoa(ws, columns);

            XLSX.utils.sheet_add_json(ws, processedForms, { origin: 'A2', skipHeader: true });

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            XLSX.writeFile(wb, `แบบฟอร์มสำรวจ${this.fileType}`);
        }
    }

    search() {
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        // this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
        // this.getPage();
    }

    openDialog(item: any) {
        this.surveyFormService.openDialog(item.surveyFormId);
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
