import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CallService } from 'src/app/services/call/call.service';
import { ContactService } from 'src/app/services/contact/contact.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';

@Component({
    selector: 'app-create-call',
    templateUrl: './create-call.component.html',
    styleUrl: './create-call.component.scss',
})
export class CreateCallComponent {
    selectedDate: Date;
    contactId: string = '';
    casetopic: any[] = [];
    organizations: any;
    contacts: any[] = [];

    contactName!: string;
    status: string = '';
    parent: string = '';
    parentSub: any;
    startTime: string = '';
    endTime: string = '';
    direction: string = '';
    duration: string = '';
    description: string = '';
    timepickStart: any;
    hour: any;
    solutions: string = '';

    selectedItem: any;
    selectedData: any[] = [];
    detailItem: any;
    combinedDateTimeStart: string = '';
    combinedDateTimeEnd: string = '';

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private callServive: CallService,
        private sweetalertServices: SweetAlertService,
    ) {
        this.selectedDate = new Date();
    }

    prev() {
        this.location.back();
    }

    timepickEnd = true;
    meridian = true;
    seconds = true;
    seconds1 = true;

    date = new FormControl(new Date());
    serializedDate = new FormControl(new Date().toISOString());

    formatStartDate() {
        const startDate = new Date(this.startTime);

        const formattedStartDate = startDate.toISOString().split('T')[0];

        this.startTime = formattedStartDate;
    }

    formatEndDate() {
        const endDate = new Date(this.endTime);

        const formattedEndDate = endDate.toISOString().split('T')[0];

        this.endTime = formattedEndDate;
    }

    formatTimepickStart() {
        const startTimepick = new Date(this.timepickStart);
        const formatTimepickStart = startTimepick.toISOString();
        this.timepickStart = formatTimepickStart;
    }

    onTimepickStartChange(event: any) {
        const hour = event.hour;
        const minute = event.minute;
        const second = event.second;

        this.timepickStart = event;

        const formattedTimeStartPick = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
            .toString()
            .padStart(2, '0')}`;

        this.combinedDateTimeStart = `${this.startTime} ${formattedTimeStartPick}`;
    }

    onTimepickEndChange(event: any) {
        const hour = event.hour;
        const minute = event.minute;
        const second = event.second;

        this.timepickEnd = event;

        const formattedTimeEndPick = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
            .toString()
            .padStart(2, '0')}`;

        this.combinedDateTimeEnd = `${this.endTime} ${formattedTimeEndPick}`;
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params: any) => {
            this.contactId = params['contactId'];
        });
    }

    loadData(option: string) {
        switch (option) {
            case 'contacts':
                this.callServive.getAllContacts().subscribe((contacts: any) => {
                    this.selectedData = contacts;
                });
                break;
            case 'organizations':
                this.callServive.getOrganizations().subscribe((organizations: any) => {
                    this.selectedData = organizations;
                });
                break;
            case 'casetopics':
                this.callServive.getCaseTopic().subscribe((casetopics: any) => {
                    this.selectedData = casetopics;
                });
                break;
            default:
                this.selectedData = [];
                break;
        }
    }

    submit() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const data = {
            contactId: this.contactId,
            name: this.contactName,
            status: this.status,
            direction: this.direction,
            caseTopicName: this.parentSub,
            description: this.description,
            startTime: this.combinedDateTimeStart,
            endTime: this.combinedDateTimeEnd,
            duration: this.duration,
            solution: this.solutions,
            createdById: userData.userId,
        };
        this.callServive
            .createCalls(data)
            .pipe(
                tap((res) => {
                    this.sweetalertServices.getSwal('success','บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '/contacts');
                }),
                catchError((error) => {
                    this.sweetalertServices.handleError(error);
                    throw error;
                }),
            )
            .subscribe();
    }
}
