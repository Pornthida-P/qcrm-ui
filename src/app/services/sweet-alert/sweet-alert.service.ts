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
        }).then(() => {
            if (route) {
                setTimeout(() => this.router.navigate([`/${route}`]), 500);
            }
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
                errorMessage = 'Your session has expired. Please log in again.';
                route = 'login';
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
