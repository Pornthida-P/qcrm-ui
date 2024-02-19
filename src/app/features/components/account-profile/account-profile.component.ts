import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { catchError, tap } from 'rxjs';
import { SweetAlertService } from 'src/app/services/sweet-alert/sweet-alert.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/shared/interface/user.interface';
import { Role } from 'src/app/shared/interface/role.interface';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';
import { SocketIoService } from 'src/app/services/socket-io/socket-io.service';

@Component({
    selector: 'app-account-profile',
    templateUrl: './account-profile.component.html',
    styleUrl: './account-profile.component.scss',
})
export class AccountProfileComponent {
    @Input() member?: User | null;
    @Input() mode?: 'add' | 'view' | 'edit';
    @ViewChild('imageElement') imageElement?: ElementRef<HTMLImageElement>;

    imageSrc?: File;
    roles: Role[] = [];
    isAction: boolean = false;
    userDataForm: FormGroup = new FormGroup({});
    userData: User | null = null;

    faXmark = faXmark;

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    usernameValidators = [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)];
    emailValidators = [Validators.required, Validators.email];

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private sweetalertServices: SweetAlertService,
        private socketIO: SocketIoService,
    ) {}

    ngOnInit(): void {
        this.findAllRoles();
        this.getDataUser();
        this.initializeForm();
    }

    initializeForm(): void {
        const isViewMode = this.mode === 'view';

        if (this.mode === 'add') {
            this.userDataForm = this.fb.group({
                userId: [''],
                username: ['', this.usernameValidators],
                email: ['', this.emailValidators],
                role: ['', Validators.required],
                profile: [''],
                lastLogin: [''],
                isActive: [''],
            });
        } else {
            this.userDataForm = this.fb.group({
                userId: [{ value: this.member?.userId, disabled: isViewMode || !this.isAction }, Validators.required],
                username: [{ value: this.member?.username, disabled: isViewMode }, this.usernameValidators],
                email: [{ value: this.member?.email, disabled: isViewMode }, this.emailValidators],
                role: [{ value: this.member?.role?.roleId, disabled: isViewMode || !this.isAction }, Validators.required],
                profile: [{ value: this.member?.profile, disabled: isViewMode }],
                lastLogin: [{ value: this.member?.lastLogin, disabled: true }],
                isActive: [{ value: this.member?.isActive, disabled: true }],
            });
        }
    }

    getDataUser(): void {
        this.userService
            .getDataUser()
            .pipe(
                tap((res: User | null) => {
                    this.userData = res;
                    this.isAction = res?.role.roleTitle.toLowerCase() === 'admin' ? true : false;
                }),
            )
            .subscribe(() => {});
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
                this.sweetalertServices.getSwal('warning', 'Warning', 'Please upload an image of type JPG, GIF, or PNG.', false, '');
                return;
            }

            if (file.size > config.file.maxSize) {
                this.sweetalertServices.getSwal('warning', 'Warning', 'Please upload an image with a size less than 2 MB.', false, '');
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
            this.sweetalertServices.getSwal('warning', 'Warning', 'Please fill in all required fields.', false, '');
            return;
        }

        await this.uploadProfileImage();

        const roleId = this.userDataForm.get('role')?.value;
        const role = this.roles.find((role) => role.roleId == roleId);

        if (!role) {
            this.sweetalertServices.getSwal('warning', 'Warning', 'Please select a role.', false, '');
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
            } catch (err) {
                this.sweetalertServices.handleError(err);
            }
        }
    }

    addUser(userData: User) {
        console.log(userData);
        this.userService
            .addUser(userData)
            .pipe(
                tap(() => {
                    this.sweetalertServices.getSwal('success', 'Success', 'User has been added successfully.', false, '');
                    this.userDataForm.markAsPristine();
                    this.userDataForm.markAsUntouched();
                }),
                catchError((err) => {
                    this.sweetalertServices.handleError(err);
                    throw err;
                }),
            )
            .subscribe();
    }

    updateUser(userData: User) {
        this.userService.updateUser(userData).subscribe(
            () => {
                this.sweetalertServices.getSwal('success', 'Success', 'User has been updated successfully.', false, '');
                this.userDataForm.markAsPristine();
                this.userDataForm.markAsUntouched();
            },
            (err) => {
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
}
