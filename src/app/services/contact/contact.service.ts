import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ContactService {
    constructor(private http: HttpClient) {}

    baseApi = environment.api.url;

    findAll(): Observable<any> {
        return this.http.get(`${this.baseApi}${environment.api.endpoint.contact.findAll}`);
    }

    findById(id: string): Observable<any> {
        return this.http.get(`${this.baseApi}${environment.api.endpoint.contact.findById}/${id}`);
    }

    findByPage(page: number, offset: number): Observable<any> {
        return this.http.get(`${this.baseApi}${environment.api.endpoint.contact.findByPage}/${page}/${offset}`);
    }

    countAllItem(): Observable<any> {
        return this.http.get(`${this.baseApi}${environment.api.endpoint.contact.countAllItem}`);
    }
}
