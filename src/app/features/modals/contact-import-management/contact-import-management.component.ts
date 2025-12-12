import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { faCloudUploadAlt, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import * as XLSX from 'xlsx';
import { UserService } from 'src/app/services/user/user.service';
import { CallService } from 'src/app/services/call/call.service';
import { firstValueFrom, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { StatusService } from 'src/app/services/status/status.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'app-contact-import-management',
    standalone: false,
    templateUrl: './contact-import-management.component.html',
    styleUrl: './contact-import-management.component.scss',
})
export class ContactImportManagementComponent implements OnInit {
    faCloudUploadAlt = faCloudUploadAlt;
    faXmark = faXmark;
    contactObjects: any[] = [];
    isProcessing = false;
    isImporting = false;
    agentAll: any[] = [];
    caseList: any[] = [];
    isLoading = false;
    mode: string = '';
    form!: FormGroup;
    assignUser: string = '';
    assignAt: string = '';
    status: string = '';
    statusList: any[] = [];

    constructor(
        private contactService: ContactsService,
        public dialogRef: MatDialogRef<ContactImportManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private translate: TranslateService,
        private userService: UserService,
        private callService: CallService,
        private sweetAlertService: SweetAlertService,
        public statusService: StatusService,
    ) {}

    ngOnInit() {
        this.mode = this.data.mode;
        this.buildForm();
        if (this.mode === 'view') {
            console.log('data: ', this.data);
            this.form.patchValue(this.data.contactListImport);
            this.form.disable();
            this.assignUser = this.data.contactListImport.assignUser;
            this.assignAt = this.data.contactListImport.requestDateTime;
            this.status = this.data.contactListImport.status;
        }
        this.getStatusList();
    }

    buildForm() {
        this.form = new FormGroup({
            fullname: new FormControl('', Validators.required),
            contactNumber: new FormControl('', Validators.required),
            topic: new FormControl('', Validators.required),
            subject: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
        });
    }

