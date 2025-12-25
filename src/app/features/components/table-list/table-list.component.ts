import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ChangeDetectorRef, DoCheck } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faEdit, faEye, faGear, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
import { StatusService } from 'src/app/services/status/status.service';

@Component({
    selector: 'app-table-list',
    templateUrl: './table-list.component.html',
    styleUrl: './table-list.component.scss',
})
export class TableListComponent implements OnInit, OnChanges, DoCheck {
    @Input() title: string = '';
    @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    @Input() displayedColumns: string[] = [];
    @Input() isAction: boolean = false;
    @Input() isShowTool: boolean = false;

    private previousFilteredLength: number = 0;
    private previousFilter: string = '';

    @Output() view: EventEmitter<any> = new EventEmitter<any>();
    @Output() edit: EventEmitter<any> = new EventEmitter<any>();
    @Output() delete: EventEmitter<any> = new EventEmitter<any>();

    // Column type includes
    includesDate: string[] = ['createdAt', 'modityAt', 'lastLogin', 'startDate', 'endDate', 'requestDateTime', 'assignedAt'];
    includesRole: string[] = ['role'];
    includesProfile: string[] = ['profile'];
    includesStatus: string[] = ['isActive'];
    includesStatusName: string[] = ['status', 'statusName'];
    includesChannel: string[] = ['channel', 'channelName'];
    includesPhone: string[] = ['phone', 'phoneNumber', 'contactNumber', 'caller'];
    includesColor: string[] = ['color'];
    includesScript: string[] = ['script'];
    includesDescription: string[] = ['description'];
    includesCallStatus: string[] = ['callStatus'];
    includesTruncate: string[] = ['subject', 'topic'];

    paginatedData: any[] = [];
    currentPage: number = 1;
    totalPages: number = 1;
    pages: any[] = [];
    pageSize: number = 5;
    pageSizeOptions = [5, 10, 25, 100];

    faGear = faGear;
    faEye = faEye;
    faEdit = faEdit;
    faTrash = faTrash;

    profileError: string = './assets/qcrm-ui/image/profile/user.jpg';

    constructor(private socketIO: SocketIoService, private cdr: ChangeDetectorRef, public statusService: StatusService) {}

    ngOnInit(): void {
        this.updatePages();
    }

    ngOnChanges(): void {
        this.updatePages();
    }

    ngDoCheck(): void {
        const currentFilter = this.dataSource.filter || '';
        const currentFilteredLength = this.dataSource.filteredData?.length || 0;

        if (currentFilter !== this.previousFilter || currentFilteredLength !== this.previousFilteredLength) {
            if (currentFilter !== this.previousFilter) {
                this.currentPage = 1;
            }
            this.previousFilter = currentFilter;
            this.previousFilteredLength = currentFilteredLength;
            this.updatePages();
        }
    }

    onClickView(element: any): void {
        this.view.emit(element);
    }

    onClickEdit(element: any): void {
        this.edit.emit(element);
    }

    onClickDelete(element: any): void {
        this.delete.emit(element);
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }

    getStatusOnline(userId?: string): boolean {
        return this.socketIO.getStatusOnline(userId);
    }

    getCellClass(column: string): string {
        // Columns that need truncation with max-width
        if (this.includesTruncate.includes(column)) {
            return 'text-truncate truncate-cell';
        }
        if (this.includesDescription.includes(column)) {
            return 'text-truncate description-cell';
        }
        return '';
    }

    pageChange(page: number): void {
        if (page < 1 || page > this.totalPages) {
            return;
        }
        this.currentPage = page;
        this.updatePages();
    }

    pageSizeChange(): void {
        this.currentPage = 1;
        this.updatePages();
    }

    updatePages(): void {
        this.totalPages = Math.ceil(this.dataSource.filteredData.length / this.pageSize);

        const startIndex = this.pageSize * (this.currentPage - 1);
        const endIndex = Math.min(startIndex + this.pageSize, this.dataSource.filteredData.length);

        this.paginatedData = this.dataSource.filteredData.slice(startIndex, endIndex);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    formatScript(script: string): string {
        if (!script) return '';
        return script.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    }
}
