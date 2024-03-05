import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
import { UserService } from 'src/app/services/user/user.service';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';
import { User } from 'src/app/shared/interface/user.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChild('calendar') calendar!: ElementRef;
    @ViewChild('event') event!: ElementRef;

    selectedCalendarDate: Date | null = new Date();
    calendarDateEvents: CalendarEvent[] = [];
    events: any = [];
    userData: User | null = null;
    isAction: boolean = false;

    faPlus = faPlusCircle;

    title: string = 'หน้าหลัก';

    constructor(
        private userService: UserService,
        private modalCalendarService: ModalCalendarService,
        private translateService: TranslateService,
    ) {
        translateService.setDefaultLang('th');
    }

    ngOnInit(): void {
        this.initzation();
    }

    ngAfterViewInit() {
        const calendarHeight = this.calendar.nativeElement.offsetHeight;
        this.event.nativeElement.style.maxHeight = `${calendarHeight}px`;
    }

    initzation() {
        this.getUserData();
    }

    getUserData() {
        this.userService.getDataUser().subscribe((res: User | null) => {
            this.userData = res;
            this.isAction = this.userData?.role.roleTitle.toLowerCase() === 'admin' ? true : false;
        });
    }

    onEventChange(event: CalendarEvent[]) {
        this.events = event;
    }

    onSelectDate(date: Date) {
        this.selectedCalendarDate = date;
    }

    onClickAddEvent() {
        this.modalCalendarService.openDialog('add');
    }
}
