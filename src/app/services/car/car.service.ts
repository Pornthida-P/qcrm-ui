import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from 'src/app/config/config';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CarService {
    constructor(private http: HttpClient) {}
    baseUrl: string = `${environment.api.url}`;

    /**
     * Create or update car
     */
    createOrUpdateCar(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/car`, data);
    }

    /**
     * Get car by id
     */
    getCarById(carId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/car/${carId}`);
    }

    /**
     * Find car by dealerId
     */
    findCarByDealerId(dealerId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/car/dealer/${dealerId}`);
    }

    /**
     * Get all cars with pagination and search
     */
    getCars(page: number = 0, limit: number = 50, searchText?: string): Observable<any> {
        let url = `${this.baseUrl}/car?page=${page}&limit=${limit}`;
        if (searchText) {
            url += `&searchText=${encodeURIComponent(searchText)}`;
        }
        return this.http.get(url);
    }

    /**
     * Update car by id
     */
    updateCar(carId: string, data: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/car/${carId}`, data);
    }

    /**
     * Delete car by id (soft delete)
     */
    deleteCar(carId: string, modifiedById: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/car/${carId}`, {
            body: { modifiedById },
        });
    }
}
