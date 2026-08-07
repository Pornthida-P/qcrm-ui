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
import { config } from 'src/app/config/config';
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
    isDragOver = false;
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
                await this.validateTopicAndSubject();
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
                    await this.validateTopicAndSubject();
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

    private isPhoneHeader(header: string): boolean {
        const h = String(header || '')
            .toLowerCase()
            .trim();
        return (
            h.includes('phone') ||
            h.includes('mobile') ||
            h.includes('number') ||
            h.includes('โทร') ||
            h.includes('เบอร์')
        );
    }

    /** Normalize Thai mobile numbers from Excel/CSV (e.g. 957088486, '0957088486). */
    private normalizePhoneNumber(raw: any): string | null {
        if (raw === undefined || raw === null || raw === '') {
            return null;
        }

        let phone = String(raw).trim();
        // Excel text/formula wrappers: '0957..., ="0957..., ="0957..."
        phone = phone.replace(/^'+/, '').replace(/^="+|"+$/g, '').replace(/^=/, '').trim();
        // Keep digits only (drop spaces, dashes, parentheses)
        phone = phone.replace(/[^\d]/g, '');

        if (!phone) {
            return null;
        }

        // +66 / 66 country code → local 0xxxxxxxxx
        if (phone.startsWith('66') && phone.length >= 11) {
            phone = '0' + phone.slice(2);
        }

        // 9 digits starting 6-9 (missing leading 0) → 0xxxxxxxxx
        if (/^[6-9]\d{8}$/.test(phone)) {
            phone = '0' + phone;
        }
        // 8 digits → pad leading 0 (legacy)
        else if (/^[1-9]\d{7}$/.test(phone)) {
            phone = '0' + phone;
        }

        return phone || null;
    }

    private pad2(n: number): string {
        return String(n).padStart(2, '0');
    }

    private toMysqlDateTime(date: Date): string {
        return (
            `${date.getFullYear()}-${this.pad2(date.getMonth() + 1)}-${this.pad2(date.getDate())} ` +
            `${this.pad2(date.getHours())}:${this.pad2(date.getMinutes())}:${this.pad2(date.getSeconds())}`
        );
    }

    /** Parse Excel/CSV Created Date into MySQL datetime string. */
    private parseImportDateTime(raw: any): string | null {
        if (raw === undefined || raw === null || raw === '') {
            return null;
        }

        if (raw instanceof Date && !isNaN(raw.getTime())) {
            return this.toMysqlDateTime(raw);
        }

        // Excel serial date (e.g. 45841.4167)
        if (typeof raw === 'number' && isFinite(raw)) {
            try {
                const parsed = (XLSX as any).SSF?.parse_date_code?.(raw);
                if (parsed) {
                    const date = new Date(
                        parsed.y,
                        (parsed.m || 1) - 1,
                        parsed.d || 1,
                        parsed.H || 0,
                        parsed.M || 0,
                        Math.floor(parsed.S || 0),
                    );
                    if (!isNaN(date.getTime())) {
                        return this.toMysqlDateTime(date);
                    }
                }
            } catch {
                // fall through
            }
            // Fallback: Excel epoch (1899-12-30)
            const excelEpoch = Date.UTC(1899, 11, 30);
            const date = new Date(excelEpoch + raw * 24 * 60 * 60 * 1000);
            if (!isNaN(date.getTime())) {
                return this.toMysqlDateTime(date);
            }
            return null;
        }

        const str = String(raw).trim();
        if (!str) {
            return null;
        }

        // dd/MM/yyyy [HH:mm[:ss]]
        const dmy = str.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
        );
        if (dmy) {
            const date = new Date(
                Number(dmy[3]),
                Number(dmy[2]) - 1,
                Number(dmy[1]),
                Number(dmy[4] || 0),
                Number(dmy[5] || 0),
                Number(dmy[6] || 0),
            );
            return isNaN(date.getTime()) ? null : this.toMysqlDateTime(date);
        }

        // yyyy-MM-dd [HH:mm[:ss]] or ISO
        const ymd = str.match(
            /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/,
        );
        if (ymd) {
            const date = new Date(
                Number(ymd[1]),
                Number(ymd[2]) - 1,
                Number(ymd[3]),
                Number(ymd[4] || 0),
                Number(ymd[5] || 0),
                Number(ymd[6] || 0),
            );
            return isNaN(date.getTime()) ? null : this.toMysqlDateTime(date);
        }

        const native = new Date(str);
        if (!isNaN(native.getTime())) {
            return this.toMysqlDateTime(native);
        }

        return null;
    }

    private processContactData(data: any[]): any[] {
        if (!data || data.length === 0) return data;

        // First row is header
        const headers = data[0];
        const phoneNumberIndex = headers.findIndex((h: string) => this.isPhoneHeader(h));

        if (phoneNumberIndex === -1) {
            console.warn('Phone number column not found');
            return data;
        }

        // Process each row starting from index 1 (skip header)
        return data.map((row: any[], rowIndex: number) => {
            if (rowIndex === 0) return row; // Keep header as is

            if (row[phoneNumberIndex] !== undefined && row[phoneNumberIndex] !== null && row[phoneNumberIndex] !== '') {
                row[phoneNumberIndex] = this.normalizePhoneNumber(row[phoneNumberIndex]);
            }

            return row;
        });
    }

    onUploadFile(event: any) {
        const file = event?.target?.files?.[0];
        if (file) {
            this.handleUploadedFile(file);
        }
        if (event?.target) {
            event.target.value = '';
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;
    }

    onDropFile(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;

        const file = event.dataTransfer?.files?.[0];
        if (file) {
            this.handleUploadedFile(file);
        }
    }

    private handleUploadedFile(file: File) {
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
        }
    }

    downloadTemplate() {
        const headers = [
            'First Name',
            'Last Name',
            'Contact Email',
            'Contact Mobile',
            'Topic',
            'Subject',
            'description',
            'Created Date',
            'province',
        ];
        const sampleRows = [
            [
                'สมชาย',
                'ใจดี',
                'somchai@example.com',
                '0812345678',
                'หัวข้อตัวอย่าง',
                'เรื่องตัวอย่าง',
                'รายละเอียดเคสตัวอย่าง',
                '07/08/2026 10:00',
                'กรุงเทพมหานคร',
            ],
            [
                'สมหญิง',
                'รักดี',
                'somying@example.com',
                '0898765432',
                'หัวข้อตัวอย่าง',
                'เรื่องตัวอย่าง',
                'ติดตามผล',
                '07/08/2026 11:30',
                'เชียงใหม่',
            ],
        ];
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
        worksheet['!cols'] = headers.map((header) => ({ wch: Math.max(14, header.length + 2) }));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Import');
        XLSX.writeFile(workbook, 'case-import-template.xlsx');
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
                        // For phone columns, keep as normalized string
                        if (this.isPhoneHeader(header)) {
                            contactObj[header] = this.normalizePhoneNumber(value);
                        } else {
                            // For other fields, keep original type or convert to string
                            contactObj[header] = typeof value === 'string' ? value.trim() : value;
                        }
                    }
                }
            });

            // Name: first + last, or a single name column
            const firstName = contactObj['firstname'] || contactObj['firstName'] || contactObj['First Name'] || '';
            const lastName = contactObj['lastname'] || contactObj['lastName'] || contactObj['Last Name'] || '';
            const singleName =
                contactObj['name'] || contactObj['Name'] || contactObj['fullname'] || contactObj['Contact Name'] || '';
            const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || String(singleName || '').trim();
            contactObj['name'] = fullName || null;
            if (firstName) {
                contactObj['firstName'] = String(firstName).trim();
            } else if (fullName) {
                const parts = fullName.split(/\s+/);
                contactObj['firstName'] = parts[0];
                contactObj['lastName'] = parts.slice(1).join(' ') || null;
            }
            if (lastName) {
                contactObj['lastName'] = String(lastName).trim();
            }

            if (
                contactObj['Created Date'] !== undefined &&
                contactObj['Created Date'] !== null &&
                contactObj['Created Date'] !== ''
            ) {
                contactObj['parsedCreatedDate'] = this.parseImportDateTime(contactObj['Created Date']);
            } else if (contactObj['createdDate'] || contactObj['created_date'] || contactObj['createdAt']) {
                contactObj['parsedCreatedDate'] = this.parseImportDateTime(
                    contactObj['createdDate'] || contactObj['created_date'] || contactObj['createdAt'],
                );
            }

            const phoneRaw =
                contactObj['Contact Mobile'] ||
                contactObj['phone_number'] ||
                contactObj['phoneNumber'] ||
                contactObj['Phone'] ||
                contactObj['Mobile'] ||
                null;
            if (phoneRaw) {
                const phone = this.normalizePhoneNumber(phoneRaw);
                contactObj['Contact Mobile'] = phone;
                contactObj['phone_number'] = phone;
            }

            const emailRaw = contactObj['Contact Email'] || contactObj['email'] || contactObj['Email'] || null;
            if (emailRaw) {
                contactObj['email'] = String(emailRaw).trim();
            }

            contactObjects.push(contactObj);
        }

        return contactObjects;
    }

    // Check contact data without calling API (only for status preview)
    async checkContactData() {
        for (const contactObject of this.contactObjects) {
            try {
                const phone = contactObject['phone_number'] || contactObject['Contact Mobile'];
                if (phone) {
                    const phoneRes: any = await this.contactService.getContactsByParamPhone(phone).toPromise();
                    const phoneContacts = typeof phoneRes === 'string' ? JSON.parse(phoneRes) : phoneRes;
                    if (phoneContacts && Array.isArray(phoneContacts) && phoneContacts.length > 0) {
                        contactObject['contact'] = phoneContacts[0];
                        const newEmail = contactObject['Contact Email'] || contactObject['email'] || null;
                        const existingEmail = phoneContacts[0].email || null;
                        const emailDifferent = newEmail !== null && existingEmail !== null && newEmail !== existingEmail;

                        if (emailDifferent) {
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
                    const emailContacts = await this.searchContactByEmail(email);
                    if (emailContacts && emailContacts.length > 0) {
                        contactObject['contact'] = emailContacts[0];
                        contactObject['import-status'] = 'found';
                        continue;
                    }
                }

                if (name) {
                    const nameContacts = await this.searchContactByName(name);
                    if (nameContacts && nameContacts.length > 0) {
                        contactObject['contact'] = nameContacts[0];
                        const phoneDifferent = nameContacts[0].contactNumber !== contactObject['phone_number'];
                        const newEmail = contactObject['Contact Email'] || contactObject['email'] || null;
                        const existingEmail = nameContacts[0].email || null;
                        const emailDifferent = newEmail !== null && existingEmail !== null && newEmail !== existingEmail;

                        if (phoneDifferent || emailDifferent) {
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

        const invalidRows = this.contactObjects.filter((row) => row['topicSubjectInvalid'] || row['import-status'] === 'warning');
        if (invalidRows.length > 0) {
            this.sweetAlertService.getSwal(
                'warning',
                this.translate.instant('alert.warning') || 'Warning',
                this.topicSubjectWarningMessage(invalidRows.length),
                true,
                '',
            );
            return;
        }

        this.isImporting = true;
        let successCount = 0;
        let errorCount = 0;

        try {
            for (const contactObject of this.contactObjects) {
                let importStatus = contactObject['import-status'];
                try {
                    if (importStatus === 'found') {
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
        const currentUser = await firstValueFrom(this.userService.getDataUser());
        const userId = currentUser?.userId ?? '';
        const contact = contactObject['contact'] || {};
        const data = {
            contactId: contact.contactId,
            firstName: contactObject['firstName'] || contactObject['firstname'] || contact.firstName || '',
            lastName: contactObject['lastName'] || contactObject['lastname'] || contact.lastName || '',
            gender: contactObject['gender'] || contact.gender || 'unknown',
            organizationId: contactObject['organizationId'] || contact.organizationId || null,
            contactType: contactObject['contactType'] || contact.contactType || null,
            contactNumber: contact.contactNumber || '',
            contactNumber2: contactObject['contactNumber2'] || contact.contactNumber2 || '',
            province: contactObject['province'] || contactObject['Province'] || contact.province || null,
            modifiedById: userId,
            contactNumNew: contactObject['phone_number'] || contactObject['phoneNumber'] || contactObject['Contact Mobile'] || '',
            email: contactObject['email'] || contactObject['Contact Email'] || null,
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
        const currentUser = await firstValueFrom(this.userService.getDataUser());
        const userId = currentUser?.userId ?? '';

        const firstName = contactObject['firstName'] || contactObject['firstname'] || '';
        const lastName = contactObject['lastName'] || contactObject['lastname'] || '';
        const displayName = contactObject['name'] || [firstName, lastName].filter(Boolean).join(' ').trim() || 'ไม่ทราบชื่อ';

        const data = {
            firstName: firstName || displayName.split(/\s+/)[0] || 'ไม่ทราบชื่อ',
            lastName: lastName || displayName.split(/\s+/).slice(1).join(' ') || null,
            gender: contactObject['gender'] || 'unknown',
            organizationId: contactObject['organizationId'] || null,
            contactType: contactObject['contactType'] || null,
            contactNumber: contactObject['phone_number'] || contactObject['phoneNumber'] || contactObject['Contact Mobile'] || '',
            contactNumber2: contactObject['contactNumber2'] || '',
            chatId: contactObject['chatId'] || '',
            chatType: contactObject['chatType'] || '',
            displayName,
            province: contactObject['province'] || contactObject['Province'] || null,
            createdById: userId,
            email: contactObject['email'] || contactObject['Contact Email'] || null,
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
        if (status === 'warning') {
            const key = 'contact-import-management.status.warning';
            const translated = this.translate.instant(key);
            return !translated || translated === key ? 'แจ้งเตือน' : translated;
        }
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

    hasTopicSubjectErrors(): boolean {
        return this.contactObjects.some((row) => row['topicSubjectInvalid'] || row['import-status'] === 'warning');
    }

    private getTopicKey(row: any): string {
        const raw = row?.['Topic'] || row?.['topic'] || row?.['Code'] || row?.['code'] || row?.['caseTopic'] || '';
        return String(raw || '').trim();
    }

    private getSubjectKey(row: any): string {
        const raw = row?.['Subject'] || row?.['subject'] || row?.['caseSubject'] || row?.['เรื่อง'] || '';
        return String(raw || '').trim();
    }

    private async loadTopicSubjectMaps(): Promise<{
        topicMap: { [key: string]: string };
        subjectMap: { [key: string]: { id: string; caseTopicId: string | null } };
    }> {
        const topicMap: { [key: string]: string } = {};
        const subjectMap: { [key: string]: { id: string; caseTopicId: string | null } } = {};

        try {
            const caseTopics: any = await firstValueFrom(this.callService.getCaseTopics());
            const parsedTopics = typeof caseTopics === 'string' ? JSON.parse(caseTopics) : caseTopics;
            const existingTopics = Array.isArray(parsedTopics) ? parsedTopics : [];

            existingTopics.forEach((topic: any) => {
                const topicId = topic.caseTopicId ?? topic.id;
                if (!topicId) {
                    return;
                }
                if (topic.code) {
                    topicMap[String(topic.code).trim().toLowerCase()] = String(topicId);
                }
                if (topic.name) {
                    topicMap[String(topic.name).trim().toLowerCase()] = String(topicId);
                }
            });

            const caseSubjects: any = await firstValueFrom(this.callService.getCaseSubjects());
            const parsedSubjects = typeof caseSubjects === 'string' ? JSON.parse(caseSubjects) : caseSubjects;
            const existingSubjects = Array.isArray(parsedSubjects) ? parsedSubjects : [];
            existingSubjects.forEach((subject: any) => {
                const subjectId = subject.caseSubjectId ?? subject.id;
                if (!subjectId || !subject.name) {
                    return;
                }
                subjectMap[String(subject.name).trim().toLowerCase()] = {
                    id: String(subjectId),
                    caseTopicId: subject.caseTopicId != null ? String(subject.caseTopicId) : null,
                };
            });
        } catch (error) {
            console.error('Error getting case topics/subjects:', error);
        }

        return { topicMap, subjectMap };
    }

    private resolveTopicSubject(
        row: any,
        topicMap: { [key: string]: string },
        subjectMap: { [key: string]: { id: string; caseTopicId: string | null } },
    ): { caseTopicId: string | null; caseSubjectId: string | null; warning: string | null } {
        const topicKey = this.getTopicKey(row);
        const subjectKey = this.getSubjectKey(row);
        const pleaseFill = this.pleaseEnterTopicSubjectMessage();

        if (!topicKey || !subjectKey) {
            return { caseTopicId: null, caseSubjectId: null, warning: pleaseFill };
        }

        const caseTopicId = topicMap[topicKey.toLowerCase()] || null;
        const subject = subjectMap[subjectKey.toLowerCase()] || null;
        const caseSubjectId = subject?.id || null;

        if (!caseTopicId || !caseSubjectId || (subject?.caseTopicId && subject.caseTopicId !== caseTopicId)) {
            return { caseTopicId: null, caseSubjectId: null, warning: pleaseFill };
        }

        return { caseTopicId, caseSubjectId, warning: null };
    }

    private async validateTopicAndSubject(): Promise<void> {
        const { topicMap, subjectMap } = await this.loadTopicSubjectMaps();
        let invalidCount = 0;

        this.contactObjects.forEach((row) => {
            const resolved = this.resolveTopicSubject(row, topicMap, subjectMap);
            row['resolvedCaseTopicId'] = resolved.caseTopicId;
            row['resolvedCaseSubjectId'] = resolved.caseSubjectId;

            if (resolved.warning) {
                invalidCount++;
                row['topicSubjectInvalid'] = true;
                row['import-error'] = resolved.warning;
                row['import-status'] = 'warning';
            } else {
                row['topicSubjectInvalid'] = false;
                row['import-error'] = null;
            }
        });

        if (invalidCount > 0) {
            this.sweetAlertService.getSwal(
                'warning',
                this.translate.instant('alert.warning') || 'Warning',
                this.topicSubjectWarningMessage(invalidCount),
                true,
                '',
            );
        }
    }

    private pleaseEnterTopicSubjectMessage(): string {
        const key = 'contact-import-management.please-enter-topic-subject';
        const translated = this.translate.instant(key);
        if (!translated || translated === key) {
            return 'กรุณาใส่หัวข้อและเรื่อง';
        }
        return translated;
    }

    private topicSubjectWarningMessage(count: number): string {
        const key = 'contact-import-management.invalid-topic-subject';
        const translated = this.translate.instant(key, { count });
        if (!translated || translated === key) {
            return `พบ ${count} รายการ กรุณาใส่หัวข้อและเรื่องให้ตรงกับในระบบก่อนยืนยันนำเข้า`;
        }
        return translated;
    }

    getAgentAll() {
        return new Promise<void>((resolve) => {
            this.userService.getAllUser().subscribe((res: any) => {
                if (res && Array.isArray(res)) {
                    // Filter only active agents
                    this.agentAll = res.filter((agent: any) => agent.role?.roleTitle?.toLowerCase() === 'agent' && agent.isActive === 1);
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

        let currentUser = await firstValueFrom(this.userService.getDataUser());
        let userId = currentUser?.userId ?? '';
        if (!userId) {
            this.userService.refreshFromStorage();
            currentUser = await firstValueFrom(this.userService.getDataUser());
            userId = currentUser?.userId ?? '';
        }
        if (!userId) {
            this.sweetAlertService.getSwal(
                'error',
                this.translate.instant('alert.error'),
                this.translate.instant('contact-import-management.error-user-required') ||
                    'Unable to get current user. Please sign in again.',
                true,
                '',
            );
            return;
        }
        const casePromises: any[] = [];

        // Filter only contacts that have been successfully imported (have contactId + valid topic/subject)
        const validContacts = contactObjects.filter((contactObj: any) => {
            const contact = contactObj['contact'] || contactObj;
            return (
                contact &&
                contact.contactId &&
                !contactObj['topicSubjectInvalid'] &&
                contactObj['import-status'] !== 'warning' &&
                contactObj['import-status'] !== 'error' &&
                contactObj['resolvedCaseTopicId'] &&
                contactObj['resolvedCaseSubjectId']
            );
        });

        if (validContacts.length === 0) {
            console.warn('No valid contacts with contactId/topic/subject found');
            return;
        }

        // Round Robin: distribute cases to agents
        await Promise.all(
            validContacts.map(async (contactObj: any, index: number) => {
                const contact = contactObj['contact'] || contactObj;

                const agentIndex = index % this.agentAll.length;
                const assignedAgent = this.agentAll[agentIndex];

                const result = await firstValueFrom(
                    this.contactService.getContactNumberIdByPhone(contactObj['phone_number'] || contact['phone_number'] || null),
                );
                const contactNumberId = (result as any[])[0]?.contactNumberId ?? null;

                const caseTopicId = contactObj['resolvedCaseTopicId'] || null;
                const caseSubjectId = contactObj['resolvedCaseSubjectId'] || null;

                const nowMysql = this.toMysqlDateTime(new Date());
                let requestDateTime = nowMysql;
                if (contactObj['parsedCreatedDate']) {
                    requestDateTime = contactObj['parsedCreatedDate'];
                }

                const description = contactObj['description'] || contact['description'] || contactObj['Description'] || '';

                const caseData = {
                    caseId: null,
                    contactId: contact.contactId,
                    channelId: contactObj['channelId'] || contact['channelId'] || 1,
                    requestDateTime: requestDateTime,
                    description: description,
                    caseTopicId,
                    caseSubjectId,
                    caseTypeId: contactObj['caseTypeId'] || contact['caseTypeId'] || null,
                    operationType: contactObj['operationType'] || contact['operationType'] || this.outbound,
                    status: contactObj['status'] || contact['status'] || 1,
                    solution: contactObj['solution'] || contact['solution'] || null,
                    contactNumber: contactNumberId,
                    source: contactObj['source'] || contact['source'] || 'Excel Import',
                    assignedAt: nowMysql,
                    createdAt: nowMysql,
                    createdById: userId,
                    modifiedAt: nowMysql,
                    modifiedById: userId,
                    isDeleted: 0,
                    assignedUserId: assignedAgent.userId,
                    callStatus: null,
                    attemptCount: 0,
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
