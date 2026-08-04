import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { catchError, finalize, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';
import { Role } from 'src/app/shared/interface/role.interface';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { AuditLogService } from 'src/app/services/audit-log/audit-log.service';
import { TranslateService } from '@ngx-translate/core';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
    selector: 'app-account-profile',
    templateUrl: './account-profile.component.html',
    styleUrl: './account-profile.component.scss',
})
export class AccountProfileComponent {
    @Input() member?: User | null;
    @Input() mode?: 'add' | 'view' | 'edit';
    @ViewChild('imageElement') imageElement?: ElementRef<HTMLImageElement>;
    @Input() isAction: boolean = false;
    @Output() onSaveSuccess = new EventEmitter<void>();

    imageSrc?: File;
    roles: Role[] = [];
    chatChannels: any[] = [];
    selectedChannelKeys: string[] = [];
    userDataForm: FormGroup = new FormGroup({});
    userData?: User | null;
    readonly chatEnabled = !!environment.features?.chatEnabled;

    faXmark = faXmark;

    profileError: string = './assets/qcrm-ui/image/profile/user.jpg';

    usernameValidators = [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)];
    emailValidators = [Validators.required, Validators.email];

    constructor(
        private fb: FormBuilder,
        private loaderService: LoaderService,
        private userService: UserService,
        private sweetalertServices: SweetAlertService,
        private socketIO: SocketIoService,
        private auditLogService: AuditLogService,
        private translate: TranslateService,
        private chatService: ChatService,
    ) {}

    ngOnInit(): void {
        this.findAllRoles();
        this.getDataUser();
        this.loadChatChannels();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        this.isAction = changes['isAction']?.currentValue ?? this.isAction;
        console.log(this.isAction);
        this.initializeForm();
        this.selectedChannelKeys = this.normalizeChannelKeys(this.member?.channelKeys);
    }

    initializeForm(): void {
        const isViewMode = this.mode === 'view';

        if (this.mode === 'add') {
            this.selectedChannelKeys = [];
            this.userDataForm = this.fb.group({
                userId: [''],
                username: ['', this.usernameValidators],
                email: ['', this.emailValidators],
                role: ['', Validators.required],
                profile: [''],
                lastLogin: [''],
                isActive: [1],
            });
        } else {
            this.selectedChannelKeys = this.normalizeChannelKeys(this.member?.channelKeys);
            this.userDataForm = this.fb.group({
                userId: [{ value: this.member?.userId, disabled: isViewMode || !this.isAction }, Validators.required],
                username: [{ value: this.member?.username, disabled: isViewMode }, this.usernameValidators],
                email: [{ value: this.member?.email, disabled: isViewMode }, this.emailValidators],
                role: [{ value: this.member?.role?.roleId, disabled: isViewMode || !this.isAction }, Validators.required],
                profile: [{ value: this.member?.profile, disabled: isViewMode }],
                lastLogin: [{ value: this.member?.lastLogin, disabled: true }],
                isActive: [{ value: this.member?.isActive ?? 1, disabled: isViewMode || !this.isAction }],
            });
        }
    }

    getDataUser(): void {
        this.userService
            .getDataUser()
            .pipe(
                tap((res: User | null) => {
                    this.userData = res;
                }),
            )
            .subscribe(() => {});
    }

    loadChatChannels(): void {
        if (!this.chatEnabled) {
            this.chatChannels = [];
            return;
        }
        this.chatService.listChannels().subscribe({
            next: (channels) => {
                this.chatChannels = Array.isArray(channels)
                    ? channels.filter((c) => c?.channelKey && Number(c?.isActive) !== 0)
                    : [];
            },
            error: () => {
                this.chatChannels = [];
            },
        });
    }

    isChannelSelected(channelKey: string): boolean {
        return this.selectedChannelKeys.includes(channelKey);
    }

    onChannelToggle(channelKey: string, event: Event): void {
        if (this.mode === 'view') {
            return;
        }
        const checked = (event.target as HTMLInputElement).checked;
        if (checked) {
            if (!this.selectedChannelKeys.includes(channelKey)) {
                this.selectedChannelKeys = [...this.selectedChannelKeys, channelKey];
            }
        } else {
            this.selectedChannelKeys = this.selectedChannelKeys.filter((k) => k !== channelKey);
        }
        this.userDataForm.markAsDirty();
    }

    channelLabel(channel: any): string {
        return channel?.displayName || channel?.channelName || channel?.channelType || channel?.channelKey || 'Channel';
    }

    findAllRoles(): void {
        this.userService
            .findAllRoles()
            .pipe(
                tap((res: Role[]) => {
                    this.roles = res;
                }),
                catchError((err) => {
                    this.sweetalertServices.handleError(err);
                    throw err;
                }),
            )
            .subscribe();
    }

    onFileChanged(event: any) {
        const file = event.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                this.sweetalertServices.warning('alert.pleaseUploadValidImage');
                return;
            }

            if (file.size > config.file.maxSize) {
                this.sweetalertServices.warning('alert.pleaseUploadSmallerImage');
                return;
            }

            this.imageSrc = file;
            this.userDataForm.markAsDirty();

            const reader = new FileReader();
            reader.onload = (e: any) => {
                const uploadedImageSrc = e.target.result;
                if (this.imageElement) {
                    this.imageElement.nativeElement.src = uploadedImageSrc;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    async onClickSave() {
        if (!this.userDataForm.valid) {
            this.sweetalertServices.warning('alert.pleaseFillAllFields');
            return;
        }

        await this.uploadProfileImage();

        const roleId = this.userDataForm.get('role')?.value;
        const role = this.roles.find((role) => role.roleId == roleId);

        if (!role) {
            this.sweetalertServices.warning('alert.pleaseSelectRole');
            return;
        }

        const userData: User = {
            userId: this.userDataForm.get('userId')?.value,
            username: this.userDataForm.get('username')?.value,
            email: this.userDataForm.get('email')?.value,
            role: role,
            profile: this.userDataForm.get('profile')?.value,
            lastLogin: this.userDataForm.get('lastLogin')?.value,
            isActive: this.userDataForm.get('isActive')?.value,
            channelKeys: [...this.selectedChannelKeys],
        };

        if (this.mode === 'edit') {
            this.updateUser(userData);
        }

        if (this.mode === 'add') {
            this.addUser(userData);
        }
    }

    async uploadProfileImage() {
        if (this.imageSrc) {
            const filename = this.imageSrc.name;
            const userId = this.member?.userId || '';
            const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
            const createdById = this.userData?.userId || '';

            try {
                const image = await this.userService
                    .uploadProfileImage(this.imageSrc, filename, userId, createdAt, createdById)
                    .toPromise();
                if (image.filepath) {
                    image.filepath = `${environment.api.url}${image.filepath}`;
                    this.userDataForm.get('profile')?.setValue(image.filepath);
                }
                this.auditLogService.log('', 'Account', '', 'Upload Image', `Path: ${image.filepath}`, `Success`);
            } catch (err) {
                this.auditLogService.log('', 'Account', '', 'Upload Image', `File Name : ${filename}`, `Failed ${err}`);
                this.sweetalertServices.handleError(err);
            }
        }
    }

    addUser(userData: User) {
        this.loaderService.show();
        this.userService
            .addUser(userData)
            .pipe(
                tap(() => {
                    this.sweetalertServices.success('alert.userAddedSuccess');
                    this.userDataForm.markAsPristine();
                    this.userDataForm.markAsUntouched();
                    this.auditLogService.log(
                        '',
                        'Account',
                        '',
                        'Add',
                        `Username : ${userData.username}, Role : ${userData.role.roleTitle}, Email : ${userData.email}, isActive: ${userData.isActive}, channels: ${(userData.channelKeys || []).join(',')}`,
                        `Success`,
                    );
                    this.onSaveSuccess.emit();
                }),
                catchError((err) => {
                    this.auditLogService.log('', 'Account', '', 'Add', `Username : ${userData.username}`, `Failed ${err}`);
                    this.sweetalertServices.handleError(err);
                    throw err;
                }),
                finalize(() => {
                    this.loaderService.hide();
                }),
            )
            .subscribe();
    }

    updateUser(userData: User) {
        this.userService.updateUser(userData).subscribe(
            () => {
                this.sweetalertServices.success('alert.userUpdatedSuccess');
                this.userDataForm.markAsPristine();
                this.userDataForm.markAsUntouched();
                this.auditLogService.log(
                    '',
                    'Account',
                    '',
                    'Edit',
                    `Username : ${userData.username}, Role : ${userData.role.roleTitle}, Email : ${userData.email}, Profile: ${userData.profile}, isActive: ${userData.isActive}, channels: ${(userData.channelKeys || []).join(',')}`,
                    `Success`,
                );
                this.onSaveSuccess.emit();
            },
            (err) => {
                this.auditLogService.log('', 'Account', '', 'Edit', `Username : ${userData.username}`, `Failed`);
                this.sweetalertServices.handleError(err);
            },
        );
    }

    getStatusOnline(userId?: string): boolean {
        return this.socketIO.getStatusOnline(userId);
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }

    onIsActiveChange(event: any) {
        const isChecked = event.target.checked;
        this.userDataForm.get('isActive')?.setValue(isChecked ? 1 : 0);
        this.userDataForm.markAsDirty();
    }

    private normalizeChannelKeys(value: unknown): string[] {
        if (Array.isArray(value)) {
            return value.map((v) => String(v).trim()).filter(Boolean);
        }
        if (typeof value === 'string' && value.trim()) {
            return value
                .split(',')
                .map((v) => v.trim())
                .filter(Boolean);
        }
        return [];
    }
}
