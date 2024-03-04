import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-phone-contacts',
    templateUrl: './phone-contacts.component.html',
    styleUrl: './phone-contacts.component.scss',
})
export class PhoneContactsComponent {
    contact: any = {};

    calls: string | null | undefined;
    detadetailItemByPhoneilItem: any;
    detailItemByPhone: any;
    contactFirstName: any;
    contactIden: any;
    contactType: any;
    contactEmail: any;
    contactProductType: any;
    contactSource: any;
    contactNumber: any;
    contactLastName: any;
    organizations: any;
    contactProvince: any;
    contactId: any;
    contactOrg: any;

    constructor(
        private _location: Location,
        private contactsService: ContactsService,
        private sweetalertServices: SweetAlertService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.contact = { components: [] };
    }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            this.calls = params.get('phone');

            if (this.contactId) {
                this.getContactByPhoneId(this.contactId);
            }
            if (this.calls) {
                this.contactsService.getContactsByParamPhone(this.calls).subscribe((data: any) => {
                    if (data && data.length > 0) {
                        this.contact = data[0].contactNumber;
                        this.getContactByPhoneId(this.contact);
                    } else {
                        console.log('Data does not exist');
                    }
                });
            }
        });
        this.contactsService.getAllOrganization().subscribe((organizations: any) => {
            this.organizations = organizations;
        });
    }
    async getContactByPhoneId(contactId: string) {
        try {
            const res: any = await this.contactsService.getContactsByParamPhone(contactId).toPromise();

            if (res && res.length > 0) {
                const detailItemByPhone = res[0];
                this.contactId = detailItemByPhone.contactId;
                this.contactFirstName = detailItemByPhone.firstName;
                this.contactLastName = detailItemByPhone.lastName;
                this.contactIden = detailItemByPhone.identification;
                this.contactOrg = detailItemByPhone.organization_id;
                this.contactType = detailItemByPhone.contactType;
                this.contactEmail = detailItemByPhone.email;
                this.contactNumber = detailItemByPhone.contactNumber;
                this.contactProvince = detailItemByPhone.province;
                this.contactProductType = detailItemByPhone.product_type;
                this.contactSource = detailItemByPhone.source;
            } else {
                console.log('Data does not exist');
            }
        } catch (error) {
            console.error('Error getting contact by phone ID:', error);
        }
    }

    prev() {
        this._location.back();
    }

    submit() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const contactId = uuidv4();
        if (this.contactId) {
            const data = {
                contactId: this.contactId,
                firstName: this.contactFirstName,
                lastName: this.contactLastName,
                identification: this.contactIden,
                organizationId: this.contactOrg,
                contactType: this.contactType,
                email: this.contactEmail,
                contactNumber: this.contactNumber,
                province: this.contactProvince,
                modifiedById: userData.userId,
            };
            this.contactsService
                .editContacts(data)
                .pipe(
                    tap((res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                        }).then(() => {
                            this.router.navigate(['/call/create-call'], { queryParams: { contactId: this.contactId } });
                        });
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        throw error;
                    }),
                )
                .subscribe();
        } else {
            const data = {
                firstName: this.contactFirstName,
                lastName: this.contactLastName,
                identification: this.contactIden,
                organizationId: this.contactOrg,
                contactType: this.contactType,
                email: this.contactEmail,
                contactNumber: this.contactNumber,
                province: this.contactProvince,
                createdById: userData.userId,
            };
          console.log('data:', data)
            this.contactsService
                .createContacts(data)
                .pipe(
                    tap((res) => {
                        this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '/call/create-call');
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        throw error;
                    }),
                )
                .subscribe();
        }
    }
}
