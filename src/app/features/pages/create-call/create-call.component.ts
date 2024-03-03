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

    contactName: string = '';
    status: string = '';
    parent: string = '';
    parentSub: string = '';
    startTime: string = '';
    endTime: string = '';
    direction: string = '';
    duration: string = '';
    description: string = '';

    selectedItem: any;
    selectedData: any[] = [];
    detailItem: any;

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

    time = true;
    time1 = true;
    meridian = true;
    seconds = true;
    seconds1 = true;

    date = new FormControl(new Date());
    serializedDate = new FormControl(new Date().toISOString());

    ngOnInit(): void {
        this.route.queryParams.subscribe((params: any) => {
            this.contactId = params['contactId'];
            console.log('contactId', this.contactId);
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
          startTime: this.startTime,
          endTime: this.endTime,
          duration: this.duration,
          createdById: userData.userId,
      };

      this.callServive
          .createCalls(data)
          .pipe(
              tap((res) => {
                  this.sweetalertServices.getSwal('success', 'Save data success.', '', false, '/contacts');
              }),
              catchError((error) => {
                  this.sweetalertServices.handleError(error);
                  throw error;
              }),
          )
          .subscribe();
  }
}
