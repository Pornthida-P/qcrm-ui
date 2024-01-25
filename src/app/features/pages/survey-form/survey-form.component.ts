import { Component, OnInit } from '@angular/core';
import { faPenToSquare, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from 'src/app/config/config';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent implements OnInit{

  surveyForms!: any[]
  selectedSurveyForms: any = [];

  value: string | undefined;

  filterOption!: any[];
  selectedFilter: any | undefined;
  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;

  fileType: string = config.file.type;

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
    this.router.navigate(['/surveyform/new']);
  }

  exportExcel() {
    if (this.selectedSurveyForms.length != 0) {
        const columns = [['เลขที่การทำแบบสำรวจ', 'ชื่อผู้ติดตามและประเมินผลฯ', 'แบบฟอร์มสำรวจ', 'ประจำปี (ค.ศ.)', 'วันที่บันทึก']];
        const wb = XLSX.utils.book_new();
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
        XLSX.utils.sheet_add_aoa(ws, columns);

        XLSX.utils.sheet_add_json(ws, this.selectedSurveyForms, { origin: 'A2', skipHeader: true });

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, `การติดตามและประเมินผล${this.fileType}`);
    }
  }

  editSurveyForms() {
    console.log('edit', this.selectedSurveyForms);
  }

  deleteSurveyForms() {
    console.log('delete', this.selectedSurveyForms);
  }

  onSelectionChangeForms(value: any[]) {
    console.log(this.selectedSurveyForms);
}

}
