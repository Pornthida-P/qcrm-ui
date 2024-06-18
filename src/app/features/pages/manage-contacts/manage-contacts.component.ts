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
    MultiNumber: boolean = false;
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
    contactNum2: string = '';
    contactProvince: string = '';
    contactProductType: string = '';
    contactSource: string = '';
    contactCreatedByID: string = '';
    contactCreatedAt: string = '';
    contactModifiedByID: string = '';
    contactModifiedAt: string = '';
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

    cType: string = '';
    callId: string = '';
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
    timepickStart: { hour: number; minute: number; second: number } = { hour: 0, minute: 0, second: 0 };
    activityTypeId: any;
    newDateTime: any;
    startTime: string = '';
    myForm: FormGroup | any;

    numberArray = [1, 2, 3, 4, 5];
    selectSubject = 1;

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

    selectedCallTypeId: string = '';
    inbound: string = 'Inbound';
    outbound: string = 'Outbound';
    operationType: any;
    callTypes: any;
    caller_id: string = '';

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

    isCheckboxSelected: { [key: number]: boolean } = {};

    inputActivity: string = '';
    inputActivity_2: string = '';

    selectedActivityTopicIdSmn: string[] = [];
    selectedActivitiesSmn: any;

    selectedActivities: any;

    showActivitySeminarSideBar: boolean = false;
    showActivityElearningSideBar: boolean = false;

    SearchSmnShowing: boolean = false;
    attachmentShowing: boolean = false;
    valueSearchSmn!: string;

    nameActivityTopic: string = '';

    selectedActivityTopicName: any;

    activitiestypeTopic: any;

    sortIdSmn: string = 'createdAt';
    sortOrderSmn: string = 'DESC';
    checkedValueSmns: string[] = [];
    AddSmnShowing: boolean = false;

    activitySmn: any;
    activityEln: any;

    SearchElearningShowing: boolean = false;
    valueSearchEln!: string;
    activitiestypeEln: any;

    sortIdEln: string = 'createdAt';
    sortOrderEln: string = 'DESC';
    checkedValueEln: string[] = [];
    AddElnShowing: boolean = false;

    selectedActivityTopicId: string[] = [];
    searchContactShowing: boolean = false;

    AddContactShowing: boolean = false;

    showOrgSidebar: boolean = false;

    showContactSidebar: boolean = false;

    activityTypeById: any;
    activitiesTopic: any;
    selectedActivitiesElearning: any;
    selectedCheckboxIds: any;
    contactNumParams: any;

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
        this.startTime = this.formatDate(new Date());
    }

    ngOnInit(): void {
        const state = history.state;
        if (state.itemId) {
            this.contactId = state.itemId;
            this.state = state.state;
        } else {
            this.route.queryParams.subscribe((params) => {
                this.contactId = params['key'];
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

        this.selectedFilter = 'all';
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        }
        this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
        this.getFormOrg((this.currentPageOrg - 1) * this.pageSizeOrg, this.pageSizeOrg);
        this.getPageOrg();
        this.connect();

        const now = new Date();
        this.timepickStart = { hour: now.getHours(), minute: now.getMinutes(), second: now.getSeconds() };

        this.callTypes = [
            { id: '1', name: this.inbound },
            { id: '2', name: this.outbound },
        ];

        this.route.queryParams.subscribe((params: any) => {
            if (!params['caller_id']) {
                this.selectedCallTypeId = this.outbound;
            } else {
                this.selectedCallTypeId = this.inbound;
            }
            this.caller_id = params['caller_id'];
            this.contactNum = params['call_id'];
            this.contactNumParams = params['call_id'];
        });
        console.log('contactNumParams: ', this.contactNumParams)
        localStorage.setItem("contactNum", this.contactNum);
    }

    checkRole(): boolean {
        return true;
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
            this.contactCreatedByID = this.detailItem.create_by;
            this.contactCreatedAt = this.detailItem.created_at;
            this.contactModifiedByID = this.detailItem.modified_by;
            this.contactModifiedAt = this.detailItem.modified_at;
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
        this.router.navigate(['/contacts']);
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
                contactNumber2: this.contactNum2,
                province: this.contactProvince,
                modifiedById: userData.userId,
            };

            this.contactsService
                .editContacts(data)
                .pipe(
                    tap((res) => {
                        this.sweetalertServices.getSwal('success', 'Save data success.', '', false, '/contacts');
                        this.auditLogService.log('', 'Contact', 'Edit Contact', JSON.stringify(data), 'Success');
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log('', 'Contact', 'Edit Contact', JSON.stringify(data), `Failed, Error : ${error}`);
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
                contactNumber2: this.contactNum2,
            };

            this.contactsService
                .createContacts(data)
                .pipe(
                    tap((res: any) => {
                      if (res.success === true) {
                          console.log('phone: ', res.contactNumber)
                        const contactId = res.contactId;
                        const contactNumber = res.contactNumber;
                            this.router.navigate(['/contacts/edit'], { queryParams: { key: contactId, call_id: contactNumber} });
                            this.auditLogService.log('', 'Contact', 'Create Contact', JSON.stringify(data), `Success`);
                        } else if (res.success === false && res.message === 'Duplicate' && this.MultiNumber === false) {
                            if (res.duplicates.length > 0) {
                                const duplicatedFields = res.duplicates.map((dup: any) => dup.duplicateOn).join(' และ ');
                                this.sweetalertServices.contactSwal('error', `${duplicatedFields}นี้ได้มีการลงทะเบียนแล้ว`, res.duplicates);
                                return;
                            }
                            this.auditLogService.log(
                                '',
                                'Contact',
                                'Create Contact',
                                JSON.stringify(data),
                                `Failed, Error Duplicate: ${res.duplicates}`,
                            );
                        } else if (res.success === false && res.message === 'Duplicate' && this.MultiNumber === true) {
                            this.contactsService
                                .editContacts2(data)
                                .pipe(
                                    tap((res: any) => {
                                      const contactId = res.contactId;
                                      const contactNumber = res.contactNumber;
                                      console.log('contactNumber: ', contactNumber)
                                        this.router.navigate(['/contacts/edit'], { queryParams: { key: contactId, call_id: contactNumber } });
                                        this.auditLogService.log('', 'Contact', 'Edit Contact', JSON.stringify(data), 'Success');
                                    }),
                                    catchError((error) => {
                                        this.sweetalertServices.handleError(error);
                                        this.auditLogService.log(
                                            '',
                                            'Contact',
                                            'Edit Contact',
                                            JSON.stringify(data),
                                            `Failed, Error : ${error}`,
                                        );
                                        throw error;
                                    }),
                                )
                                .subscribe();
                        }
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log('', 'Contact', 'Create Contact', JSON.stringify(data), `Failed, Error : ${error}`);
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
                            this.auditLogService.log(
                                '',
                                'Contact',
                                `Delete Survey From ContactID : ${this.contactId}`,
                                `Survey ID : ${surveyId}`,
                                `Success`,
                            );
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact',
                                `Delete Survey From ContactID : ${this.contactId}`,
                                `Survey ID : ${surveyId}`,
                                `Failed, Error : ${error}`,
                            );
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
                    if (this.contactNum == '' || this.contactNum == null || this.contactNum == undefined) {
                        this.contactFirstName = this.contactDrive.firstname_TH;
                        this.contactLastName = this.contactDrive.lastname_TH;
                        this.contactEmail = this.contactDrive.email;
                        this.contactNum = this.contactDrive.mobile;
                        this.contactProvince = this.contactDrive.province.name;
                    } else {
                        if (this.contactDrive.mobile != this.contactNum) {
                            const contactNo = this.contactNum;
                            this.contactFirstName = this.contactDrive.firstname_TH;
                            this.contactLastName = this.contactDrive.lastname_TH;
                            this.contactEmail = this.contactDrive.email;
                            this.contactNum = this.contactDrive.mobile;
                            this.contactProvince = this.contactDrive.province.name;
                            this.contactNum2 = contactNo;
                            this.MultiNumber = true;
                        }
                    }
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
                        this.auditLogService.log('', 'Contact', 'Save Survey', JSON.stringify(surveyData), `Success`);
                        this.thanks = true;
                        location.reload();
                    } else {
                        this.sweetalertServices.getSwal('error', 'Error', res.message, false, '');
                        this.auditLogService.log(
                            '',
                            'Contact',
                            'Save Survey',
                            JSON.stringify(surveyData),
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
                        this.auditLogService.log('', 'Contact', 'Contact Create Organization', JSON.stringify(data), `Success`);
                    }),
                    catchError((error) => {
                        this.sweetalertServices.handleError(error);
                        this.auditLogService.log(
                            '',
                            'Contact',
                            'Contact Create Organization',
                            JSON.stringify(data),
                            `Failed, Error : ${error}`,
                        );
                        throw error;
                    }),
                )
                .subscribe();
        } else {
            this.sweetalertServices.getSwal('error', 'organization name cannot be empty.', '', false, '');
        }
    }

    formatTimepickStart() {
        const startTimepick = new Date();
        startTimepick.setHours(this.timepickStart.hour);
        startTimepick.setMinutes(this.timepickStart.minute);
        startTimepick.setSeconds(this.timepickStart.second);
        const formatTimepickStart = startTimepick.toISOString();
        this.combinedDateTimeStart = formatTimepickStart;

        const hour = startTimepick.getHours();
        const minute = startTimepick.getMinutes();
        const second = startTimepick.getSeconds();

        const formattedTimeStartPick = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
            .toString()
            .padStart(2, '0')}`;

        this.newDateTime = `${this.formatDate(new Date())} ${formattedTimeStartPick}`;
    }

    formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    formatTime(time: any): string {
        const hour = time.hour;
        const minute = time.minute;
        const second = time.second;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }

    onTimepickStartChange(event: any) {
        if (event) {
            const hour = event.hour;
            const minute = event.minute;
            const second = event.second;

            const formattedTimeStartPick = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
                .toString()
                .padStart(2, '0')}`;

            this.newDateTime = `${this.formatDate(new Date())} ${formattedTimeStartPick}`;
        } else {
            this.newDateTime = this.formatDate(new Date());
        }
    }

    toggleEmailSubscription(event: any) {
        this.isEmailSubscribed = event.target.checked ? 1 : 0;
        console.log('email:', this.isEmailSubscribed);
    }

    onCheckboxChange(event: any, activityTypeId: number) {
        this.isCheckboxSelected[activityTypeId] = event.target.checked;
    }

    showAddCall() {
        this.AddOrgShowing = false;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.thanks = false;
        this.SearchOrgShowing = false;
        this.AddCallShowing = true;
        this.showActivitySeminarSideBar = false;
        this.showActivityElearningSideBar = false;

        this.callServive.getCaseTopic().subscribe((casetopics: any) => {
            this.casetopics = casetopics;
        });

        this.callServive.getAllCaseSubjects().subscribe((casesubjects: any) => {
            this.casesubjects = casesubjects;
        });

        this.callServive.getAllChannels().subscribe((channels: any) => {
            this.channels = channels;
        });

        this.callServive.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestype = activitiestype.filter((activityType: any) => [1, 43].includes(parseInt(activityType.activityTypeId)));
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

    createCall() {
        this.attachmentShowing = true;
        this.cType = '';
        this.callId = '';
        // this.selectedCasesubject = [];
        this.selectedChannels = '';
        this.isEmailSubscribed = 0;
        this.activityTypeId = '';
        const date = new Date();
        this.startTime = date.toISOString().split('T')[0];
        this.description = '';
        this.solutions = '';
        this.selectedCallTypeId = '';
        this.timepickStart = {
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
        };
        this.selectedCaseTopics = [];
        this.selectedCasesubject = [];
        this.selectedActivityTopicIdSmn = [];
        this.selectedActivitiesSmn = [];
        this.selectedActivityTopicId = [];
        this.callServive.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
            this.activitySmn = activitySmn;
            this.saveSelectedActivitiesSmn();
        });
        this.callServive.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
            this.activityEln = activityEln;
            this.saveSelectedActivities();
        });
        this.showAddCall();
    }

    editCall(callId: string, type: string) {
        this.attachmentShowing = false;
        console.log('Edit Call:', callId);
        console.log('Type:', type);
        this.cType = '';
        this.callId = '';
        // this.selectedCasesubject = [];
        this.selectedChannels = '';
        this.isEmailSubscribed = 0;
        this.activityTypeId = '';
        this.startTime = '';
        this.description = '';
        this.solutions = '';
        this.selectedCallTypeId = '';
        const date = new Date('');
        this.timepickStart = {
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
        };
        this.selectedCaseTopics = [];
        this.selectedCasesubject = [];
        this.selectedActivityTopicIdSmn = [];
        this.selectedActivitiesSmn = [];
        this.selectedActivityTopicId = [];
        this.callServive.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
            this.activitySmn = activitySmn;
            this.saveSelectedActivitiesSmn();
        });
        this.callServive.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
            this.activityEln = activityEln;
            this.saveSelectedActivities();
        });

        if (type === 'call') {
            this.callServive.getCallById(callId).subscribe((call: any) => {
                console.log('Call:', call);
                this.cType = 'call';
                this.callId = call[0].callId;
                // this.selectedCasesubject = call[0].caseSubject;
                this.selectedChannels = call[0].channel;
                this.isEmailSubscribed = call[0].emailInfo;
                this.activityTypeId = call[0].activityType;
                this.startTime = call[0].startTime;
                this.description = call[0].description;
                this.solutions = call[0].solution;
                this.selectedCallTypeId = call[0].operationType;
                const date = new Date(call[0].startTime);
                this.timepickStart = {
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                    second: date.getSeconds(),
                };

                // Handle caseTopicIds
                if (call[0].caseTopicId && call[0].caseTopicId !== 'null') {
                    let caseTopicIds = call[0].caseTopicId;
                    if (!Array.isArray(caseTopicIds)) {
                        caseTopicIds = JSON.parse(caseTopicIds);
                    }
                    this.selectSubject = caseTopicIds.length;
                    for (let i = 0; i < this.selectSubject; i++) {
                        if (caseTopicIds[i].length != 0) {
                            this.selectedCaseTopics[i] = caseTopicIds[i].map(String);
                        } else {
                            this.selectedCaseTopics[i] = [];
                        }
                    }
                }

                // Handle caseSubjects
                if (call[0].caseSubject && call[0].caseSubject !== 'null') {
                    let caseSubjects = call[0].caseSubject;
                    if (!Array.isArray(caseSubjects)) {
                        caseSubjects = JSON.parse(caseSubjects);
                    }
                    for (let i = 0; i < this.selectSubject; i++) {
                        if (this.selectedCaseTopics[i].length != 0) {
                            this.selectedCasesubject[i] = caseSubjects[i].map(String);
                        } else {
                            this.selectedCaseTopics[i] = [];
                        }
                    }
                }

                // Handle selectedActivityTopicIdSmnr
                if (call[0].activitySmn && call[0].activitySmn !== 'null') {
                    let selectedActivityTopicIdSmnr = call[0].activitySmn;
                    if (!Array.isArray(selectedActivityTopicIdSmnr)) {
                        selectedActivityTopicIdSmnr = JSON.parse(selectedActivityTopicIdSmnr);
                    }
                    this.selectedActivityTopicIdSmn = selectedActivityTopicIdSmnr.map(String);

                    this.callServive.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
                        this.activitySmn = activitySmn;
                        this.saveSelectedActivitiesSmn();
                    });
                }

                // Handle selectedActivitiesEl
                if (call[0].activityEln && call[0].activityEln !== 'null') {
                    let selectedActivityTopicIds = call[0].activityEln;
                    if (!Array.isArray(selectedActivityTopicIds)) {
                        selectedActivityTopicIds = JSON.parse(selectedActivityTopicIds);
                    }
                    this.selectedActivityTopicId = selectedActivityTopicIds.map(String);
                    // Fetch and filter activitiestypeTopic
                    this.callServive.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
                        this.activityEln = activityEln;
                        this.saveSelectedActivities();
                    });
                }
            });
        } else if (type === 'case') {
            this.callServive.getCaseById(callId).subscribe((call: any) => {
                this.selectSubject = 1;
                console.log('Case:', call);
                this.cType = 'case';
                this.callId = call.caseId;
                this.description = call.description;
                this.startTime = call.requestDateTime;
                const date = new Date(call.requestDateTime);
                this.timepickStart = {
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                    second: date.getSeconds(),
                };
                this.selectedChannels = call.channelId;
                this.selectedCallTypeId = call.operationType;

                if (call.caseTopicIds && call.caseTopicIds !== 'null') {
                    let caseTopicIds = call.caseTopicIds;
                    if (!Array.isArray(caseTopicIds)) {
                        caseTopicIds = JSON.parse(caseTopicIds);
                    }
                    this.selectedCaseTopics[0] = caseTopicIds.map(String);
                }

                if (call.caseSubjectIds && call.caseSubjectIds !== 'null') {
                    let caseSubjects = call.caseSubjectIds;
                    if (!Array.isArray(caseSubjects)) {
                        caseSubjects = JSON.parse(caseSubjects);
                    }
                    this.selectedCasesubject[0] = caseSubjects.map(String);
                }

                if (call.activitySmn && call.activitySmn !== 'null') {
                    let selectedActivityTopicIdSmnr = call.activitySmn;
                    if (!Array.isArray(selectedActivityTopicIdSmnr)) {
                        selectedActivityTopicIdSmnr = JSON.parse(selectedActivityTopicIdSmnr);
                    }
                    this.selectedActivityTopicIdSmn = selectedActivityTopicIdSmnr.map(String);

                    this.callServive.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
                        this.activitySmn = activitySmn;
                        this.saveSelectedActivitiesSmn();
                    });
                }

                // Handle selectedActivitiesEl
                if (call.activityEln && call.activityEln !== 'null') {
                    let selectedActivityTopicIds = call.activityEln;
                    if (!Array.isArray(selectedActivityTopicIds)) {
                        selectedActivityTopicIds = JSON.parse(selectedActivityTopicIds);
                    }
                    this.selectedActivityTopicId = selectedActivityTopicIds.map(String);
                    // Fetch and filter activitiestypeTopic
                    this.callServive.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
                        this.activityEln = activityEln;
                        this.saveSelectedActivities();
                    });
                }
            });
        }

        // Fetch activitySmn
        this.callServive.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
            this.activitySmn = activitySmn;
        });

        this.callServive.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
            this.activityEln = activityEln;
        });

        this.showAddCall();
    }

    deleteCall(callId: string, type: string) {
        console.log('Delete Call:', callId);
        console.log('Type:', type);
    }

    submitCall() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.attachmentsId = this.attachments.map((attachment) => attachment.attachmentId.toString());
        const selectedDate = this.startTime ? this.formatDate(new Date(this.startTime)) : this.formatDate(new Date());
        const selectedTime = this.timepickStart ? this.formatTime(this.timepickStart) : this.formatTime(new Date());

        const isChannelOne = this.selectedChannels === '1';
        const selectedCallTypeId = isChannelOne ? this.selectedCallTypeId : null;

        const selectedActivitiesSmnIds = this.selectedActivitiesSmn
            ? this.selectedActivitiesSmn.map((activity: { activityTopicId: any }) => activity.activityTopicId)
            : null;
        const selectedActivitiesElnIds = this.selectedActivities
            ? this.selectedActivities.map((activity: { activityTopicId: any }) => activity.activityTopicId)
            : null;

        if (this.cType === 'call') {
            for (let i = 0; i < this.selectSubject; i++) {
                if (this.selectedCaseTopics[i] == null) {
                    this.selectedCaseTopics[i] = [];
                    this.selectedCasesubject[i] = [];
                } else {
                    if (this.selectedCasesubject[i] == null) {
                        this.selectedCasesubject[i] = [];
                    }
                }
            }
            if (this.selectedCaseTopics.length > this.selectSubject) {
                this.selectedCasesubject = this.selectedCasesubject.slice(0, this.selectSubject);
                this.selectedCaseTopics = this.selectedCaseTopics.slice(0, this.selectSubject);
            }
        }

      if (!this.callId) {

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
                    startTime: `${selectedDate} ${selectedTime}`,
                    solution: this.solutions,
                    createdById: userData.userId,
                    attachment: this.attachmentsId,
                    call_id: this.contactNumParams,
                    caller_id: this.caller_id,
                    operationType: selectedCallTypeId,
                    activitySmn: selectedActivitiesSmnIds,
                    activityEln: selectedActivitiesElnIds,
                };
                console.log('Data: ', data);
                this.callServive
                    .createCalls(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '');
                            this.auditLogService.log(
                                '',
                                'Contact Create Call',
                                'Contact Create Case Call',
                                JSON.stringify(data),
                                `Success`,
                            );
                            // window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact Create Call',
                                'Contact Create Case Call',
                                JSON.stringify(data),
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                this.sweetalertServices.getSwal('error', 'โปรดกรอกหัวข้อที่ติดต่อ', '', false, '');
            }
        } else if (this.callId && this.cType === 'call') {
            console.log('Edit Call:', this.callId);
            if (this.selectedCaseTopics.length > 0) {
                const data = {
                    callId: this.callId,
                    caseTopicId: this.selectedCaseTopics,
                    caseSubject: this.selectedCasesubject,
                    channel: this.selectedChannels,
                    emailInfo: this.isEmailSubscribed ? 1 : null,
                    activityType: this.activityTypeId,
                    description: this.description,
                    startTime: `${selectedDate} ${selectedTime}`,
                    solution: this.solutions,
                    modifiedById: userData.userId,
                    operationType: selectedCallTypeId,
                    activitySmn: selectedActivitiesSmnIds,
                    activityEln: selectedActivitiesElnIds,
                };
                console.log('Data: ', data);
                this.contactsService
                    .updateCalls(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '');
                            this.auditLogService.log(
                                '',
                                'Contact Update Call',
                                'Contact Update Case Call',
                                JSON.stringify(data),
                                `Success`,
                            );
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact Update Call',
                                'Contact Update Case Call',
                                JSON.stringify(data),
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                this.sweetalertServices.getSwal('error', 'โปรดกรอกหัวข้อที่ติดต่อ', '', false, '');
            }
        } else if (this.callId && this.cType === 'case') {
            console.log('Edit Case:', this.callId);
            if (this.selectedCaseTopics.length > 0) {
                const data = {
                    callId: this.callId,
                    caseTopicId: this.selectedCaseTopics[0],
                    caseSubject: this.selectedCasesubject[0],
                    channel: this.selectedChannels,
                    description: this.description,
                    startTime: `${selectedDate} ${selectedTime}`,
                    modifiedById: userData.userId,
                    operationType: selectedCallTypeId,
                    activitySmn: selectedActivitiesSmnIds,
                    activityEln: selectedActivitiesElnIds,
                };
                console.log('Data: ', data);
                this.contactsService
                    .updateCase(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '');
                            this.auditLogService.log('', 'Contact Update Case', 'Contact Update Case ', JSON.stringify(data), `Success`);
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact Update Case',
                                'Contact Update Case',
                                JSON.stringify(data),
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                this.sweetalertServices.getSwal('error', 'โปรดกรอกหัวข้อที่ติดต่อ', '', false, '');
            }
        }
    }

    connect(): void {
        console.log('connect');
        const url = config.urlWebSocket.urlQAgent;
        this.socket$ = new WebSocketSubject({
            url: url,
            serializer: (value) => {
                try {
                    console.log('Serializing message:', value);
                    return value;
                } catch (error) {
                    console.error('WebSocket message error:', error);
                    throw error;
                }
            },
            deserializer: (event) => {
                try {
                    console.log('Deserializing message:', event.data);
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
        const cleanedPhoneCall = this.phoneCall.trim().replace(/"/g, '');
        const messageToSend = `dial|7${cleanedPhoneCall}`;

        if (this.socket$) {
            if (this.socket$.closed) {
                this.connect();
            } else {
                if (messageToSend.trim() !== '') {
                    this.socket$.next(messageToSend);
                    this.results.push(messageToSend);
                    console.log(messageToSend);
                } else {
                    console.error('Empty message cannot be sent.');
                }
            }
        } else {
            console.error('WebSocket is not initialized.');
        }

        console.log('results: ', this.results);
        console.log('results: ', this.results[1]);
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

    async showSideBarActivitySeminar() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.searchContactShowing = false;
        this.SearchOrgShowing = false;
        this.SearchSmnShowing = true;
        this.thanks = false;
        this.AddContactShowing = false;
        this.showOrgSidebar = false;
        this.showContactSidebar = false;
        this.showActivitySeminarSideBar = true;
        this.showActivityElearningSideBar = false;
        this.AddCallShowing = false;

        this.callServive.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestypeTopic = activitiestype.filter((activityType: any) =>
                [21, 27, 28].includes(parseInt(activityType.activityTypeId)),
            );
        });

        this.callServive.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
            this.activitySmn = activitySmn;
        });
    }

    inputActivityElearning(event: any) {
        console.log(event.target.value);
    }

    async showSideBarActivityElearning() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = false;
        this.SearchFormShowing = false;
        this.SearchElearningShowing = true;
        this.thanks = false;
        this.AddContactShowing = false;
        this.showOrgSidebar = false;
        this.showContactSidebar = false;
        this.showActivitySeminarSideBar = false;
        this.showActivityElearningSideBar = true;
        this.AddCallShowing = false;

        this.callServive.getActivitiesType().subscribe((activitiestype: any) => {
            this.activitiestypeEln = activitiestype.filter((activityType: any) => [43].includes(parseInt(activityType.activityTypeId)));
        });

        this.callServive.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
            this.activityEln = activityEln;
        });
    }

    searchSmn(): void {
        this.callServive.getActivitiesTypeSmn(this.valueSearchSmn).subscribe((activitySmn: any) => {
            this.activitySmn = activitySmn;
        });
    }

    submitActivityTopic() {
        if (this.selectedActivityTopicName && this.nameActivityTopic) {
            const isDuplicate = this.activitySmn.some((smn: any) => {
                return smn.activityTopicName === this.nameActivityTopic && smn.activityId === this.selectedActivityTopicName;
            });

            if (!isDuplicate) {
                const data = {
                    activityId: this.selectedActivityTopicName,
                    activityTopicName: this.nameActivityTopic,
                };
                console.log(data);

                this.callServive
                    .createActivityTopic(data)
                    .pipe(
                        tap((res) => {
                            this.sweetalertServices.getSwal('success', 'บันทึกข้อมูลเรียบร้อยแล้ว', '', false, '');
                            this.auditLogService.log(
                                '',
                                'Contact Create Call ActivityTopic',
                                'Contact Create Case Call ActivityTopic',
                                `ContactID : ${this.contactId}`,
                                `Success`,
                            );
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
                            this.auditLogService.log(
                                '',
                                'Contact Create Call ActivityTopic',
                                'Contact Create ActivityTopic',
                                `ContactID : ${this.contactId}`,
                                `Failed, Error : ${error}`,
                            );
                            throw error;
                        }),
                    )
                    .subscribe();
            } else {
                this.sweetalertServices.getSwal('warning', 'ข้อมูลซ้ำกับข้อมูลที่มีอยู่แล้ว', '', false, '');
            }
        } else {
            this.sweetalertServices.getSwal('warning', 'กรุณาใส่ข้อมูลให้ครบถ้วน', '', false, '');
        }
    }

    sortSmn(value: string) {
        if (this.sortIdSmn == value) {
            if (this.sortIcon == 'fa-solid fa-sort-down') {
                this.sortIcon = 'fa-solid fa-sort-up';
                this.sortOrderSmn = 'DESC';
            } else {
                this.sortIcon = 'fa-solid fa-sort-down';
                this.sortOrderSmn = 'ASC';
            }
        } else {
            this.sortIdSmn = value;
        }
        this.getFormEln();
    }

    toggleActivityTopicIdSmn(activityTopicId: string) {
        const index = this.selectedActivityTopicIdSmn.indexOf(activityTopicId);
        if (index === -1) {
            this.selectedActivityTopicIdSmn.push(activityTopicId);
        } else {
            this.selectedActivityTopicIdSmn.splice(index, 1);
        }
        this.saveSelectedActivitiesSmn();
        console.log('select id activity:', this.selectedActivityTopicIdSmn);
    }

    toggleCheckbox(activityTopicId: number) {
        const index = this.selectedCheckboxIds.indexOf(activityTopicId);
        if (index === -1) {
            this.selectedCheckboxIds.push(activityTopicId);
        } else {
            this.selectedCheckboxIds.splice(index, 1);
        }
    }

    toggleActivityTopicId(activityTopicId: string) {
        const index = this.selectedActivityTopicId.indexOf(activityTopicId);
        if (index === -1) {
            this.selectedActivityTopicId.push(activityTopicId);
        } else {
            this.selectedActivityTopicId.splice(index, 1);
        }
        this.saveSelectedActivities();
        console.log('select id activity:', this.selectedActivityTopicId);
    }

    saveSelectedActivities() {
        this.selectedActivities = this.activityEln.filter((activity: { activityTopicId: string }) => {
            return this.selectedActivityTopicId.includes(activity.activityTopicId);
        });
        // this.showAddCall();
    }

    saveSelectedActivitiesSmn() {
        this.selectedActivitiesSmn = this.activitySmn.filter((activity: { activityTopicId: string }) => {
            return this.selectedActivityTopicIdSmn.includes(activity.activityTopicId);
        });
        // this.showAddCall();
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

    searchEln(): void {
        this.callServive.getActivityById(this.valueSearchEln).subscribe((activityEln: any) => {
            this.activityEln = activityEln;
        });
    }

    sortEln(value: string) {
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
        this.getFormEln();
    }

    async getFormEln() {
        await this.callServive.getActivityIdByPage(this.valueSearchEln).subscribe((res: any) => {
            console.log('API response:', res);
            this.activityTypeById = res;
            // this.spareActivityTypeById = res;
        });
        console.log('ActivityIdByPage:', this.activityTypeById);
    }

    // อัปเดตรายการทั้งหมดสำหรับโครงการอบรม/สัมมนา
    updateSelectedActivitiesListSmn() {
        this.selectedActivitiesSmn = this.activityTypeById.filter((smn: { activityTopicId: string }) =>
            this.selectedActivityTopicIdSmn.includes(smn.activityTopicId),
        );
    }

    // อัปเดตรายการทั้งหมดสำหรับ E-Learning
    updateSelectedActivitiesListElearning() {
        this.selectedActivitiesElearning = this.activityEln.filter((elearning: { activityTopicId: string }) =>
            this.selectedActivityTopicId.includes(elearning.activityTopicId),
        );
    }

    filterActivities(): any[] {
        return this.activitiestype.filter((activityType: { activityTypeId: number }) => [21, 27, 28].includes(activityType.activityTypeId));
    }

    addTopicAndSubject() {
        if (this.selectSubject < 5) this.selectSubject++;
    }
    removeTopicAndSubject() {
        if (this.selectSubject > 0) this.selectSubject--;
        console.log(this.selectSubject);
    }
}
