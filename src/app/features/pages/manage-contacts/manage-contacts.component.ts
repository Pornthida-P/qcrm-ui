import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormioComponent } from '@formio/angular';
import { FormGroup, FormControl } from '@angular/forms';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { faArrowLeft, faArrowRight, faPenToSquare, faTrashCan, faCircleXmark, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { catchError, finalize, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { CallService } from 'src/app/services/call/call.service';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { Attachment } from 'src/app/shared/interface/attachment.interface';
import Swal from 'sweetalert2';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import * as moment from 'moment';
import { WebSocketSubject } from 'rxjs/webSocket';

@Component({
    selector: 'app-manage-contacts',
    templateUrl: './manage-contacts.component.html',
    styleUrls: ['./manage-contacts.component.scss'],
})
export class ManageContactsComponent implements OnInit {
    contactActivities: any[] = [];
    contactDrive: any;
    contactSurveyForm: any[] = [];
    contactCall: any[] = [];
    industryType: any[] = [];
    productTypes: any[] = [];
    contact: any = {};
    contactFirstName: string = '';
    contactLastName: string = '';
    contactIden: string = '';
    contactOrg: string = '';
    contactOrgName: string = '';
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
    FormShowing: boolean = false;
    SearchFormShowing: boolean = true;
    SearchOrgShowing: boolean = false;
    AddOrgShowing: boolean = false;
    AddCallShowing: boolean = false;
    submitButtonShowing: boolean = true;
    SearchButton: boolean = true;
    emptyItem: String = 'ว่าง';

    surveyForms!: any;
    spareSurveyForms!: any;
    selectedSurveyForms: any = [];
    valueSearch!: string;
    valueSearchOrg!: string;
    checkedValues: string[] = [];
    checkedValueOrgs: string[] = [];
    formData: any = {};

    selectedTopics: any;
    casetopics: any[] = [];
    casesubjects: any[] = [];
    selectedCasesubject: any;
    selectedCaseTopics: any[] = [];
    selectedChannels: any;
    channels: any;
    isEmailSubscribed: number = 0;
    activitiestype: any;
    solutions: string = '';
    description: string = '';
    combinedDateTimeStart: string = '';
    combinedDateTimeEnd: string = '';
    timepickStart: any;
    activityTypeId: any;
    newDateTime: any;
    startTime: string = '';
    myForm: FormGroup | any;

    timepickEnd = true;
    meridian = true;
    seconds = true;
    seconds1 = true;

    files: File[] = [];
    fileNames: any;
    attachments: Attachment[] = [];
    attachmentsId: string[] | undefined;

    organizations!: any;
    spareorganizations!: any;
    orgName: string = '';
    orgIden: string = '';
    orgIndustryType: string = '';
    orgProductType: string = '';

    formId: string = '';
    formName: string = '';
    surveyForm: any;
    survey: any;
    form: any;
    thanks: boolean = false;
    existing: boolean = false;

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

    faPenToSquare = faPenToSquare;
    faTrashCan = faTrashCan;
    faArrowRight = faArrowRight;
    faArrowLeft = faArrowLeft;
    faCircleXmark = faCircleXmark;
    faEye = faEye;
    faClipboard = faClipboard;

    visibleRightSideBar: boolean = true;
    visibleLeftSideBar: boolean = true;
    sortId: string = 'createdAt';
    sortOrder: string = 'DESC';
    sortIcon: string = '';

    sortIdOrg: string = 'createdAt';
    sortOrderOrg: string = 'DESC';

    filterOption!: any[];
    selectedFilter: any | undefined;
    selectedForm: any | undefined;
    readOnlyForm: boolean = false;

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userRole: string = '';
    roleCanAccessCUDForm: string[] = config.roleCanAccessCUDForm;

    calls: string | null | undefined;
    userId: string = '';

    private socket$!: WebSocketSubject<any>;
    urlSocket: string = '';
    message: string = '';
    results: string[] = [];
    connected: boolean = false;
    ws: any;
    dialCall: string = '';
    phoneCall: string = '';
    selectedContactNumber: string = '';
    contactNumbers: any;

    constructor(
        private _location: Location,
        private surveyFormService: SurveyFormService,
        private contactsService: ContactsService,
        private surveyService: SurveyService,
        private sweetalertServices: SweetAlertService,
        private activeRoute: ActivatedRoute,
        private route: ActivatedRoute,
        private router: Router,
        private auditLogService: AuditLogService,
        private attachmentService: AttachmentService,
        private callServive: CallService,
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

        this.route.queryParamMap.subscribe((params) => {
            this.calls = params.get('phone');

            if (this.calls) {
                this.contactsService.getContactsByParamPhone(this.calls).subscribe((data: any) => {
                    if (data) {
                        console.log('Data exists:', data);
                    } else {
                        console.log('Data does not exist');
                    }
                });
            }
        });

        if (this.contactId) {
            this.TableShowing = true;
            this.SearchButton = false;
        } else {
            this.TableShowing = false;
            this.SearchButton = true;
        }

        // this.activeRoute.queryParams.subscribe((params) => {
        //     if (params['cb'] != undefined && params['cb'] != '') {
        //         const cbArray = params['cb'].split(',').map(Number);
        //         this.pageSize = cbArray[0];
        //         this.currentPage = cbArray[1];
        //         this.totalItems = cbArray[2];
        //         this.totalPages = cbArray[3];
        //     }
        // });
        this.selectedFilter = 'all';
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        }
        this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
        this.getPageOrg();
        this.connect();
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
            if (this.contactIden != '' && this.contactIden != null && this.contactIden != undefined) {
                this.contactsService.getContactActivities(this.contactIden).subscribe((res: any) => {
                    this.contactActivities = res;
                });
            }

            if (this.contactOrg != '' && this.contactOrg != null && this.contactOrg != undefined) {
                this.contactsService.getOrganizationById(this.contactOrg).subscribe((res: any) => {
                    this.contactOrgName = res[0].orgName;
                    this.contactProductType = res[0].prodName;
                });
            }
        });

        await this.contactsService.getContactSurveyForm(contactId).subscribe((res: any) => {
            this.contactSurveyForm = res;
        });

        await this.contactsService.getContactCall(contactId).subscribe((res: any) => {
            this.contactCall = res;
        });

        await this.contactsService.getContactNumberById(contactId).subscribe((res: any) => {
            this.contactNumbers = res;
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
                        this.auditLogService.log('', 'Contact', 'Edit Contact', `ContactID : ${data.contactId}`, `Success`);
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log(
                            '',
                            'Contact',
                            'Edit Contact',
                            `ContactID : ${data.contactId}`,
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
                contactNumber: this.contactNum,
                province: this.contactProvince,
                createdById: userData.userId,
            };

            this.contactsService
                .createContacts(data)
                .pipe(
                    tap((res) => {
                        this.sweetalertServices.getSwal('success', 'Save data success.', '', false, '/contacts');
                        this.auditLogService.log(
                            '',
                            'Contact',
                            'Create Contact',
                            `Contact : ${data.firstName}, Email : ${data.email}`,
                            `Success`,
                        );
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log(
                            '',
                            'Contact',
                            'Create Contact',
                            `Contact : ${data.firstName}, Email : ${data.email}`,
                            `Failed, Error : ${error}`,
                        );
                        throw error;
                    }),
                )
                .subscribe();
        }
        // } else {
        //     this.sweetalertServices.getSwal('error', 'Contact name and contact component cannot be empty.', '', false, '');
        // }
    }

    showSideBar() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = false;
        this.SearchFormShowing = true;
        this.SearchOrgShowing = false;
        this.thanks = false;
        this.AddOrgShowing = false;
        this.AddCallShowing = false;
    }

    deleteSurvey(surveyId: string) {
        Swal.fire({
            icon: 'warning',
            title: 'Do you want to unassign this survey form?',
            showCancelButton: true,
            confirmButtonColor: '#3066be',
            cancelButtonColor: '#ec5365',
            width: '50%',
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    body: [surveyId],
                };
                this.contactsService
                    .deleteSurvey(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'Unassigned success.', '', false, '');
                            this.auditLogService.log('', 'Contact', 'Delete Survey', `Survey ID : ${surveyId}`, `Success`);
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log('', 'Contact', 'Delete Survey', `Survey ID : ${surveyId}`, `Failed, Error : ${error}`);
                            throw error;
                        }),
                    )
                    .subscribe();
            }
        });
    }

    search() {
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
    }

    async searchDrive() {
        if (this.contactIden != '' && this.contactIden != null && this.contactIden != undefined) {
            this.contactsService.getDriveContact(this.contactIden).subscribe(
                (res: any) => {
                    this.contactDrive = res;
                    this.contactFirstName = this.contactDrive.firstname_TH;
                    this.contactLastName = this.contactDrive.lastname_TH;
                    this.contactEmail = this.contactDrive.email;
                    this.contactNum = this.contactDrive.mobile;
                    this.contactProvince = this.contactDrive.province.name;
                },
                (error: any) => {
                    this.sweetalertServices.getSwal('warning', 'Warning', 'ไม่พบข้อมูลในระบบ Drive', false, '');
                },
            );
        }
    }

    async getPage() {
        await this.surveyFormService.countSurveyForm(this.valueSearch, this.userId).subscribe((res: any) => {
            this.totalItems = res.count;
        });
    }

    async getForm(page: number, pageSize: number) {
        await this.surveyFormService
            .getSurveyFormByPage(page, pageSize, `${this.sortId},${this.sortOrder}`, this.valueSearch, this.selectedFilter)
            .subscribe((res: any) => {
                this.surveyForms = res;
                this.spareSurveyForms = res;
            });
    }

    async pageChange(page: number) {
        if (page != this.currentPage) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                await this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
                this.checkedValues = [];
            }
        }
    }

    sort(value: string) {
        if (this.sortId == value) {
            if (this.sortIcon == 'fa-solid fa-sort-down') {
                this.sortIcon = 'fa-solid fa-sort-up';
                this.sortOrder = 'DESC';
            } else {
                this.sortIcon = 'fa-solid fa-sort-down';
                this.sortOrder = 'ASC';
            }
        } else {
            this.sortId = value;
        }
        this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    pageSizeChange() {
        this.currentPage = 1;
        this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
    }

    get pages(): number[] {
        var page: number[] = [];
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        for (var i = -this.pagesToShow; i <= this.pagesToShow; i++) {
            if (this.currentPage + i > 0 && this.currentPage + i <= this.totalPages) {
                page.push(this.currentPage + i);
            }
        }
        return page;
    }

    @ViewChild(FormioComponent, { static: false })
    formio!: FormioComponent;

    submitButton() {
        if (this.formio) {
            const isValid = this.formio.formio.checkValidity();
            this.formio.formio.emit('submitButton');
            if (!isValid) {
                this.sweetalertServices.getSwal('warning', 'Warning', 'Please fill all the required fields.', false, '');
            }
        }
    }

    onSubmit(submission: any, contactId: string, formId: string) {
        if (submission) {
            const submissionData = {
                data: submission.data,
            };
            if (submissionData.data) {
                const surveyData = {
                    surveyData: submissionData,
                    contactId: contactId,
                    surveyFormId: formId,
                    channel: '',
                    description: null,
                    createdBy: null,
                };
                this.surveyFormService.saveSurveyData(surveyData).subscribe((res: any) => {
                    if (res.success) {
                        this.sweetalertServices.getSwal('success', 'Success', 'Survey submitted successfully.', false, '');
                        this.auditLogService.log('', 'Contact', 'Save Survey', `Contact ID : ${contactId}, Form ID : ${formId}`, `Success`);
                        this.thanks = true;
                        location.reload();
                    } else {
                        this.sweetalertServices.getSwal('error', 'Error', res.message, false, '');
                        this.auditLogService.log(
                            '',
                            'Contact',
                            'Save Survey',
                            `Contact ID : ${contactId}, Form ID : ${formId}`,
                            `Failed, Error : ${res.message}`,
                        );
                    }
                });
            }
        }
    }

    getSurveyForm(formId: string, contactId: string) {
        this.surveyService.checkExisting(formId, contactId).subscribe((res: any) => {
            this.existing = res;
            this.FormShowing = true;
            this.SearchFormShowing = false;
            this.submitButtonShowing = true;
            this.SearchOrgShowing = false;
            this.readOnlyForm = false;
            this.AddOrgShowing = false;
            this.AddCallShowing = false;
            if (this.existing == false) {
                this.surveyFormService.getSurveyFormById(formId).subscribe((res) => {
                    this.surveyForm = res;
                    this.form = JSON.parse(this.surveyForm[0].form);
                    this.formName = this.surveyForm[0].name;
                    this.formId = this.surveyForm[0].surveyFormId;
                });
            }
        });
    }

    showFinishedForm(formId: string, surveyId: string) {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = true;
        this.SearchFormShowing = false;
        this.submitButtonShowing = false;
        this.SearchOrgShowing = false;
        this.thanks = false;
        this.readOnlyForm = true;
        this.AddOrgShowing = false;
        this.AddCallShowing = false;
        // Get the survey form by ID
        this.surveyFormService.getSurveyFormById(formId).subscribe((res) => {
            this.surveyForm = res;
            this.form = JSON.parse(this.surveyForm[0].form);
            this.formName = this.surveyForm[0].name;
            this.formId = this.surveyForm[0].surveyFormId;

            this.contactsService.getContactsSurvey(surveyId).subscribe((res) => {
                this.survey = res;
                this.formData = JSON.parse(this.survey[0].surveyData);

                console.log(this.formData);
            });
        });
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

    searchOrg() {
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        } else {
            this.userId = '';
        }
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
        this.getPageOrg();
    }

    async getPageOrg() {
        await this.contactsService.countOrg(this.valueSearchOrg, this.userId).subscribe((res: any) => {
            this.totalItemOrgs = res.count;
        });
    }

    async getFormOrg(pageOrg: number, pageSizeOrg: number) {
        await this.contactsService
            .getOrgByPage(pageOrg, pageSizeOrg, `${this.sortIdOrg},${this.sortOrderOrg}`, this.valueSearchOrg, this.selectedFilter)
            .subscribe((res: any) => {
                this.organizations = res;
                this.spareorganizations = res;
            });
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

    pageSizeChangeOrg() {
        this.currentPage = 1;
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
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

    chooseOrg(orgId: string) {
        this.contactOrg = orgId;
        this.contactsService.getOrganizationById(orgId).subscribe((res: any) => {
            this.contactOrgName = res[0].orgName;
            this.contactProductType = res[0].prodName;
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

    formatTimepickStart() {
        const startTimepick = new Date(this.timepickStart);
        const formatTimepickStart = startTimepick.toISOString();
        this.combinedDateTimeStart = formatTimepickStart;
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    onTimepickStartChange(event: any) {
        if (event) {
            const hour = event.hour;
            const minute = event.minute;
            const second = event.second;

            const formattedTimeStartPick = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
                .toString()
                .padStart(2, '0')}`;

            this.newDateTime = `${this.formatDate(new Date(this.startTime))} ${formattedTimeStartPick}`;
            console.log('New combined date and time: ', this.newDateTime);
        }
    }

    toggleEmailSubscription(event: any) {
        this.isEmailSubscribed = event.target.checked ? 1 : 0;
        console.log('email:', this.isEmailSubscribed);
    }

    onCheckboxChange(event: any, activityTypeId: number) {
        if (event.target.checked) {
            this.activityTypeId = activityTypeId;
        }
    }

    showAddCall() {
        this.AddOrgShowing = false;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.thanks = false;
        this.SearchOrgShowing = false;
        this.AddCallShowing = true;

        this.callServive.getCaseTopic().subscribe((casetopics: any) => {
            this.casetopics = casetopics;
        });

        this.callServive.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestype = activitiestype;
        });

        this.callServive.getAllCaseSubjects().subscribe((casesubjects: any) => {
            this.casesubjects = casesubjects;
        });

        this.callServive.getAllChannels().subscribe((channels: any) => {
            this.channels = channels;
        });
    }

    onFileSelected(event: any) {
        const files = event.target.files;
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filename = file.name;

            this.attachmentService
                .upload(file, filename, createdAt, this.userData?.userId || '')
                .pipe(
                    tap((response: any) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'อัพโหลดข้อมูลเรียบร้อยแล้ว',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        }).then(() => {});
                        this.attachments.push(response);
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        throw error;
                    }),
                )
                .subscribe(() => {});
        }
    }

    submitCall() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.attachmentsId = this.attachments.map((attachment) => attachment.attachmentId.toString());
        console.log('Id File: ', this.attachmentsId);
        if (this.selectedCaseTopics.length > 0) {
            const data = {
                contactId: this.contactId,
                name: userData.userId,
                organization: this.contactOrg,
                caseTopicId: this.selectedCaseTopics,
                caseSubject: this.selectedCasesubject,
                channel: this.selectedChannels,
                emailInfo: this.isEmailSubscribed ? 1 : null,
                activityType: this.activityTypeId,
                description: this.description,
                startTime: this.newDateTime,
                solution: this.solutions,
                createdById: userData.userId,
                attachment: this.attachmentsId,
            };
            console.log('Data: ', data);
            this.callServive
                .createCalls(data)
                .pipe(
                    tap((res) => {
                        this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '');
                        window.location.reload();
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        throw error;
                    }),
                )
                .subscribe();
        } else {
            this.sweetalertServices.getSwal('error', 'โปรดกรอกหัวข้อที่ติดต่อ', '', false, '');
        }
    }

    // connect(): void {
    //     this.dialCall = 'dial|9' + this.phoneCall;
    //     this.connected = true;
    //     const url = config.urlWebSocket.urlQAgent;
    //     this.socket$ = new WebSocketSubject({
    //         url: url,
    //         deserializer: (event) => {
    //             try {
    //                 return event.data;
    //             } catch (error) {
    //                 console.error('WebSocket message error:', error);
    //                 throw error;
    //             }
    //         },
    //     });
    //     console.log('url:' + url);

    //     this.socket$
    //     .pipe(
    //         tap(() => {
    //             this.results.push('CONNECTED');
    //             this.connected = true;
    //             this.socket$.next(this.dialCall);
    //         }),
    //         catchError((error) => {
    //             console.error('WebSocket connection error:', error);
    //             this.results.push('WebSocket connection error: ' + error);
    //             this.connected = false;
    //             return [];
    //         }),
    //         finalize(() => {
    //             console.log('WebSocket connection closed');
    //             this.results.push('WebSocket connection closed');
    //             this.connected = false;
    //         })
    //     )
    //     .subscribe(
    //         () => {},
    //         (error) => {
    //             console.error('Unexpected WebSocket error:', error);
    //             this.results.push('Unexpected WebSocket error: ' + error);
    //             this.connected = false;
    //         }
    //     );

    //     console.log('Phone Call: ', this.phoneCall);
    //     console.log('Type of this.dialCall:', typeof this.dialCall, this.dialCall);
    //   }

    connect(): void {
        console.log('connect');
        const url = config.urlWebSocket.urlQAgent;
        this.socket$ = new WebSocketSubject({
            url: url,
            deserializer: (event) => {
                try {
                    return event.data;
                } catch (error) {
                    console.error('WebSocket message error:', error);
                    throw error;
                }
            },
        });
        console.log('url:' + url);

        this.socket$
            .pipe(
                tap(() => {
                    this.results.push('CONNECTED');
                    this.connected = true;
                }),
                catchError((error) => {
                    console.error('WebSocket connection error:', error);
                    this.results.push('WebSocket connection error: ' + error);
                    this.connected = false;
                    return [];
                }),
                finalize(() => {
                    console.log('WebSocket connection closed');
                    this.results.push('WebSocket connection closed');
                    this.connected = false;
                    if (this.socket$) {
                        this.socket$.unsubscribe();
                    }
                }),
            )
            .subscribe(
                () => {},
                (error) => {
                    console.error('Unexpected WebSocket error:', error);
                    this.results.push('Unexpected WebSocket error: ' + error);
                    this.connected = false;
                },
            );
    }

    sendMessage(): void {
        console.log('send');
        this.dialCall = 'dial|9' + this.phoneCall;
        if (this.socket$ && this.connected) {
            this.socket$.next(this.dialCall);
            this.results.push(this.dialCall);
            console.log('dialCall: ' + this.dialCall);
        } else {
            this.connect();
            console.error('WebSocket is not connected.');
        }
    }

    disconnect(): void {
        this.connected = false;

        if (this.socket$) {
            console.log('hangup');
            this.socket$.next('hangup');
            this.socket$.unsubscribe();
            this.connected = false;
        }
    }
}
