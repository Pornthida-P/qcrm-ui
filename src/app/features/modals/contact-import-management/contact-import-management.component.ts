import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { faCloudUploadAlt, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import * as XLSX from 'xlsx';
import { UserService } from 'src/app/services/user/user.service';
import { CallService } from 'src/app/services/call/call.service';
import { CarService } from 'src/app/services/car/car.service';
import { firstValueFrom, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { StatusService } from 'src/app/services/status/status.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { config } from 'src/app/config/config';
import * as moment from 'moment';
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
    outbound: string = config.operationType.outbound;

    constructor(
        private contactService: ContactsService,
        public dialogRef: MatDialogRef<ContactImportManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private translate: TranslateService,
        private userService: UserService,
        private callService: CallService,
        private carService: CarService,
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
            this.isLoading = false;
        };
        reader.readAsArrayBuffer(file);
    }

    readCsvFile(file: File) {
        this.isLoading = true;
        const reader = new FileReader();
        reader.onload = async (event: any) => {
            try {
                const csvText = event.target.result as string;

                // Parse CSV - handle both quoted and unquoted values
                const lines = csvText.split(/\r?\n/).filter((line: string) => line.trim().length > 0);
                if (lines.length === 0) {
                    this.isLoading = false;
                    return;
                }

                // Parse CSV with proper handling of quoted fields
                const parseCsvLine = (line: string): string[] => {
                    const result: string[] = [];
                    let current = '';
                    let inQuotes = false;

                    for (let i = 0; i < line.length; i++) {
                        const char = line[i];
                        const nextChar = line[i + 1];

                        if (char === '"') {
                            if (inQuotes && nextChar === '"') {
                                // Escaped quote
                                current += '"';
                                i++; // Skip next quote
                            } else {
                                // Toggle quote state
                                inQuotes = !inQuotes;
                            }
                        } else if (char === ',' && !inQuotes) {
                            // End of field
                            result.push(current.trim());
                            current = '';
                        } else {
                            current += char;
                        }
                    }
                    result.push(current.trim()); // Add last field
                    return result;
                };

                // Convert CSV lines to array format (same as Excel)
                const json: any[] = [];
                lines.forEach((line: string, index: number) => {
                    const parsedLine = parseCsvLine(line);
                    json.push(parsedLine);
                });

                // Process the data to fix phone numbers and convert to array of objects
                const processedData = this.processContactData(json);
                this.contactObjects = this.convertToContactObjects(processedData);
                if (this.contactObjects.length > 0) {
                    this.isProcessing = true;
                    await this.checkContactData();
                    this.isProcessing = false;
                }
            } catch (error) {
                console.error('Error reading CSV file:', error);
            } finally {
                this.isLoading = false;
            }
        };
        reader.readAsText(file, 'UTF-8');
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
            const fileName = file.name.toLowerCase();
            const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
            const fileType = file.type;

            if (fileExtension === '.csv' || fileType === 'text/csv') {
                this.readCsvFile(file);
            } else if (
                fileExtension === '.xlsx' ||
                fileExtension === '.xls' ||
                fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                fileType === 'application/vnd.ms-excel'
            ) {
                this.readExcelFile(file);
            } else {
                console.warn('Unsupported file type:', fileType);
                return;
            }
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

            // Add name field by combining firstname + lastname or use Dealer Name
            const firstName = contactObj['firstname'] || contactObj['firstName'] || '';
            const lastName = contactObj['lastname'] || contactObj['lastName'] || '';
            const dealerName = contactObj['Dealer Name'] || contactObj['dealerName'] || '';
            const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || dealerName;
            contactObj['name'] = fullName || null;

            // Parse date for car (handle both formats: "30/12/2025 09:53" and "2026-01-07 15:39")
            if (contactObj['Created Date']) {
                const createdDate = contactObj['Created Date'];
                let parsedDate: string;
                if (createdDate.includes('/')) {
                    // Format: "30/12/2025 09:53"
                    const [datePart, timePart] = createdDate.split(' ');
                    const [day, month, year] = datePart.split('/');
                    parsedDate = `${year}-${month}-${day} ${timePart || '00:00:00'}`;
                } else {
                    // Format: "2026-01-07 15:39" or ISO format
                    parsedDate = createdDate;
                }
                contactObj['parsedCreatedDate'] = parsedDate;
            }

            // Clean phone number (remove ="" wrapper)
            if (contactObj['Contact Mobile']) {
                let phone = String(contactObj['Contact Mobile'])
                    .replace(/^="|"$/g, '')
                    .replace(/=/g, '')
                    .trim();
                contactObj['Contact Mobile'] = phone;
                contactObj['phone_number'] = phone; // For compatibility
            }

            // Clean AL Phone Number (remove ="" wrapper)
            if (contactObj['AL Phone Number']) {
                let alPhone = String(contactObj['AL Phone Number'])
                    .replace(/^="|"$/g, '')
                    .replace(/=/g, '')
                    .trim();
                contactObj['AL Phone Number'] = alPhone;
            }

            // Parse price fields (remove commas and convert to number)
            if (contactObj['ราคาประกาศขาย']) {
                const price = String(contactObj['ราคาประกาศขาย']).replace(/,/g, '');
                contactObj['asking_price'] = price ? parseFloat(price) : null;
            }
            if (contactObj['ราคา bluebook']) {
                const price = String(contactObj['ราคา bluebook']).replace(/,/g, '');
                contactObj['bluebook_price'] = price ? parseFloat(price) : null;
            }
            if (contactObj['ราคาแนะนำ']) {
                const price = String(contactObj['ราคาแนะนำ']).replace(/,/g, '');
                contactObj['msrp_price'] = price ? parseFloat(price) : null;
            }

            contactObjects.push(contactObj);
        }

        return contactObjects;
    }

    // Check contact data without calling API (only for status preview)
    async checkContactData() {
        for (const contactObject of this.contactObjects) {
            try {
                // Check if has car data (for lead import)
                const hasCarData = contactObject['Dealer ID'] || contactObject['dealerId'];
                if (hasCarData) {
                    contactObject['hasCarData'] = true;
                }

                const phone = contactObject['phone_number'] || contactObject['Contact Mobile'];
                if (phone) {
                    const phoneRes: any = await this.contactService.getContactsByParamPhone(phone).toPromise();
                    const phoneContacts = typeof phoneRes === 'string' ? JSON.parse(phoneRes) : phoneRes;
                    if (phoneContacts && Array.isArray(phoneContacts) && phoneContacts.length > 0) {
                        contactObject['contact'] = phoneContacts[0];
                        // Check if partnerCode or email is different
                        const dealerId = contactObject['Dealer ID'] || contactObject['dealerId'] || null;
                        const existingPartnerCode = phoneContacts[0].partnerCode || null;
                        const newEmail = contactObject['Contact Email'] || contactObject['email'] || null;
                        const existingEmail = phoneContacts[0].email || null;
                        // PartnerCode different: CSV has value and it's different from DB, or CSV has value but DB doesn't
                        const partnerCodeDifferent = dealerId !== null && dealerId !== existingPartnerCode;
                        // Email different: both have values and they're different
                        const emailDifferent = newEmail !== null && existingEmail !== null && newEmail !== existingEmail;

                        if (partnerCodeDifferent || emailDifferent) {
                            contactObject['import-status'] = 'update';
                        } else {
                            contactObject['import-status'] = 'found';
                        }
                        continue;
                    }
                }

                // If not found by phone, search by name or email
                const name = contactObject['name'];
                const email = contactObject['Contact Email'] || contactObject['email'];

                if (email) {
                    // Try to find by email first
                    const emailContacts = await this.searchContactByEmail(email);
                    if (emailContacts && emailContacts.length > 0) {
                        contactObject['contact'] = emailContacts[0];
                        // Check if partnerCode is different (email should be same since we found by email)
                        const dealerId = contactObject['Dealer ID'] || contactObject['dealerId'] || null;
                        const existingPartnerCode = emailContacts[0].partnerCode || null;
                        // PartnerCode different: CSV has value and it's different from DB, or CSV has value but DB doesn't
                        const partnerCodeDifferent = dealerId !== null && dealerId !== existingPartnerCode;

                        if (partnerCodeDifferent) {
                            contactObject['import-status'] = 'update';
                        } else {
                            contactObject['import-status'] = 'found';
                        }
                        continue;
                    }
                }

                if (name) {
                    const nameContacts = await this.searchContactByName(name);
                    if (nameContacts && nameContacts.length > 0) {
                        contactObject['contact'] = nameContacts[0];
                        // Check if phone number, partnerCode, or email is different
                        const phoneDifferent = nameContacts[0].contactNumber !== contactObject['phone_number'];
                        const dealerId = contactObject['Dealer ID'] || contactObject['dealerId'] || null;
                        const existingPartnerCode = nameContacts[0].partnerCode || null;
                        // PartnerCode different: CSV has value and it's different from DB, or CSV has value but DB doesn't
                        const partnerCodeDifferent = dealerId !== null && dealerId !== existingPartnerCode;
                        const newEmail = contactObject['Contact Email'] || contactObject['email'] || null;
                        const existingEmail = nameContacts[0].email || null;
                        // Email different: both have values and they're different
                        const emailDifferent = newEmail !== null && existingEmail !== null && newEmail !== existingEmail;

                        if (phoneDifferent || partnerCodeDifferent || emailDifferent) {
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

    async searchContactByEmail(email: string): Promise<any[]> {
        if (!email || email.trim() === '') {
            return [];
        }
        try {
            // Search contacts by email - you may need to add this method to ContactsService
            const res: any = await this.contactService.getContactsByPage(0, 15, 'startTime,DESC', email.trim(), 'all').toPromise();
            const contacts = typeof res === 'string' ? JSON.parse(res) : res;
            return Array.isArray(contacts) ? contacts.filter((c: any) => c.email === email) : [];
        } catch (error) {
            console.error('Error searching contact by email:', error);
            return [];
        }
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
                    // Create or update car first (if has car data)
                    if (contactObject['hasCarData']) {
                        const car = await this.createOrUpdateCar(contactObject);
                        if (car && car.id) {
                            contactObject['car'] = car;
                            contactObject['carId'] = car.id;
                        } else {
                            console.warn('Failed to create/update car for', contactObject['Dealer ID']);
                        }
                    }

                    if (importStatus === 'found') {
                        // Already exists, skip contact creation but ensure car is created
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
        const contact = contactObject['contact'] || {};
        const data = {
            contactId: contact.contactId,
            firstName: contactObject['firstname'] || contactObject['firstName'] || contact.firstName || '',
            lastName: contactObject['lastname'] || contactObject['lastName'] || contact.lastName || '',
            gender: contactObject['gender'] || contact.gender || 'unknown',
            organizationId: contactObject['organizationId'] || contact.organizationId || null,
            contactType: contactObject['contactType'] || contact.contactType || 'Seller',
            contactNumber: contact.contactNumber || '',
            contactNumber2: contactObject['contactNumber2'] || contact.contactNumber2 || '',
            province: contactObject['License Plate Province'] || contactObject['licensePlateProvince'] || contact.province || null,
            modifiedById: userData.userId || '',
            contactNumNew: contactObject['phone_number'] || contactObject['phoneNumber'] || contactObject['Contact Mobile'] || '',
            partnerCode: contactObject['Dealer ID'] || contactObject['dealerId'] || null, // Dealer ID is partnerCode
            email: contactObject['Contact Email'] || contactObject['email'] || null,
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

        // Split dealer name into first and last name if available
        const dealerName = contactObject['Dealer Name'] || contactObject['dealerName'] || '';
        let firstName = contactObject['firstname'] || contactObject['firstName'] || '';
        let lastName = contactObject['lastname'] || contactObject['lastName'] || '';

        if (!firstName && dealerName) {
            const nameParts = dealerName.trim().split(/\s+/);
            firstName = nameParts[0] || 'ไม่ทราบชื่อ';
            lastName = nameParts.slice(1).join(' ') || null;
        }

        const data = {
            firstName: firstName || 'ไม่ทราบชื่อ',
            lastName: lastName || null,
            gender: contactObject['gender'] || 'unknown',
            organizationId: contactObject['organizationId'] || null,
            contactType: 'Seller',
            contactNumber: contactObject['phone_number'] || contactObject['phoneNumber'] || contactObject['Contact Mobile'] || '',
            contactNumber2: contactObject['contactNumber2'] || '',
            chatId: contactObject['chatId'] || '',
            chatType: contactObject['chatType'] || '',
            displayName: contactObject['displayName'] || dealerName || firstName || 'ไม่ทราบชื่อ',
            province: contactObject['License Plate Province'] || contactObject['licensePlateProvince'] || null,
            createdById: userData.userId || '',
            partnerCode: contactObject['Dealer ID'] || contactObject['dealerId'] || null, // Dealer ID is partnerCode
            email: contactObject['Contact Email'] || contactObject['email'] || null,
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

    /**
     * Create or update car from contact object
     */
    async createOrUpdateCar(contactObject: any): Promise<any> {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');

        const dealerId = contactObject['Dealer ID'] || contactObject['dealerId'];
        const carId = contactObject['Car ID'] || contactObject['carId'];

        // Don't create car record if no dealerId or no carId
        if (!dealerId || !carId) {
            return null;
        }

        const carData = {
            id: contactObject['Car ID'] || contactObject['carId'] || null,
            licensePlateNumber: contactObject['License Plate Number'] || contactObject['licensePlateNumber'] || null,
            licensePlateProvince: contactObject['License Plate Province'] || contactObject['licensePlateProvince'] || null,
            dealerId: dealerId,
            dealerName: contactObject['Dealer Name'] || contactObject['dealerName'] || '',
            contactEmail: contactObject['Contact Email'] || contactObject['contactEmail'] || '',
            contactMobile: contactObject['Contact Mobile'] || contactObject['contactMobile'] || '',
            quickSaleId: contactObject['Quick Sale ID'] || contactObject['quickSaleId'] || null,
            code: contactObject['Code'] || contactObject['code'] || '',
            carStatusDescription: contactObject['Car Status Description'] || contactObject['carStatusDescription'] || null,
            carBrand: contactObject['Car Brand'] || contactObject['carBrand'] || null,
            carModel: contactObject['Car Model'] || contactObject['carModel'] || null,
            asking_price:
                contactObject['asking_price'] !== undefined
                    ? contactObject['asking_price']
                    : contactObject['ราคาประกาศขาย']
                    ? parseFloat(String(contactObject['ราคาประกาศขาย']).replace(/,/g, '')) || null
                    : null,
            bluebook_price:
                contactObject['bluebook_price'] !== undefined
                    ? contactObject['bluebook_price']
                    : contactObject['ราคา bluebook']
                    ? parseFloat(String(contactObject['ราคา bluebook']).replace(/,/g, '')) || null
                    : null,
            msrp_price:
                contactObject['msrp_price'] !== undefined
                    ? contactObject['msrp_price']
                    : contactObject['ราคาแนะนำ']
                    ? parseFloat(String(contactObject['ราคาแนะนำ']).replace(/,/g, '')) || null
                    : null,
            alName: contactObject['AL Name'] || contactObject['alName'] || null,
            alPhoneNumber: contactObject['AL Phone Number'] || contactObject['alPhoneNumber'] || null,
            createdAt: contactObject['parsedCreatedDate'] || contactObject['Created Date'] || new Date().toISOString(),
            createById: userData.userId || null, // ID of user who imports the data
        };

        try {
            const res: any = await firstValueFrom(this.carService.createOrUpdateCar(carData));
            const result = typeof res === 'string' ? JSON.parse(res) : res;
            return result;
        } catch (error) {
            console.error('Error creating/updating car:', error);
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
        // For lead import: must have contactId and Dealer ID (carId is optional - lead can exist without car)
        const validContacts = contactObjects.filter((contactObj: any) => {
            const contact = contactObj['contact'] || contactObj;
            const hasContactId = contact && contact.contactId;
            const hasDealerId = contactObj['Dealer ID'] || contactObj['dealerId'];

            // For lead import: must have contactId and dealerId (carId is optional)
            // For regular contact import: just need contactId
            if (hasDealerId) {
                // This is a lead - must have contactId (carId is optional)
                return hasContactId;
            } else {
                // Regular contact import - just need contactId
                return hasContactId;
            }
        });

        if (validContacts.length === 0) {
            console.warn('No valid contacts with contactId found');
            return;
        }

        // Pre-process: Collect all unique codes and create caseCode mapping to prevent duplicates
        const codeToCaseCodeIdMap: { [key: string]: string | null } = {};
        const uniqueCodes = new Set<string>();

        // Collect all unique codes from valid contacts
        validContacts.forEach((contactObj: any) => {
            const code = contactObj['Code'] || contactObj['code'];
            if (code && code.trim()) {
                uniqueCodes.add(code.trim());
            }
        });

        // Get all existing caseCodes and create mapping
        try {
            const caseCodes: any = await firstValueFrom(this.callService.getCaseCode());
            const parsedCodes = typeof caseCodes === 'string' ? JSON.parse(caseCodes) : caseCodes;
            const existingCodes = Array.isArray(parsedCodes) ? parsedCodes : [];

            // Map existing codes
            existingCodes.forEach((cc: any) => {
                if (cc.code && cc.id) {
                    codeToCaseCodeIdMap[cc.code] = cc.id.toString();
                }
            });

            // Create missing caseCodes sequentially to prevent duplicates
            for (const code of uniqueCodes) {
                if (!codeToCaseCodeIdMap[code]) {
                    try {
                        // Check again before creating (in case it was created by another process)
                        const caseCodesCheck: any = await firstValueFrom(this.callService.getCaseCode());
                        const parsedCodesCheck = typeof caseCodesCheck === 'string' ? JSON.parse(caseCodesCheck) : caseCodesCheck;
                        const existingCodesCheck = Array.isArray(parsedCodesCheck) ? parsedCodesCheck : [];
                        const matchedCode = existingCodesCheck.find((cc: any) => cc.code === code);

                        if (matchedCode && matchedCode.id) {
                            codeToCaseCodeIdMap[code] = matchedCode.id.toString();
                        } else {
                            // Create new caseCode if still not exists
                            const newCaseCode = await firstValueFrom(
                                this.callService.createCaseCode({ code, script: '', createdById: userData.userId }),
                            );
                            const parsedNewCode = typeof newCaseCode === 'string' ? JSON.parse(newCaseCode) : newCaseCode;
                            if (parsedNewCode && parsedNewCode.id) {
                                codeToCaseCodeIdMap[code] = parsedNewCode.id.toString();
                            }
                        }
                    } catch (error) {
                        console.error(`Error creating caseCode for code ${code}:`, error);
                        // Continue with other codes even if one fails
                    }
                }
            }
        } catch (error) {
            console.error('Error getting caseCodes:', error);
        }

        // Round Robin: distribute leads to agents in rotation
        await Promise.all(
            validContacts.map(async (contactObj: any, index: number) => {
                const contact = contactObj['contact'] || contactObj;

                // Round Robin: cycle through agents
                const agentIndex = index % this.agentAll.length;
                const assignedAgent = this.agentAll[agentIndex];

                // Map contact data to case data
                const result = await firstValueFrom(
                    this.contactService.getContactNumberIdByPhone(contactObj['phone_number'] || contact['phone_number'] || null),
                );
                const contactNumberId = (result as any[])[0]?.contactNumberId ?? null;

                // Get caseCodeId from Code using pre-built mapping
                let caseCodeId: string | null = null;
                const code = contactObj['Code'] || contactObj['code'];
                if (code && code.trim()) {
                    caseCodeId = codeToCaseCodeIdMap[code.trim()] || null;
                }

                // Parse requestDateTime - use car's createdAt if available, otherwise use parsedCreatedDate
                let requestDateTime = contactObj['requestDateTime'] || contact['requestDateTime'] || nowISO;
                if (contactObj['parsedCreatedDate']) {
                    requestDateTime = moment(contactObj['parsedCreatedDate']).toISOString();
                } else if (contactObj['car']?.createdAt) {
                    requestDateTime = moment(contactObj['car'].createdAt).toISOString();
                }

                // Get carId - prioritize from car object, then from contactObj
                const carId = contactObj['car']?.id || contactObj['carId'] || null;

                // Build description for lead (include car info if available)
                let description = contactObj['description'] || contact['description'] || '';
                if (contactObj['hasCarData'] && carId) {
                    const carInfo = [];
                    if (contactObj['License Plate Number']) {
                        carInfo.push(`ทะเบียน: ${contactObj['License Plate Number']}`);
                    }
                    if (contactObj['Car Brand'] && contactObj['Car Model']) {
                        carInfo.push(`รถ: ${contactObj['Car Brand']} ${contactObj['Car Model']}`);
                    }
                    if (contactObj['Car Status Description']) {
                        carInfo.push(`สถานะ: ${contactObj['Car Status Description']}`);
                    }
                    if (carInfo.length > 0) {
                        description = description ? `${description}\n${carInfo.join(', ')}` : carInfo.join(', ');
                    }
                }

                const caseData = {
                    caseId: null,
                    contactId: contact.contactId,
                    carId: carId, // Link case to car for lead management
                    channelId: contactObj['channelId'] || contact['channelId'] || 1, // 1 = Voice channel for leads
                    requestDateTime: requestDateTime,
                    description: description,
                    caseCodeId: caseCodeId, // From Code column
                    caseTypeId: contactObj['caseTypeId'] || contact['caseTypeId'] || null,
                    caseServiceGroupId: contactObj['caseServiceGroupId'] || contact['caseServiceGroupId'] || null,
                    caseServiceTypeId: contactObj['caseServiceTypeId'] || contact['caseServiceTypeId'] || null,
                    caseServiceSubTypeId: contactObj['caseServiceSubTypeId'] || contact['caseServiceSubTypeId'] || null,
                    operationType: contactObj['operationType'] || contact['operationType'] || this.outbound, // Outbound for leads
                    priority: contactObj['priority'] || contact['priority'] || null,
                    status: contactObj['status'] || contact['status'] || 1, // Default status = 1 (Open)
                    solution: contactObj['solution'] || contact['solution'] || null,
                    contactNumber: contactNumberId,
                    source: contactObj['source'] || contact['source'] || 'Excel Import',
                    assignedAt: nowISO,
                    createdAt: nowISO,
                    createdById: userData.userId,
                    modifiedAt: nowISO,
                    modifiedById: userData.userId,
                    isDeleted: 0,
                    assignedUserId: assignedAgent.userId, // Round Robin assignment
                    callStatus: null, // Initial call status is null (not called yet)
                    attemptCount: 0, // Initial attempt count is 0
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