    readExcelFile(file: File) {
        this.isLoading = true;
        const reader = new FileReader();
        reader.onload = async (event: any) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array', cellText: false, cellDates: true });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Read with raw option to preserve cell values as they are
            const json = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                raw: false, // Get cell values as strings
                defval: '', // Default value for empty cells
            });

            // Process the data to fix phone numbers and convert to array of objects
            const processedData = this.processContactData(json);
            this.contactObjects = this.convertToContactObjects(processedData);
            if (this.contactObjects.length > 0) {
                this.isProcessing = true;
                await this.checkContactData();
                this.isProcessing = false;
            }
        };
        reader.readAsArrayBuffer(file);
    }

    private processContactData(data: any[]): any[] {
        if (!data || data.length === 0) return data;

        // First row is header
        const headers = data[0];
        const phoneNumberIndex = headers.findIndex(
            (h: string) => h && (h.toLowerCase().includes('phone') || h.toLowerCase().includes('number')),
        );

        if (phoneNumberIndex === -1) {
            console.warn('Phone number column not found');
            return data;
        }

        // Process each row starting from index 1 (skip header)
        return data.map((row: any[], rowIndex: number) => {
            if (rowIndex === 0) return row; // Keep header as is

            if (row[phoneNumberIndex] !== undefined && row[phoneNumberIndex] !== null) {
                let phoneNumber = String(row[phoneNumberIndex]).trim();

                // Remove any non-digit characters except leading +
                phoneNumber = phoneNumber.replace(/[^\d+]/g, '');

                // If phone number is 9 digits and starts with 6-9, add leading 0 (Thai phone number)
                if (/^[6-9]\d{8}$/.test(phoneNumber)) {
                    phoneNumber = '0' + phoneNumber;
                }
                // If phone number is 8 digits and starts with 1-9, add leading 0
                else if (/^[1-9]\d{7}$/.test(phoneNumber)) {
                    phoneNumber = '0' + phoneNumber;
                }

                row[phoneNumberIndex] = phoneNumber;
            }

            return row;
        });
    }

    onUploadFile(event: any) {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type;
            if (fileType != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                return;
            }

            this.readExcelFile(file);
        }
    }

    private convertToContactObjects(data: any[]): any[] {
        if (!data || data.length < 2) return [];

        // First row is header - keep original case
        const headers = data[0].map((h: string) => (h ? String(h).trim() : ''));
        const contactObjects: any[] = [];

        // Process each row starting from index 1 (skip header)
        for (let i = 1; i < data.length; i++) {
            const row = data[i];

            // Skip empty rows
            if (!row || row.length === 0 || row.every((cell: any) => cell === undefined || cell === null || cell === '')) {
                continue;
            }

            const contactObj: any = {};

            headers.forEach((header: string, index: number) => {
                if (header) {
                    const value = row[index];
                    // Keep original value type, only convert to string if needed
                    if (value === undefined || value === null || value === '') {
                        contactObj[header] = null;
                    } else {
                        // For phone_number, keep as string (already processed)
                        if (header.toLowerCase().includes('phone') || header.toLowerCase().includes('number')) {
                            contactObj[header] = String(value).trim();
                        } else {
                            // For other fields, keep original type or convert to string
                            contactObj[header] = typeof value === 'string' ? value.trim() : value;
                        }
                    }
                }
            });

            // Add name field by combining firstname + lastname
            const firstName = contactObj['firstname'] || contactObj['firstName'] || '';
            const lastName = contactObj['lastname'] || contactObj['lastName'] || '';
            const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
            contactObj['name'] = fullName || null;

            contactObjects.push(contactObj);
        }

        return contactObjects;
    }

    // Check contact data without calling API (only for status preview)
    async checkContactData() {
        for (const contactObject of this.contactObjects) {
            try {
                const phone = contactObject['phone_number'];
                if (phone) {
                    const phoneRes: any = await this.contactService.getContactsByParamPhone(phone).toPromise();
                    const phoneContacts = typeof phoneRes === 'string' ? JSON.parse(phoneRes) : phoneRes;
                    if (phoneContacts && Array.isArray(phoneContacts) && phoneContacts.length > 0) {
                        contactObject['contact'] = phoneContacts[0];
                        contactObject['import-status'] = 'found';
                        continue;
                    }
                }

                // If not found by phone, search by name
                const name = contactObject['name'];
                if (name) {
                    const nameContacts = await this.searchContactByName(name);
                    if (nameContacts && nameContacts.length > 0) {
                        contactObject['contact'] = nameContacts[0];
                        if (nameContacts[0].contactNumber !== contactObject['phone_number']) {
                            contactObject['import-status'] = 'update';
                        } else {
                            contactObject['import-status'] = 'found';
                        }
                    } else {
                        contactObject['import-status'] = 'create';
                    }
                } else {
                    contactObject['contact'] = null;
                    contactObject['import-status'] = 'not-found';
                }
            } catch (error) {
                console.error('Error checking contact data:', error);
                contactObject['contact'] = null;
                contactObject['import-status'] = 'not-found';
            }
        }
        this.isLoading = false;
    }

    // Actually import/update contacts by calling API
    async onClickConfirm() {
        if (this.isImporting) return;

        this.isImporting = true;
        let successCount = 0;
        let errorCount = 0;

        try {
            for (const contactObject of this.contactObjects) {
                let importStatus = contactObject['import-status'];
                try {
                    if (importStatus === 'found') {
                        // Already exists, skip
                        successCount++;
                        continue;
                    }

                    if (importStatus === 'update') {
                        // Update existing contact
                        const updated = await this.updateContact(contactObject);
                        if (updated) {
                            contactObject['contact'] = updated;
                            importStatus = 'found';
                            successCount++;
                        } else {
                            importStatus = 'error';
                            errorCount++;
                        }
                    } else if (importStatus === 'create') {
                        // Create new contact
                        const created = await this.createContact(contactObject);
                        if (created) {
                            contactObject['contact'] = created;
                            importStatus = 'found';
                            successCount++;
                        } else {
                            importStatus = 'error';
                            errorCount++;
                        }
                    } else {
                        // not-found or error status
                        errorCount++;
                    }
                } catch (error) {
                    console.error('Error processing contact:', error);
                    importStatus = 'error';
                    errorCount++;
                }
            }
            if (errorCount === 0) {
                this.leadManagement(this.contactObjects);
            }
        } catch (error) {
            this.dialogRef.close({ success: false, imported: 0, errors: 0 });
        } finally {
            this.isImporting = false;
        }
    }
    async searchContactByName(name: string): Promise<any[]> {
        if (!name || name.trim() === '') {
            return [];
        }
        try {
            const res: any = await this.contactService.getContactsByPage(0, 15, 'startTime,DESC', name.trim(), 'all').toPromise();
            const contacts = typeof res === 'string' ? JSON.parse(res) : res;
            return Array.isArray(contacts) ? contacts : [];
        } catch (error) {
            console.error('Error searching contact by name:', error);
            return [];
        }
    }

    async updateContact(contactObject: any): Promise<any> {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const data = {
            contactId: contactObject['contact'].contactId,
            firstName: contactObject['firstname'] || contactObject['firstName'] || contactObject['contact'].firstName || '',
            lastName: contactObject['lastname'] || contactObject['lastName'] || contactObject['contact'].lastName || '',
            contactNumber: contactObject['contact'].contactNumber || '',
            contactNumNew: contactObject['phone_number'] || contactObject['phoneNumber'] || '',
            modifiedById: userData.userId || '',
        };

        try {
            const res: any = await this.contactService.editContacts(data).toPromise();
            return typeof res === 'string' ? JSON.parse(res) : res;
        } catch (error) {
            console.error('Error updating contact:', error);
            return null;
        }
    }

    async createContact(contactObject: any): Promise<any> {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const data = {
            firstName: contactObject['firstname'] || contactObject['firstName'] || '',
            lastName: contactObject['lastname'] || contactObject['lastName'] || '',
            contactNumber: contactObject['phone_number'] || contactObject['phoneNumber'] || '',
            gender: contactObject['gender'] || 'unknown',

            createdById: userData.userId || '',
        };

        try {
            const res: any = await this.contactService.createContacts(data).toPromise();
            const result = typeof res === 'string' ? JSON.parse(res) : res;

            if (result && result.success === true) {
                const contactId = result.contactId;
                const contact = await this.findContactById(contactId);
                return contact;
            }
            return null;
        } catch (error) {
            console.error('Error creating contact:', error);
            return null;
        }
    }

    async findContactById(id: string): Promise<any> {
        try {
            const res: any = await this.contactService.getContactsById(id).toPromise();
            const contact = typeof res === 'string' ? JSON.parse(res) : res;

            if (Array.isArray(contact) && contact.length > 0) {
                return contact[0];
            } else if (contact && !Array.isArray(contact)) {
                return contact;
            }
            return null;
        } catch (error) {
            console.error('Error finding contact by id:', error);
            return null;
        }
    }

    onClickClose(): void {
        this.dialogRef.close();
    }

    getStatusList() {
        this.callService.getAllStatus().subscribe((res: any) => {
            this.statusList = res.map((item: any) => ({
                id: item.id,
                name: item.status,
            }));
        });
    }
    getStatusLabel(status: string): string {
        const statusKey = `contact-import-management.status.${status}`;
        const defaultKey = 'contact-import-management.status.pending';
        return this.translate.instant(statusKey) || this.translate.instant(defaultKey);
    }

    getStatusColorAndIcon(id: number) {
        const style = this.statusService.getStatusColorByIndex(id);
        return { color: style.backgroundColor, icon: `<i class="${style.icon}"></i>` };
    }

    getStatusColor(statusName: string): string {
        return this.statusService.getStatusBgColor(statusName);
    }

    getStatusCount(status: string): number {
        return this.contactObjects.filter((contact) => contact['import-status'] === status).length;
    }

    getAgentAll() {
        return new Promise<void>((resolve) => {
            this.userService.getAllUser().subscribe((res: any) => {
                if (res && Array.isArray(res)) {
                    this.agentAll = res.filter((agent: any) => agent.role.roleTitle.toLowerCase() === 'agent');
                }
                resolve();
            });
        });
    }

    getCaseTopicByCode(code: string): Promise<any[]> {
        return new Promise((resolve) => {
            if (!code) {
                resolve([]);
                return;
            }
            this.callService.getCaseTopicByCode(code).subscribe((res: any) => {
                const parsedRes = typeof res === 'string' ? JSON.parse(res) : res;
                if (parsedRes && Array.isArray(parsedRes) && parsedRes.length > 0) {
                    resolve(parsedRes);
                } else {
                    resolve([]);
                }
            });
        });
    }

    getCaseSubjectByCode(code: string): Promise<any[]> {
        return new Promise((resolve) => {
            if (!code) {
                resolve([]);
                return;
            }
            this.callService.getCaseSubjectByCode(code).subscribe((res: any) => {
                const parsedRes = typeof res === 'string' ? JSON.parse(res) : res;
                if (parsedRes && Array.isArray(parsedRes) && parsedRes.length > 0) {
                    resolve(parsedRes);
                } else {
                    resolve([]);
                }
            });
        });
    }

    // Round Robin distribution of leads to agents
    async leadManagement(contactObjects: any[]) {
        if (!contactObjects || contactObjects.length === 0) {
            console.warn('No contact objects to distribute');
            return;
        }

        // Get all agents first
        await this.getAgentAll();

        if (this.agentAll.length === 0) {
            console.error('No agents available for lead distribution');
            return;
        }

        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const nowISO = new Date().toISOString();
        const casePromises: any[] = [];

        // Filter only contacts that have been successfully imported (have contactId)
        const validContacts = contactObjects.filter((contactObj: any) => {
            const contact = contactObj['contact'] || contactObj;
            return contact && contact.contactId;
        });

        if (validContacts.length === 0) {
            console.warn('No valid contacts with contactId found');
            return;
        }

        // Round Robin: distribute leads to agents in rotation
        await Promise.all(
            validContacts.map(async (contactObj: any, index: number) => {
                const contact = contactObj['contact'] || contactObj;

                // Round Robin: cycle through agents
                const agentIndex = index % this.agentAll.length;
                const assignedAgent = this.agentAll[agentIndex];

                // Map contact data to case data
                const caseTopic: any[] = await this.getCaseTopicByCode(contactObj['caseTopicCode'] || contact['caseTopicCode'] || null);
                const caseSubject: any[] = await this.getCaseSubjectByCode(
                    contactObj['caseSubjectCode'] || contact['caseSubjectCode'] || null,
                );
                const result = await firstValueFrom(
                    this.contactService.getContactNumberIdByPhone(contactObj['phone_number'] || contact['phone_number'] || null),
                );
                const contactNumberId = (result as any[])[0]?.contactNumberId ?? null;

                const caseData = {
                    caseId: null,
                    contactId: contact.contactId,
                    channelId: contactObj['channelId'] || contact['channelId'] || 1,
                    requestDateTime: contactObj['requestDateTime'] || contact['requestDateTime'] || nowISO,
                    description: contactObj['description'] || contact['description'] || '',
                    caseTopicId: caseTopic && caseTopic.length > 0 ? caseTopic[0].caseTopicId : null,
                    caseTopicCode: contactObj['caseTopicCode'] || contact['caseTopicCode'] || contactObj['caseTopicCode'] || null,
                    caseSubjectId: caseSubject && caseSubject.length > 0 ? caseSubject[0].caseSubjectId : null,
                    operationType: contactObj['operationType'] || contact['operationType'] || null,
                    priority: contactObj['priority'] || contact['priority'] || null,
                    status: contactObj['status'] || contact['status'] || 1,
                    solution: contactObj['solution'] || contact['solution'] || null,
                    contactNumber: contactNumberId,
                    source: contactObj['source'] || contact['source'] || null,
                    assignedAt: nowISO,
                    createdAt: nowISO,
                    createdById: userData.userId,
                    modifiedAt: nowISO,
                    modifiedById: userData.userId,
                    isDeleted: 0,
                    assignedUserId: assignedAgent.userId,
                    attachment: contactObj['attachment'] || contact['attachment'] || null,
                };

                // Add to case list for tracking
                this.caseList.push(caseData);

                // Create case via API
                casePromises.push(
                    this.callService.createCase(caseData).pipe(
                        catchError((error) => {
                            console.error(`Error creating case for contact ${contact.contactId}:`, error);
                            return of({ error: true, contactId: contact.contactId });
                        }),
                    ),
                );
            }),
        );

        // Execute all case creation requests
        try {
            const results = await forkJoin(casePromises).toPromise();
            const successCount = results?.filter((r: any) => !r?.error).length || 0;
            const errorCount = results?.filter((r: any) => r?.error).length || 0;

            if (errorCount === 0) {
                this.sweetAlertService.getSwal(
                    'success',
                    this.translate.instant('contact-import-management.success'),
                    this.translate.instant('contact-import-management.success-message', { count: successCount }),
                    true,
                    '',
                    {
                        success: true,
                        imported: successCount,
                    },
                );
                this.dialogRef.close({ success: true, imported: successCount });
            } else {
                this.sweetAlertService.getSwal(
                    'error',
                    this.translate.instant('contact-import-management.error'),
                    this.translate.instant('contact-import-management.error-message', { count: successCount, errors: errorCount }),
                    true,
                    '',
                    {
                        success: false,
                        imported: successCount,
                        errors: errorCount,
                    },
                );
                this.dialogRef.close({ success: false, imported: successCount, errors: errorCount });
            }
        } catch (error) {
            console.error('Error during lead distribution:', error);
            this.sweetAlertService.getSwal(
                'error',
                this.translate.instant('contact-import-management.error'),
                this.translate.instant('contact-import-management.error-message', { count: 0, errors: 0 }),
                true,
                '',
                {
                    success: false,
                    imported: 0,
                    errors: 0,
                },
            );
        }
    }
}
