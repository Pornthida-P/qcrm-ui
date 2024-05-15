import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
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

    contactOrg: string = '';
    call_id: string = '';
    caller_id: string = '';

    visibleRightSideBar: boolean = true;
    visibleLeftSideBar: boolean = true;
    FormShowing: boolean = false;
    SearchFormShowing: boolean = true;
    searchContactShowing: boolean = false;
    AddContactShowing: boolean = false;
    thanks: boolean = false;
    SearchOrgShowing: boolean = false;
    AddOrgShowing: boolean = false;
    selectedFilter: any | undefined;

    AddCallShowing: boolean = false;

    showOrgSidebar: boolean = false;

    contactOrgName: string = '';

    faCircleXmark = faCircleXmark;
    sortIcon: string = '';

    valueSearchOrg!: string;

    pageSizeOptions = [5, 10, 20];
    pageSize = 5;
    currentPage = 1;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;

    pageSizeOptionOrgs = [5, 10, 20];
    pageSizeOrg = 5;
    currentPageOrg = 1;
    totalItemOrgs = 0;
    totalPageOrgs = 0;
    pagesToShowOrg = 3;

    sortIdOrg: string = 'createdAt';
    sortOrderOrg: string = 'DESC';
    checkedValueOrgs: string[] = [];

    sortId: string = 'createdAt';
    sortOrder: string = 'DESC';

    industryType: any[] = [];
    productTypes: any[] = [];

    orgName: string = '';
    orgIden: string = '';
    orgIndustryType: string = '';
    orgProductType: string = '';

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userId: any;
    userRole: string = '';

    roleCanAccessCUDForm: string[] = config.roleCanAccessCUDForm;

    constructor(
        private _location: Location,
        private contactsService: ContactsService,
        private sweetalertServices: SweetAlertService,
        private route: ActivatedRoute,
        private router: Router,
        private auditLogService: AuditLogService,
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
                const dataCallArray = this.calls.split(',');

                this.call_id = dataCallArray[0];
                this.caller_id = dataCallArray[1];

                this.contactNumber = this.call_id;

                this.contactsService.getContactsByParamPhone(this.call_id).subscribe((data: any) => {
                    if (data && data.length > 0) {
                        this.contact = data[0].contactNumber;
                        this.contactNumber = this.call_id;
                        this.getContactByPhoneId(this.contact);
                    } else {
                        console.log('Data does not exist');
                    }
                });
            }
        });

        this.selectedFilter = 'all';

        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
            console.log('user: ', this.userData.userId);
        }

        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
        this.getPageOrg();
    }

    checkRole(): boolean {
        return true;
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

                if (this.contactOrg != '' && this.contactOrg != null && this.contactOrg != undefined) {
                    this.contactsService.getOrganizationById(this.contactOrg).subscribe((res: any) => {
                        this.contactOrgName = res[0].orgName;
                        this.contactProductType = res[0].prodName;
                    });
                }
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
                call_id: this.call_id,
                caller_id: this.caller_id,
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
                            this.router.navigate(['/call/create-call'], {
                                queryParams: { contactId: this.contactId, caller_id: this.caller_id, call_id: this.call_id },
                            });
                        });
                        this.auditLogService.log('', 'Phone Contact', 'Edit Phone Contact', `Detail Phone Contact : ContactID : ${data.contactId}, call_id : ${data.call_id}, caller_id : ${data.caller_id}, Email : ${data.email}, Contact Number : ${data.contactNumber}, FirstName : ${data.firstName}, LastName : ${data.lastName}, Identification : ${data.identification} `, `Success`);
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log(
                            '',
                            'Phone Contact',
                            'Edit Phone Contact',
                            `Detail Phone Contact : ContactID : ${data.contactId}, call_id : ${data.call_id}, caller_id : ${data.caller_id}, Email : ${data.email}, Contact Number : ${data.contactNumber}, FirstName : ${data.firstName}, LastName : ${data.lastName}, Identification : ${data.identification} `,
                            `Failed, Error : ${error}`,
                        );
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

            console.log('data:', data);

            this.contactsService
                .createContacts(data)
                .pipe(
                    tap((res) => {
                        this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '/call/create-call');
                        this.auditLogService.log('', 'Phone Contact', 'Create Phone Contact', `Detail Phone Contact : Email : ${data.email}, Contact Number : ${data.contactNumber}, FirstName : ${data.firstName}, LastName : ${data.lastName}, Identification : ${data.identification}, Create By : ${data.createdById}`, `Success`);
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log(
                            '',
                            'Phone Contact',
                            'Create Phone Contact',
                            `Detail Phone Contact : Email : ${data.email}, Contact Number : ${data.contactNumber}, FirstName : ${data.firstName}, LastName : ${data.lastName}, Identification : ${data.identification}, Create By : ${data.createdById}`,
                            `Failed, Error : ${error}`,
                        );
                        throw error;
                    }),
                )
                .subscribe();
        }
    }

    showSideBarOrg() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.thanks = false;
        this.SearchOrgShowing = true;
        this.AddOrgShowing = false;
        this.AddCallShowing = false;
    }

    chooseOrg(orgId: string) {
        this.contactOrg = orgId;
        this.contactsService.getOrganizationById(orgId).subscribe((res: any) => {
            this.contactOrgName = res[0].orgName;
            this.contactProductType = res[0].prodName;
        });
    }

    async getFormOrg(pageOrg: number, pageSizeOrg: number) {
        await this.contactsService
            .getOrgByPage(pageOrg, pageSizeOrg, `${this.sortIdOrg},${this.sortOrderOrg}`, this.valueSearchOrg, this.selectedFilter)
            .subscribe((res: any) => {
                this.organizations = res;
                // this.spareorganizations = res;
            });
    }

    searchOrg() {
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
        this.getPageOrg();
    }

    sortOrg(value: string) {
        if (this.sortIdOrg == value) {
            if (this.sortIcon == 'fa-solid fa-sort-down') {
                this.sortIcon = 'fa-solid fa-sort-up';
                this.sortOrderOrg = 'DESC';
            } else {
                this.sortIcon = 'fa-solid fa-sort-down';
                this.sortOrderOrg = 'ASC';
            }
        } else {
            this.sortIdOrg = value;
        }
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
    }

    async pageChangeOrg(pageOrg: number) {
        if (pageOrg != this.currentPageOrg) {
            if (pageOrg >= 1 && pageOrg <= this.totalPageOrgs) {
                this.currentPageOrg = pageOrg;
                await this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
                this.checkedValueOrgs = [];
            }
        }
    }

    get pageOrgs(): number[] {
        var pageOrg: number[] = [];
        this.totalPageOrgs = Math.ceil(this.totalItemOrgs / this.pageSizeOrg);
        for (var i = -this.pagesToShowOrg; i <= this.pagesToShowOrg; i++) {
            if (this.currentPageOrg + i > 0 && this.currentPageOrg + i <= this.totalPageOrgs) {
                pageOrg.push(this.currentPageOrg + i);
            }
        }
        return pageOrg;
    }

    pageSizeChangeOrg() {
        this.currentPage = 1;
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
    }

    async getPageOrg() {
        await this.contactsService.countOrg(this.valueSearchOrg, this.userId).subscribe((res: any) => {
            this.totalItemOrgs = res.count;
        });
    }

    showAddOrg() {
        this.AddOrgShowing = true;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.thanks = false;
        this.SearchOrgShowing = false;
        this.AddCallShowing = false;
        this.contactsService.getAllIndustryType().subscribe((res: any) => {
            this.industryType = res;
        });

        this.contactsService.getAllProductTypes().subscribe((res: any) => {
            this.productTypes = res;
        });
    }

    submitOrg() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (this.orgName.length > 0) {
            const data = {
                name: this.orgName,
                identification: this.orgIden,
                industryTypeId: this.orgIndustryType,
                productTypeId: this.orgProductType,
                createdById: userData.userId,
            };

            this.contactsService
                .createOrg(data)
                .pipe(
                    tap((res) => {
                        this.showSideBarOrg();
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        throw error;
                    }),
                )
                .subscribe();
        } else {
            this.sweetalertServices.getSwal('error', 'organization name cannot be empty.', '', false, '');
        }
    }
}
