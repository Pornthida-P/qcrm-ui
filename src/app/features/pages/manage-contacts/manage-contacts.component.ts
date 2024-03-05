import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormioComponent } from '@formio/angular';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { faArrowLeft, faArrowRight, faPenToSquare, faTrashCan, faCircleXmark, faEye, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { SurveyFormService } from 'src/app/services/survey-form/survey-form.service';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-manage-contacts',
    templateUrl: './manage-contacts.component.html',
    styleUrls: ['./manage-contacts.component.scss'],
})
export class ManageContactsComponent implements OnInit {
    organizations: any[] = [];
    contactActivities: any[] = [];
    contactDrive: any;
    contactSurveyForm: any[] = [];
    contactCall: any[] = [];
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
    FormShowing: boolean = false;
    SearchFormShowing: boolean = true;
    submitButtonShowing: boolean = true;
    SearchButton: boolean = true;
    emptyItem: String = 'ว่าง';

    surveyForms!: any;
    spareSurveyForms!: any;
    selectedSurveyForms: any = [];
    valueSearch!: string;
    checkedValues: string[] = [];
    formData: any = {};

    formId: string = '';
    formName: string = '';
    surveyForm: any;
    survey: any;
    form: any;
    thanks: boolean = false;
    existing: boolean = false;

    pageSizeOptions = [10, 20];
    pageSize = 10;
    currentPage = 1;
    totalItems = 0;
    totalPages = 0;
    pagesToShow = 3;

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

    filterOption!: any[];
    selectedFilter: any | undefined;
    selectedForm: any | undefined;
    readOnlyForm: boolean = false;

    userData: any = JSON.parse(localStorage.getItem('userData') || '{}');
    userRole: string = '';
    roleCanAccessCUDForm: string[] = config.roleCanAccessCUDForm;

    calls: string | null | undefined;
    userId: string = '';

    constructor(
        private _location: Location,
        private surveyFormService: SurveyFormService,
        private contactsService: ContactsService,
        private surveyService: SurveyService,
        private sweetalertServices: SweetAlertService,
        private activeRoute: ActivatedRoute,
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

        this.route.queryParamMap.subscribe(params => {
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

        this.activeRoute.queryParams.subscribe((params) => {
            if (params['cb'] != undefined && params['cb'] != '') {
                const cbArray = params['cb'].split(',').map(Number);
                this.pageSize = cbArray[0];
                this.currentPage = cbArray[1];
                this.totalItems = cbArray[2];
                this.totalPages = cbArray[3];
            }
        });
        this.selectedFilter = 'all';
        if (this.selectedFilter !== 'all') {
            this.userId = this.userData.userId;
        }
        this.getForm((this.currentPage - 1) * this.pageSize, this.pageSize);
        this.getPage();
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
            if (this.contactIden != '' && this.contactIden != null && this.contactIden != undefined){
                this.contactsService.getContactActivities(this.contactIden).subscribe((res: any) => {
                    this.contactActivities = res;
                });
            }
        });

        await this.contactsService.getContactSurveyForm(contactId).subscribe((res: any) => {
            this.contactSurveyForm = res;
        });

        await this.contactsService.getContactCall(contactId).subscribe((res: any) => {
            this.contactCall = res;
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

    showSideBar() {
        this.visibleLeftSideBar = true;
        this.visibleRightSideBar = true;
        this.FormShowing = false;
        this.SearchFormShowing = true;
        this.thanks = false;
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
                            window.location.reload();
                        }),
                        catchError((error) => {
                            this.sweetalertServices.handleError(error);
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
        if (this.contactIden != '' && this.contactIden != null && this.contactIden != undefined){
            this.contactsService.getDriveContact(this.contactIden).subscribe((res: any) => {
                this.contactDrive = res;
                this.contactFirstName = this.contactDrive.firstname_TH;
                this.contactLastName = this.contactDrive.lastname_TH;
                this.contactEmail = this.contactDrive.email;
                this.contactNum = this.contactDrive.mobile;
                this.contactProvince = this.contactDrive.province.name;
            }, (error: any) => {
                this.sweetalertServices.getSwal('warning', 'Warning', 'ไม่พบข้อมูลในระบบ Drive', false, '');
            });
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

    updateCheckedValues(formId: string): void {
        if (this.checkedValues.includes(formId)) {
            this.checkedValues = this.checkedValues.filter((id) => id !== formId);
        } else {
            this.checkedValues.push(formId);
        }
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
                        this.thanks = true;
                        location.reload();
                    } else {
                        this.sweetalertServices.getSwal('error', 'Error', res.message, false, '');
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
            this.readOnlyForm = false;
            if (this.existing == false){
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
        this.thanks = false;
        this.readOnlyForm = true;
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

}
