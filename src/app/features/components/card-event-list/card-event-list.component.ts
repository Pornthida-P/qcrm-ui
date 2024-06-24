import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { faArrowUpShortWide, faArrowUpWideShort, faPlusCircle, faSort, faUser } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user/user.service';
import { ModalCalendarService } from 'src/app/services/modal-calendar/modal-calendar.service';
import { CalendarEvent, CalendarTag } from 'src/app/shared/interface/calendar.interface';
import { User } from 'src/app/shared/interface/user.interface';

@Component({
    selector: 'app-card-event-list',
    templateUrl: './card-event-list.component.html',
    styleUrl: './card-event-list.component.scss',
})
export class CardEventListComponent implements OnInit, OnChanges {
    @Input() tag?: CalendarTag;
    @Input() events: CalendarEvent[] = [];
    @Input() title?: string = '';
    @Input() isShowFilter?: boolean = true;
    @Input() isShowTitle?: boolean = true;

    @Output() onClickAdd: EventEmitter<any> = new EventEmitter();

    userData: User | null = null;
    isAction: boolean = false;
    isDeleteEvent: boolean = false;

    members: User[] = [];
    selectedDate: string = 'month';
    selectedMembers: string[] = [];
    isFilterSearch: string = '';
    isFilterAttachment: boolean = false;
    isFilterSort: string = 'asc';

    faUser = faUser;
    faPlus = faPlusCircle;
    faSort = faSort;
    faArrowUpWideShort = faArrowUpWideShort;
    faArrowUpShortWide = faArrowUpShortWide;

    constructor(private userService: UserService, private modalCalendarService: ModalCalendarService) {}

    ngOnInit(): void {
        this.initzation();
    }

    ngOnChanges(changes: any): void {}

    initzation() {
        this.findAllMembers();
        this.getUserData();
    }

    getUserData() {
        this.userService.getDataUser().subscribe((user: User | null) => {
            this.userData = user;
            this.isAction = user?.role?.roleTitle.toLowerCase() === 'admin';
        });
    }

    findAllMembers() {
        this.userService.getAllUser().subscribe((members: User[]) => {
            this.members = members;
        });
    }

    onSelectDateChange(value: string) {
        this.selectedDate = value;
    }

    onClickSort() {
        this.isFilterSort = this.isFilterSort === 'asc' ? 'desc' : 'asc';
    }

    onClickSaveFilterMember() {}

    onMemberCheckboxChange(memberId: string) {
        const index = this.selectedMembers.indexOf(memberId);
        if (index === -1) {
            this.selectedMembers.push(memberId);
        } else {
            this.selectedMembers.splice(index, 1);
        }
    }

    onClickFilterAttachment() {
        this.isFilterAttachment = !this.isFilterAttachment;
    }

    onClickAddEvent(tag: CalendarTag): void {
        let obj: CalendarEvent = {
            eventId: 0,
            title: '',
            tag: tag,
            location: '',
            startDate: '',
            endDate: '',
            description: '',
            members: [],
            attachments: [],
            createdAt: '',
            createdById: '',
            modifyAt: '',
            modifyById: '',
            username: '',
        };
        this.onClickAdd.emit(obj);
    }

    onClickViewEvent(event: CalendarEvent): void {
        if(!this.isDeleteEvent){
            this.modalCalendarService.openDialog('view', event)
        }
    }
    onClickDeleteEvent(isDeleteEvent:boolean){
        this.isDeleteEvent = isDeleteEvent;
    }
    getFilteredEvents(): CalendarEvent[] {
        let filteredEvents = this.events;
        // console.log('this.events',this.events);

        if (this.selectedDate) {
            const currentDate = new Date();
            let startDate = new Date();
            let endDate = new Date();

            switch (this.selectedDate) {
                case 'day':
                    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
                    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
                    break;
                case 'week':
                    const firstDayOfWeek = currentDate.getDate() - currentDate.getDay();
                    const lastDayOfWeek = firstDayOfWeek + 6;
                    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), firstDayOfWeek, 0, 0, 0);
                    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), lastDayOfWeek, 23, 59, 59);
                    break;
                case 'month':
                    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                    startDate = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), 1, 0, 0, 0);
                    endDate = new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate(), 23, 59, 59);
                    break;
                case 'year':
                    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
                    const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31);
                    startDate = new Date(firstDayOfYear.getFullYear(), firstDayOfYear.getMonth(), firstDayOfYear.getDate(), 0, 0, 0);
                    endDate = new Date(lastDayOfYear.getFullYear(), lastDayOfYear.getMonth(), lastDayOfYear.getDate(), 23, 59, 59);
                    break;
                case 'all':
                    startDate = new Date(0);
                    endDate = new Date();
                    break;
                default:
                    console.error('Invalid selectedDate value');
                    break;
            }

            filteredEvents = filteredEvents.filter((event) => {
                const eventStartDate = new Date(event.startDate);
                const eventEndDate = new Date(event.endDate);

                return eventStartDate >= startDate && eventEndDate <= endDate;
            });
        }

        if (this.selectedMembers.length > 0) {
            filteredEvents = filteredEvents.filter((event) => event.members.some((member) => this.selectedMembers.includes(member.userId)));
        }

        if (this.isFilterAttachment) {
            filteredEvents = filteredEvents.filter((event) => event.attachments && event.attachments.length > 0);
        }

        if (this.isFilterSearch) {
            filteredEvents = filteredEvents.filter((event) => event.title.toLowerCase().includes(this.isFilterSearch.toLowerCase()));
        }

        if (this.isFilterSort) {
            filteredEvents = filteredEvents.sort((a, b) => {
                if (this.isFilterSort === 'asc') {
                    return moment(a.startDate).isBefore(b.startDate) ? -1 : 1;
                } else {
                    return moment(a.startDate).isAfter(b.startDate) ? -1 : 1;
                }
            });
        }

        return filteredEvents;
    }
}
