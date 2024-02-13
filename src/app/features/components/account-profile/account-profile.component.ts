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

@Component({
    selector: 'app-account-profile',
    templateUrl: './account-profile.component.html',
    styleUrl: './account-profile.component.scss',
})
export class AccountProfileComponent {
    @Input() userData?: User | null;
    @Input() mode?: 'add' | 'view' | 'edit';
    @ViewChild('imageElement') imageElement?: ElementRef<HTMLImageElement>;

    imageSrc?: File;
    roles: Role[] = [];

    userDataForm: FormGroup = new FormGroup({});

    faXmark = faXmark;

    profileError: string = './assets/nea-qcrm-ui/image/profile/user.jpg';

    constructor(private fb: FormBuilder, private userService: UserService, private sweetalertServices: SweetAlertService) {}

    ngOnInit(): void {
        this.initializeForm();
        this.findAllRoles();
    }

    initializeForm(): void {
        const isViewMode = this.mode === 'view';
        const isRole = this.userData?.role?.roleTitle.toLocaleLowerCase() !== 'admin';

        if (this.mode === 'add') {
            this.userDataForm = this.fb.group({
                userId: [''],
                username: ['', Validators.required],
                email: ['', Validators.required],
                role: ['', Validators.required],
                profile: [''],
            });
        } else {
            this.userDataForm = this.fb.group({
                userId: [{ value: this.userData?.userId, disabled: isViewMode || isRole }, Validators.required],
                username: [{ value: this.userData?.username, disabled: isViewMode }, Validators.required],
                email: [{ value: this.userData?.email, disabled: isViewMode }, Validators.required],
                role: [{ value: this.userData?.role?.roleId, disabled: isViewMode || isRole }, Validators.required],
                profile: [{ value: this.userData?.profile, disabled: isViewMode }],
            });
        }
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

            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
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
            userId: this.userData?.userId || '',
            username: this.userDataForm.get('username')?.value,
            email: this.userDataForm.get('email')?.value,
            role: role,
            profile: this.userDataForm.get('profile')?.value,
        };

        if (this.mode === 'edit') {
            this.updateUser(userData);
        }
    }

    async uploadProfileImage() {
        if (this.imageSrc) {
            const filename = this.imageSrc.name;
            const userId = this.userData?.userId || '';
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

    updateUser(userData: User) {
        this.userService
            .updateUser(userData)
            .subscribe(
                () => {
                    this.userService.setDataUser(userData);
                    this.sweetalertServices.getSwal('success', 'Success', 'User has been updated successfully.', false, '');
                    this.userDataForm.markAsPristine();
                    this.userDataForm.markAsUntouched();
                },
                (err) => {
                    this.sweetalertServices.handleError(err);
                },
            )
            .add(() => {
                this.userDataForm.enable();
            });
    }

    handleProfileError(event: any) {
        if (event) {
            event.target.src = this.profileError;
        }
    }
}
