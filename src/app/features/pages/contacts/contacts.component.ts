import { Component } from '@angular/core';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { catchError, throwError } from 'rxjs';
import { ContactService } from 'src/app/services/contact/contact.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
    title: string = 'ฐานข้อมูลผู้ติดต่อ';
    value: string | undefined;
    filterOption!: any[];
    selectedFilter: any | undefined;
    item: any[] = [];
    selectedSurvey: any | undefined;

    faPenToSquare = faPenToSquare;
    faTrash = faTrash;

    pageSize = 10;
    pageSizeOptions = [10, 20];
    totalPage = 0;
    firstItem = 1;
    lastItem = 10;

    constructor(private contactServices: ContactService, private sweetalertServices: SweetAlertService) {}

    ngOnInit() {
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'Only My', code: 'me' },
        ];
        this.selectedFilter = this.filterOption[0];
        this.findByPage(this.firstItem, this.pageSize);
        this.getPage();
    }

    async findByPage(page: number, offset: number) {
        this.item = await this.contactServices
            .findByPage(page, offset)
            .pipe(
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    throw error;
                }),
            )
            .toPromise();
    }

    async getPage() {
        const item = await this.contactServices.countAllItem().toPromise();
        this.totalPage = item.totalPage;
    }

    async pageChange(event: any): Promise<void> {
        if (!(this.firstItem == event.first && this.lastItem && event.first + event.rows && this.pageSize == event.rows)) {
            this.firstItem = event.first;
            this.lastItem = event.first + event.rows;
            this.pageSize = event.rows;
            await this.findByPage(event.first, event.rows);
        }
    }
}
