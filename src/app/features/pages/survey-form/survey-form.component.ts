import { Component, OnInit } from '@angular/core';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent implements OnInit{

  surveyForms!: any[]
  selectedSurveyForms: any | undefined;

  value: string | undefined;

  filterOption!: any[];
  selectedFilter: any | undefined;
  faPenToSquare = faPenToSquare;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {

    this.filterOption = [
      { name: 'ทั้งหมด', code: 'all' },
      { name: 'Only My', code: 'me' },
    ];
    this.selectedFilter = this.filterOption[0];

    this.surveyForms = [
        {
            name: 'Admin',
            survey_form:
                'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
            save_date: '25 ก.ย., 2023 10:24',
        },
        {
            name: 'Admin',
            survey_form:
                'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
            save_date: '25 ก.ย., 2023 10:30',
        },
        {
            name: 'Admin',
            survey_form:
                'แบบสำรวจติดตามและประเมินผลเพื่อพัฒนาศักยภาพด้านการค้าระหว่างประเทศ "สถาบันพัฒนาผู้ประกอบการการค้ายุคใหม่(NEA) กรมส่งเสริมการค้าระหว่างประเทศ กระทรวงพาณิชย์” สำหรับประเภทผู้ประกอบการรุ่นใหม่ (นิสิต/นักศึกษา) ที่เข้าร่วมโครงการใน FromGen Z to be CEO 2023',
            save_date: '25 ก.ย., 2023 10:40',
        },
    ];
  }

  formManage() {
    this.router.navigate(['/survey/form/new']);
  }

}
