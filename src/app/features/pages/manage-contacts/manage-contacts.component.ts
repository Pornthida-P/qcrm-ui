import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
@Component({
    selector: 'app-manage-contacts',
    templateUrl: './manage-contacts.component.html',
    styleUrls: ['./manage-contacts.component.scss'],
})
export class ManageContactsComponent implements OnInit {
    organizations: any[] = [];
    contactActivities: any[] = [];
    contact: any = {};
    contactFirstName: string = '';
    contactLastName: string = '';
    contactIden: string = '';
    contactOrg: string = '';
    contactType: string = '';
    contactEmail: string = '';
    contactNum: string = '';
    contactProvince: string = '';
    contactProductType: string = '';
    contactSource: string = '';
    activityName: string = '';
    isContactSelected: boolean = false;
    typeContact: string[] = ['addComponent', 'saveComponent'];
    contactId: string = '';
    cb: string = '';
    state: string = '';
    detailItem: any = undefined;
    TableShowing: boolean = false;

    userRole: string = '';
    roleCanAccessCUDForm: string[] = config.roleCanAccessCUDForm;

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
        const state = history.state;
        if (state.itemId) {
            this.contactId = state.itemId;
            this.state = state.state;
            this.cb = state.cb;
        } else {
            this.route.queryParams.subscribe((params) => {
                this.contactId = params['key'];
                this.cb = params['cb'];
            });
        }

        if (this.contactId) {
            this.getContactById(this.contactId);
        }
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.userRole = userData.role.roleTitle.toLocaleLowerCase();
        this.contactsService.getAllOrganization().subscribe((organizations: any) => {
            this.organizations = organizations;
        });

        if (this.contactId) {
            this.TableShowing = true;
        } else {
            this.TableShowing = false;
        }
    }

    checkRole(): boolean {
        return this.roleCanAccessCUDForm.includes(this.userRole);
    }

    async getContactById(contactId: string) {
        await this.contactsService.getContactsById(contactId).subscribe((res: any) => {
            this.detailItem = res[0];
            this.contactFirstName = this.detailItem.firstName;
            this.contactLastName = this.detailItem.lastName;
            this.contactIden = this.detailItem.iden;
            this.contactOrg = this.detailItem.organization_id;
            this.contactType = this.detailItem.contact_type;
            this.contactEmail = this.detailItem.email;
            this.contactNum = this.detailItem.contactNumber;
            this.contactProvince = this.detailItem.province;
            this.contactProductType = this.detailItem.product_type;
            this.contactSource = this.detailItem.sourced;

            this.contactsService.getContactActivities(this.contactIden).subscribe((res: any) => {
                this.contactActivities = res;
            });
        });


    }

    prev() {
        this._location.back();
        this.state = '';
    }

    submit() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        // if (userData && this.contactId && this.contactId !== '' && this.contact.components.length > 1) {
            if (this.detailItem && this.state != 'copy') {
                const data = {
                    contactId: this.contactId,
                    firstName: this.contactFirstName,
                    lastName: this.contactLastName,
                    identification: this.contactIden,
                    organizationId: this.contactOrg,
                    contactType: this.contactType,
                    email: this.contactEmail,
                    contactNumber: this.contactNum,
                    province: this.contactProvince,
                    modifiedById: userData.userId,
                };

                this.contactsService
                    .editContacts(data)
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
            } else {
                const data = {
                    firstName: this.contactFirstName,
                    lastName: this.contactLastName,
                    identification: this.contactIden,
                    organizationId: this.contactOrg,
                    contactType: this.contactType,
                    email: this.contactEmail,
                    contactNumber: this.contactNum,
                    province: this.contactProvince,
                    createdById: userData.userId,
                };

                this.contactsService
                    .createContacts(data)
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
        // } else {
        //     this.sweetalertServices.getSwal('error', 'Contact name and contact component cannot be empty.', '', false, '');
        // }
    }
}
