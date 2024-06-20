import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faPlusCircle, faTag, faEye } from '@fortawesome/free-solid-svg-icons';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
import { UserService } from 'src/app/services/user/user.service';
import { CalendarEvent } from 'src/app/shared/interface/calendar.interface';
import { User } from 'src/app/shared/interface/user.interface';

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
    tagList: any = [];
    userData: User | null = null;
    isAction: boolean = false;
    isBorder: boolean = true

    faPlus = faPlusCircle;
    faTag = faTag;
    faView = faEye;

    title: string = 'home';

    constructor(private userService: UserService, private modalCalendarService: ModalCalendarService) {}

    ngOnInit(): void {
        console.log('before');

        this.initzation();
        console.log('after');
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
        let arr1 = Object.assign([]);
        let arr2 = Object.assign([]);
        let arr3 = Object.assign([]);
        let arr4 = Object.assign([]);
        event.map((mp) => {
            if (mp.tag.tagId == 1) arr1.push(mp);
            if (mp.tag.tagId == 2) arr2.push(mp);
            if (mp.tag.tagId == 3) arr3.push(mp);
            if (mp.tag.tagId == 7) arr4.push(mp);
        });
        this.tagList = Object.assign([
            {
                tagName: 'Information',
                color: '#d63384',
                events: arr1,
            },
            {
                tagName: 'Morning Brief',
                color: '#20cb98',
                events: arr2,
            },
            {
                tagName: 'Announcement',
                color: '#6f42c1',
                events: arr3,
            },
            {
                tagName: 'Team Activities',
                color: '#ff9500',
                events: arr4,
            },
        ]);

        console.log('tagList :', this.tagList);
    }

    onSelectDate(date: Date) {
        this.selectedCalendarDate = date;
    }

    onClickAddEvent() {
        this.modalCalendarService.openDialog('add');
    }
}
