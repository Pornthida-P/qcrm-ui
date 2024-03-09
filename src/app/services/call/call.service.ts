import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { config } from 'src/app/config/config';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CallService {
    constructor(private http: HttpClient) {}
    baseUrl: string = `${environment.api.url}`;

    getCalls(page: number, limit: number) {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}/${page}/${limit}`);
    }

    getCallsPage(page: number, limit: number, sortId: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}/${page}/${limit}/${sortId}`);
    }

    getCallsCount() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.count}`);
    }

    getCaseTopic() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.caseTopic}`);
    }

    getOrganizations() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.organizations}`);
    }

    getAllContacts() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.contacts}`);
    }

    getContactById(id: string) {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.contactid}/${id}`);
    }

    getContactByPage(page: number, limit: number, sortId: string, searchText: string, createdBy: string) {
        if (searchText == '' || searchText == null) {
            searchText = 'undefined';
        }
        return this.http.get(
            `${this.baseUrl}${config.api.path.call.url}${config.api.path.call.contactbypage}/${page}/${limit}/${sortId}/${searchText}/${createdBy}`,
        );
    }

    getAllCaseSubjects() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.caseSubjects}`);
    }

    getAllChannels() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.channels}`);
    }

    getActivitiesType() {
        return this.http.get(`${this.baseUrl}${config.api.path.call.url}${config.api.path.call.activitiesType}`);
    }

    createCalls(data: any) {
        return this.http.post(`${this.baseUrl}${config.api.path.call.url}`, data);
    }

    countContact(searchText: string, createdById: string) {
      if (searchText == '' || searchText == null) {
          searchText = 'undefined';
      }
      if (createdById == '' || createdById == null) {
          createdById = 'undefined';
      }
      return this.http.get(
          `${this.baseUrl}${config.api.path.call.url}${config.api.path.call.countcontact}${searchText}/${createdById}`,
      );
  }

    // getCalls(page: number, pageSize: number): Observable<any> {
    //   return of([
    //     {
    //       no: 1,
    //       time: '2024/01/15 12:12:12',
    //       mobilePhone: '0611457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผลประเมินผลโครงการ',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       agent: 'admin'
    //     },
    //     {
    //       no: 2,
    //       time: '2024/01/16 13:13:13',
    //       mobilePhone: '0921457951',
    //       typePhone: 'Outbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent06'
    //     },
    //     {
    //       no: 3,
    //       time: '2024/01/17 14:14:14',
    //       mobilePhone: '0611457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent07'
    //     },
    //     {
    //       no: 4,
    //       time: '2024/01/18 15:15:15',
    //       mobilePhone: '068888888',
    //       typePhone: 'Outbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent08'
    //     },
    //     {
    //       no: 5,
    //       time: '2024/01/19 16:16:16',
    //       mobilePhone: '0645457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent09'
    //     },
    //     {
    //       no: 6,
    //       time: '2024/01/15 12:12:12',
    //       mobilePhone: '0611457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผลประเมินผลโครงการ',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       agent: 'admin'
    //     },
    //     {
    //       no: 7,
    //       time: '2024/01/16 13:13:13',
    //       mobilePhone: '0921457951',
    //       typePhone: 'Outbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent06'
    //     },
    //     {
    //       no: 8,
    //       time: '2024/01/17 14:14:14',
    //       mobilePhone: '0611457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent07'
    //     },
    //     {
    //       no: 9,
    //       time: '2024/01/18 15:15:15',
    //       mobilePhone: '068888888',
    //       typePhone: 'Outbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent08'
    //     },
    //     {
    //       no: 10,
    //       time: '2024/01/19 16:16:16',
    //       mobilePhone: '0645457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent09'
    //     },
    //     {
    //       no: 11,
    //       time: '2024/01/19 16:16:16',
    //       mobilePhone: '0645457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent09'
    //     },
    //     {
    //       no: 12,
    //       time: '2024/01/19 16:16:16',
    //       mobilePhone: '0645457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent09'
    //     },
    //   ]);
    // }

    // getCallsPage() {
    //   const data = [
    //     {
    //       no: 1,
    //       time: '2024/01/15 12:12:12',
    //       mobilePhone: '0611457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผลประเมินผลโครงการ',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       agent: 'admin'
    //     },
    //     {
    //       no: 2,
    //       time: '2024/01/16 13:13:13',
    //       mobilePhone: '0921457951',
    //       typePhone: 'Outbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent06'
    //     },
    //     {
    //       no: 3,
    //       time: '2024/01/17 14:14:14',
    //       mobilePhone: '0611457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent07'
    //     },
    //     {
    //       no: 4,
    //       time: '2024/01/18 15:15:15',
    //       mobilePhone: '068888888',
    //       typePhone: 'Outbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent08'
    //     },
    //     {
    //       no: 5,
    //       time: '2024/01/19 16:16:16',
    //       mobilePhone: '0645457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent09'
    //     },
    //     {
    //       no: 6,
    //       time: '2024/01/15 12:12:12',
    //       mobilePhone: '0611457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผลประเมินผลโครงการ',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       agent: 'admin'
    //     },
    //     {
    //       no: 7,
    //       time: '2024/01/16 13:13:13',
    //       mobilePhone: '0921457951',
    //       typePhone: 'Outbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent06'
    //     },
    //     {
    //       no: 8,
    //       time: '2024/01/17 14:14:14',
    //       mobilePhone: '0611457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent07'
    //     },
    //     {
    //       no: 9,
    //       time: '2024/01/18 15:15:15',
    //       mobilePhone: '068888888',
    //       typePhone: 'Outbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent08'
    //     },
    //     {
    //       no: 10,
    //       time: '2024/01/19 16:16:16',
    //       mobilePhone: '0645457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent09'
    //     },
    //     {
    //       no: 11,
    //       time: '2024/01/19 16:16:16',
    //       mobilePhone: '0645457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent09'
    //     },
    //     {
    //       no: 12,
    //       time: '2024/01/19 16:16:16',
    //       mobilePhone: '0645457951',
    //       typePhone: 'Inbound',
    //       subject: 'ติดตามและประเมินผล',
    //       detail: 'โทรสำรวจติดตามและประเมินผลโครงการBizTalk เจาะลึกตลาดซาอุ',
    //       solutions: '',
    //       agent: 'agent09'
    //     },
    //   ];

    //   return of({ page: true, data });
    // }
}
