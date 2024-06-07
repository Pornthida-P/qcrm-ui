import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class SweetAlertService {
    constructor(private router: Router) {}

    getSwal(icon: any, title: string, text: string, showButton: boolean, route: string) {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            showConfirmButton: showButton,
            confirmButtonColor: '#0a6ebd',
            timer: 2000,
            timerProgressBar: true,
        }).then(() => {
            if (route) {
                setTimeout(() => this.router.navigate([`/${route}`]), 500);
            }
        });
    }

    confirmSwal(icon: any, title: string, text: string, confirmButtonText: string, cancelButtonText: string): any {
        return Swal.fire({
            icon: icon,
            title: title,
            text: text,
            showCancelButton: true,
            confirmButtonColor: '#0a6ebd',
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
        });
    }

    contactSwal(icon: any, title: string, contacts: any,): any {
        console.log(contacts);
        let contactList = '';
        contacts.forEach((contact: any) => {
            contactList += `<a href="contacts/edit?key=${contact.contactId}">${contact.fullname}</a><br>`;
        });
        return Swal.fire({
            icon: icon,
            title: title,
            html: `หรือคุณหมายถึง<br>${contactList}`,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false, // Optionally prevent closing on outside click
            allowEscapeKey: false, // Optionally prevent closing on ESC key
        });
    }

    handleError(error: any) {
        let icon: string;
        let errorMessage: string;
        let title: string;
        let route: string = '';

        switch (error.status) {
            case 0:
                icon = 'error';
                title = 'Connection Error';
                errorMessage = 'Failed to connect to the server. Please check your internet connection and try again.';
                break;
            case 400:
                icon = 'error';
                title = 'Error';
                errorMessage = error.error.message || 'An error occurred.';
                break;
            case 401:
                icon = 'warning';
                title = 'Warning Authentication';
                errorMessage = error.error.message || 'Your session has expired. Please log in again.';
                route = 'logout';
                break;
            default:
                icon = 'error';
                title = 'Error Network';
                errorMessage = 'Failed to request. Please try again later.';
                route = '';
                break;
        }

        this.getSwal(icon, title, errorMessage, false, route);
    }
}
