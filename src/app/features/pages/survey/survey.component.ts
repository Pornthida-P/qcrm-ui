import { Component, OnInit } from '@angular/core';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit {
    value: string | undefined;
    filterOption!: any[];
    selectedFilter: any | undefined;
    surveys!: any[];
    selectedSurvey: any | undefined;
    faPenToSquare = faPenToSquare;
    ngOnInit() {
        this.filterOption = [
            { name: 'ทั้งหมด', code: 'all' },
            { name: 'Only My', code: 'me' },
        ];
        this.selectedFilter = this.filterOption[0];

        this.surveys = [
            {
                no: 6538,
                name: 'มีนตรา มั่งคั่ง',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย., 2023 10:24',
            },
            {
                no: 6539,
                name: 'อภิศักดิ์ รอดแดง',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย., 2023 10:30',
            },
            {
                no: 6540,
                name: 'อภิญญา จันทร์เครือ',
                survey_form:
                    'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
                year: 2023,
                save_date: '25 ก.ย., 2023 10:40',
            },
        ];
    }
}
