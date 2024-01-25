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
        }).then((result) => {
            if (route) {
                setTimeout(() => this.router.navigate([`/${route}`]), 500);
            }
        });
    }
}
