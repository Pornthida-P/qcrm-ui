import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { Survey } from 'src/app/shared/interface/survey';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { SortColumn, SortDirection } from 'src/app/features/pages/survey/sortable.directive';

interface SearchResult {
    surveys: Survey[];
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

function sort(surveys: Survey[], column: SortColumn, direction: string): Survey[] {
    if (direction === '' || column === '') {
        return surveys;
    } else {
        return [...surveys].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(survey: Survey, term: string, pipe: PipeTransform) {
    return (
        survey.name.toLowerCase().includes(term.toLowerCase()) ||
        survey.survey_form.toLowerCase().includes(term.toLowerCase()) ||
        survey.save_date.toLowerCase().includes(term.toLowerCase()) ||
        pipe.transform(survey.no).includes(term) ||
        pipe.transform(survey.year).includes(term)
    );
}

@Injectable({
    providedIn: 'root',
})
export class SurveyService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _surveys$ = new BehaviorSubject<Survey[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
    };

    constructor(private pipe: DecimalPipe) {
        this._search$
            .pipe(
                tap(() => this._loading$.next(true)),
                debounceTime(200),
                switchMap(() => this._search()),
                delay(200),
                tap(() => this._loading$.next(false)),
            )
            .subscribe((result) => {
                this._surveys$.next(result.surveys);
                this._total$.next(result.total);
            });

        this._search$.next();
    }

    get surveys$() {
        return this._surveys$.asObservable();
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

        // 1. sort
        let surveys = sort(this.getData(), sortColumn, sortDirection);

        // 2. filter
        surveys = surveys.filter((survey) => matches(survey, searchTerm, this.pipe));
        const total = surveys.length;

        // 3. paginate
        surveys = surveys.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ surveys, total });
    }

    getData() {
        return [
            {
                no: 6538,
                name: 'มีนตรา มั่งคั่ง',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:24',
            },
            {
                no: 6539,
                name: 'อภิศักดิ์ รอดแดง',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6540,
                name: 'อภิญญา จันทร์เครือ',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:40',
            },
            {
                no: 6541,
                name: 'มัณฑิตา เชิดชม',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:24',
            },
            {
                no: 6542,
                name: 'อนุสรา พานิชกุล',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6543,
                name: 'เพชรธิดา เสลานนท์',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:40',
            },
            {
                no: 6544,
                name: 'พรรภษา สุขวิสุทธิ์',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:24',
            },
            {
                no: 6545,
                name: 'สุภาพร มณีโชติ',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6546,
                name: 'ผกามาศ ทองโสม',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:40',
            },
            {
                no: 6547,
                name: 'สุนารี ศรีนางใย',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:24',
            },
            {
                no: 6548,
                name: 'เปรมญรัตน์ เปรมกสิน',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6549,
                name: 'จุฑามาศ ธนบัตร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:40',
            },
            {
                no: 6550,
                name: 'วิชยุตม์ สมคำ',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:24',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
            {
                no: 6551,
                name: 'ฒัศณ์พร สุสมุทร',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย. 2023 10:30',
            },
        ];
    }
}
