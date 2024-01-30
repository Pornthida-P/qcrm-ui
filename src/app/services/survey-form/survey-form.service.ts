import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { SurveyForm } from 'src/app/shared/interface/survey-form';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from 'src/app/features/pages/survey-form/sortable.directive';
import { environment } from 'src/environments/environment';
import { config } from 'src/app/config/config';
import { map } from 'rxjs/operators';
interface SearchResult {
    forms: SurveyForm[];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(forms: SurveyForm[], column: SortColumn, direction: string): SurveyForm[] {
    if (direction === '' || column === '') {
        return forms;
    } else {
        return [...forms].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(form: SurveyForm, term: string, pipe: PipeTransform) {
    return (
        form.save_by.toLowerCase().includes(term.toLowerCase()) ||
        form.survey_form.toLowerCase().includes(term.toLowerCase()) ||
        form.save_date.toLowerCase().includes(term.toLowerCase())
    );
}

@Injectable({
    providedIn: 'root',
})
export class SurveyFormService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _forms$ = new BehaviorSubject<SurveyForm[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
    };

    baseUrl: string = `${environment.api.url}`;

    constructor(private pipe: DecimalPipe, private http: HttpClient) {
        this._search$
            .pipe(
                tap(() => this._loading$.next(true)),
                debounceTime(200),
                switchMap(() => this._search()),
                delay(200),
                tap(() => this._loading$.next(false)),
            )
            .subscribe((result) => {
                this._forms$.next(result.forms);
                this._total$.next(result.total);
            });

        this._search$.next();
    }

    get forms$() {
        return this._forms$.asObservable();
    }
    get total$() {
        return this._total$.asObservable();
    }
    get loading$() {
        return this._loading$.asObservable();
    }
    get page() {
        return this._state.page;
    }
    get pageSize() {
        return this._state.pageSize;
    }
    get searchTerm() {
        return this._state.searchTerm;
    }

    set page(page: number) {
        this._set({ page });
    }
    set pageSize(pageSize: number) {
        this._set({ pageSize });
    }
    set searchTerm(searchTerm: string) {
        this._set({ searchTerm });
    }
    set sortColumn(sortColumn: SortColumn) {
        this._set({ sortColumn });
    }
    set sortDirection(sortDirection: SortDirection) {
        this._set({ sortDirection });
    }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

        return this.getData().pipe(
            map((forms: SurveyForm[]) => {
                // 1. sort
                forms = sort(forms, sortColumn, sortDirection);

                // 2. filter
                forms = forms.filter((survey) => matches(survey, searchTerm, this.pipe));
                const total = forms.length;

                // 3. paginate
                forms = forms.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

                return { forms, total };
            }),
        );
    }

    // getData(): Observable<SurveyForm[]> {
    //   return this.http.get<SurveyForm[]>(`${this.baseUrl}/page`);
    // }

    getSurveyForm() {
        return this.http.get(`${this.baseUrl}${config.api.path.surveyForm.baseUrl}`);
    }

    createSurveyForm(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.surveyForm.baseUrl}`, data);
    }

    getData(): Observable<SurveyForm[]> {
        return of([
            {
                no: 1,
                save_by: 'Admin',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                save_date: '25 ก.ย., 2023 10:24',
            },
            {
                no: 2,
                save_by: 'Admin',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                save_date: '25 ก.ย., 2023 10:30',
            },
            {
                no: 3,
                save_by: 'Admin',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                save_date: '25 ก.ย., 2023 10:40',
            },
        ]);
    }
}
