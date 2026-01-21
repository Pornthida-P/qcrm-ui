import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class SweetAlertService {
    constructor(private router: Router, private translate: TranslateService) {}

    getSwal(icon: any, title: string, text: string, showButton: boolean, route: string, queryParams?: any) {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            showConfirmButton: showButton,
            confirmButtonColor: '#fb5f20',
            timer: 1000,
            timerProgressBar: true,
        }).then(() => {
            if (route) {
                if (queryParams) {
                    setTimeout(() => this.router.navigate([`/${route}`], { queryParams }), 500);
                } else {
                    setTimeout(() => this.router.navigate([`/${route}`]), 500);
                }
            }
        });
    }

    confirmSwal(icon: any, title: string, text: string, confirmButtonText: string, cancelButtonText: string): any {
        return Swal.fire({
            icon: icon,
            title: title,
            text: text,
            showCancelButton: true,
            confirmButtonColor: '#fb5f20',
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
        });
    }

    contactSwal(icon: any, title: string, contacts: any, additionalParams?: any): any {
        const contactNum = localStorage.getItem('contactNum') || '';
        let contactList = '';
        contacts.forEach((contact: any) => {
            let url = `contacts/edit?key=${contact.contactId}&call_id=${contactNum}`;
            
            // Add additional params if provided (chatId, chatType, etc.)
            if (additionalParams) {
                if (additionalParams.chatid) url += `&chatid=${encodeURIComponent(additionalParams.chatid)}`;
                if (additionalParams.chattype) url += `&chattype=${encodeURIComponent(additionalParams.chattype)}`;
                if (additionalParams.displayName) url += `&displayName=${encodeURIComponent(additionalParams.displayName)}`;
                if (additionalParams.issue) url += `&issue=${encodeURIComponent(additionalParams.issue)}`;
                if (additionalParams.uuidLine) url += `&uuidLine=${encodeURIComponent(additionalParams.uuidLine)}`;
            }
            
            contactList += `<a href="${url}">${contact.fullname}</a><br>`;
        });
        const orYouMean = this.translate.instant('alert.orYouMean');
        return Swal.fire({
            icon: icon,
            title: title,
            html: `${orYouMean}<br>${contactList}`,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
    }

    // Helper methods for common alerts with auto-translation
    success(messageKey: string = 'alert.saveSuccess', route: string = '', queryParams?: any) {
        const title = this.translate.instant('alert.success');
        const text = this.translate.instant(messageKey);
        this.getSwal('success', title, text, false, route, queryParams);
    }

    error(messageKey: string = 'alert.error', route: string = '') {
        const title = this.translate.instant('alert.error');
        const text = this.translate.instant(messageKey);
        this.getSwal('error', title, text, false, route);
    }

    warning(messageKey: string, route: string = '') {
        const title = this.translate.instant('alert.warning');
        const text = this.translate.instant(messageKey);
        this.getSwal('warning', title, text, false, route);
    }

    confirmDelete(): Promise<any> {
        const title = this.translate.instant('alert.deleteConfirm');
        const confirmText = this.translate.instant('alert.confirm');
        const cancelText = this.translate.instant('alert.cancel');
        return this.confirmSwal('warning', title, '', confirmText, cancelText);
    }

    handleError(error: any) {
        let icon: string;
        let errorMessage: string;
        let title: string;
        let route: string = '';

        switch (error.status) {
            case 0:
                icon = 'error';
                title = this.translate.instant('alert.error');
                errorMessage = this.translate.instant('alert.connectionError');
                break;
            case 400:
                icon = 'error';
                title = this.translate.instant('alert.error');
                errorMessage = error.error.message || this.translate.instant('alert.error');
                break;
            case 401:
                icon = 'warning';
                title = this.translate.instant('alert.warning');
                errorMessage = error.error.message || this.translate.instant('alert.sessionExpired');
                route = 'logout';
                break;
            case 409:
                icon = 'warning';
                title = this.translate.instant('alert.warning');
                errorMessage = error.error.message || this.translate.instant('alert.emailAlreadyExists');
                break;
            default:
                icon = 'error';
                title = this.translate.instant('alert.error');
                errorMessage = this.translate.instant('alert.networkError');
                route = '';
                break;
        }

        this.getSwal(icon, title, errorMessage, false, route);
    }
}
