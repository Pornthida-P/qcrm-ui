import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { faGear, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { catchError, tap } from 'rxjs/operators';
import { SentimentManagementComponent } from 'src/app/features/modals/sentiment-management/sentiment-management.component';
import { CallService } from 'src/app/services/call/call.service';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-sentiment-tab',
    standalone: false,
    templateUrl: './sentiment-tab.component.html',
    styleUrl: './sentiment-tab.component.scss',
})
export class SentimentTabComponent implements OnInit {
    title: string = 'sentiment';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['name', 'type'];
    isAction: boolean = true;
    isShowTool: boolean = true;
    faGear = faGear;
    faPlusCircle = faPlusCircle;
    sentiments: any[] = [];

    constructor(
        private callService: CallService,
        private sweetalertService: SweetAlertService,
        private dialog: MatDialog,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        this.findAllSentiment();
    }

    onClickView(data: any) {
        this.openDialog('view', data);
    }

    onClickEdit(data: any) {
        this.openDialog('edit', data);
    }

    onClickDelete(data: any) {
        this.sweetalertService
            .confirmSwal(
                'warning',
                this.translateService.instant('alert.warning'),
                this.translateService.instant('alert.confirmDeleteSentiment'),
                this.translateService.instant('alert.yes'),
                this.translateService.instant('alert.no'),
            )
            .then((result: { isConfirmed: any }) => {
                if (result.isConfirmed) {
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    this.callService
                        .deleteSentiment(data.id, userData.userId)
                        .pipe(
                            tap(() => {
                                this.sweetalertService.success('alert.deleteSentimentSuccess');
                                this.findAllSentiment();
                            }),
                            catchError((error) => {
                                this.sweetalertService.handleError(error);
                                throw error;
                            }),
                        )
                        .subscribe();
                }
            });
    }

    onClickAdd() {
        this.openDialog('add');
    }

    onSearch(text: string) {
        this.dataSource.filter = text.trim().toLowerCase();
    }

    findAllSentiment() {
        this.callService
            .getSentiment()
            .pipe(
                tap((response: any) => {
                    const sentiments = Array.isArray(response) ? response : [];
                    this.sentiments = sentiments;
                    this.dataSource = new MatTableDataSource<any>(this.sentiments);
                }),
                catchError((error) => {
                    this.sweetalertService.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }

    openDialog(mode: 'add' | 'view' | 'edit', sentiment?: any): void {
        const dialogRef = this.dialog.open(SentimentManagementComponent, {
            width: '50%',
            maxWidth: '600px',
            data: { mode, sentiment },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.findAllSentiment();
            }
        });
    }
}
