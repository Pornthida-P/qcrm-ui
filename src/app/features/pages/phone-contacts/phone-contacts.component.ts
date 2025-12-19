import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import { TranslateService } from '@ngx-translate/core';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoginService } from 'src/app/services/login/login.service';
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
    contactType: any;
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

    orgName: string = '';
    orgIden: string = '';

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userId: any;
    userRole: string = '';

    roleCanAccessCUDForm: string[] = config.roleCanAccessCUDForm;
    contactIdParams: any;

    constructor(
        private _location: Location,
        private contactsService: ContactsService,
        private sweetalertServices: SweetAlertService,
        private route: ActivatedRoute,
        private router: Router,
        private auditLogService: AuditLogService,
        private translate: TranslateService,
        private tokenService: TokenService,
        private userService: UserService,
        private loginService: LoginService,
    ) {
        this.contact = { components: [] };
    }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe(async (params) => {
            const ott = params.get('ott');

            if (ott && !this.tokenService.isTokenValid()) {
                const success = await this.crossLogin(ott);
                if (!success) {
                    this.router.navigate(['/login']);
                    return;
                }
            }

            const chatId = params.get('chatid') || '';
            const chatType = params.get('chattype') || '';
            const displayName = params.get('displayName') || '';
            const issue = params.get('issue') || '';

            this.calls = params.get('phone');

            const originalParams: any = {};
            params.keys.forEach((key: string) => {
                originalParams[key] = params.get(key);
            });

            if (this.contactId) {
                this.getContactByPhoneId(this.contactId);
                this.processParams(this.contactId, originalParams);
            } else if (chatId) {
                const identifier = chatId;

                if (displayName) {
                    const nameParts = displayName.split(' ');
                    this.contactFirstName = nameParts[0] || '';
                    this.contactLastName = nameParts.slice(1).join(' ') || '';
                }

                this.contactsService.getContactsByParamPhone(identifier).subscribe((data: any) => {
                    console.log('data: ', data);
                    if (data && data.length > 0) {
                        this.contact = data[0].contactNumber;
                        this.contactIdParams = data[0].contactId;

                        this.contactId = data[0].contactId;
                        this.contactFirstName = data[0].firstName || this.contactFirstName;
                        this.contactLastName = data[0].lastName || this.contactLastName;
                        this.contactNumber = data[0].contactNumber;
                        this.contactOrg = data[0].organization_id;
                        this.contactType = data[0].contactType;
                        this.contactProvince = data[0].province;

                        if (this.contactOrg != '' && this.contactOrg != null && this.contactOrg != undefined) {
                            this.contactsService.getOrganizationById(this.contactOrg).subscribe((res: any) => {
                                this.contactOrgName = res[0].orgName;
                            });
                        }

                        this.getContactByPhoneId(identifier);
                    } else {
                        console.log('Data does not exist');
                        this.contactIdParams = '';
                    }
                    this.processParams(this.contactIdParams, originalParams);
                });
            } else if (this.calls && this.calls !== 'null') {
                const dataCallArray = this.calls.split(',');

                this.call_id = dataCallArray[0];
                this.caller_id = dataCallArray[1];

                this.contactNumber = this.call_id;

                this.contactsService.getContactsByParamPhone(this.call_id).subscribe((data: any) => {
                    if (data && data.length > 0) {
                        this.contact = data[0].contactNumber;
                        this.contactNumber = this.call_id;
                        this.contactIdParams = data[0].contactId;
                        this.getContactByPhoneId(this.contact);
                    } else {
                        console.log('Data does not exist');
                        this.contactIdParams = '';
                    }
                    this.processParams(this.contactIdParams, originalParams);
                });
            } else {
                this.processParams('', originalParams);
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

    processParams(contactId?: string, originalParams?: any): void {
        const queryParams: any = {
            key: contactId || '',
        };

        if (this.call_id) {
            queryParams.call_id = this.call_id;
        }
        if (this.caller_id) {
            queryParams.caller_id = this.caller_id;
        }

        if (originalParams) {
            Object.keys(originalParams).forEach((key) => {
                if (originalParams[key] !== null && originalParams[key] !== undefined && originalParams[key] !== '') {
                    queryParams[key] = originalParams[key];
                }
            });
        }

        const navigationExtras: NavigationExtras = {
            queryParams: queryParams,
        };

        this.router.navigate(['/contacts/edit'], navigationExtras);
    }

    async getContactByPhoneId(contactId: string) {
        try {
            const res: any = await this.contactsService.getContactsByParamPhone(contactId).toPromise();

            if (res && res.length > 0) {
                const detailItemByPhone = res[0];
                this.contactId = detailItemByPhone.contactId;
                this.contactFirstName = detailItemByPhone.firstName;
                this.contactLastName = detailItemByPhone.lastName;
                this.contactOrg = detailItemByPhone.organization_id;
                this.contactType = detailItemByPhone.contactType;
                this.contactNumber = detailItemByPhone.contactNumber;
                this.contactProvince = detailItemByPhone.province;

                if (this.contactOrg != '' && this.contactOrg != null && this.contactOrg != undefined) {
                    this.contactsService.getOrganizationById(this.contactOrg).subscribe((res: any) => {
                        this.contactOrgName = res[0].orgName;
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
                organizationId: this.contactOrg,
                contactType: this.contactType,
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
                            title: this.translate.instant('alert.saveSuccess'),
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                        }).then(() => {
                            this.router.navigate(['/call/create-call'], {
                                queryParams: { contactId: this.contactId, caller_id: this.caller_id, call_id: this.call_id },
                            });
                        });
                        this.auditLogService.log(
                            '',
                            'Phone Contact',
                            '',
                            'Edit Phone Contact',
                            `Detail Phone Contact : ContactID : ${data.contactId}, call_id : ${data.call_id}, caller_id : ${data.caller_id}, Contact Number : ${data.contactNumber}, FirstName : ${data.firstName}, LastName : ${data.lastName} `,
                            `Success`,
                        );
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log(
                            '',
                            'Phone Contact',
                            '',
                            'Edit Phone Contact',
                            `Detail Phone Contact : ContactID : ${data.contactId}, call_id : ${data.call_id}, caller_id : ${data.caller_id}, Contact Number : ${data.contactNumber}, FirstName : ${data.firstName}, LastName : ${data.lastName} `,
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
                organizationId: this.contactOrg,
                contactType: this.contactType,
                contactNumber: this.contactNumber,
                province: this.contactProvince,
                createdById: userData.userId,
            };

            console.log('data:', data);

            this.contactsService
                .createContacts(data)
                .pipe(
                    tap((res) => {
                        this.sweetalertServices.success('alert.saveSuccess', '/call/create-call');
                        this.auditLogService.log(
                            '',
                            'Phone Contact',
                            '',
                            'Create Phone Contact',
                            `Detail Phone Contact : Contact Number : ${data.contactNumber},FirstName : ${data.firstName},LastName : ${data.lastName},Create By : ${data.createdById}`,
                            `Success`,
                        );
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log(
                            '',
                            'Phone Contact',
                            '',
                            'Create Phone Contact',
                            `Detail Phone Contact : Contact Number : ${data.contactNumber},FirstName : ${data.firstName},LastName : ${data.lastName},Create By : ${data.createdById}`,
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
    }

    submitOrg() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (this.orgName.length > 0) {
            const data = {
                name: this.orgName,
                identification: this.orgIden,
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
            this.sweetalertServices.error('alert.pleaseEnterOrgName');
        }
    }

    private async crossLogin(ott: string): Promise<boolean> {
        try {
            const response: any = await this.loginService.crossAuth(ott).toPromise();

            if (response && response.user && response.token) {
                this.userService.setDataUser(response.user);
                this.tokenService.setDataToken(response.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Cross-auth failed:', error);
            return false;
        }
    }
}
