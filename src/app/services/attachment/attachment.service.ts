import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { config } from 'src/app/config/config';
import { environment } from 'src/environments/environment';
import { CalendarEventService } from '../calendar-event/calendar-event.service';

@Injectable({
    providedIn: 'root',
})
export class AttachmentService {
    constructor(private http: HttpClient, private calendarService: CalendarEventService) {}

    view(attachmentPath: string) {
        window.open(`${environment.api.url}${attachmentPath}`, '_blank');
    }

    download(attachmentPath: string) {
        const link = document.createElement('a');
        link.href = `${environment.api.url}${attachmentPath}`;
        link.download = attachmentPath.substr(attachmentPath.lastIndexOf('/') + 1);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    upload(file: File, filename: string, createdAt: string, createdById: string) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
        formData.append('createdAt', createdAt);
        formData.append('createdById', createdById);

        return this.http.post(`${environment.api.url}${config.api.path.attachment.upload}`, formData);
    }

    delete(attachmentId: string) {
        return this.http.post(`${environment.api.url}${config.api.path.attachment.delete}${attachmentId}`, {}).pipe(
            tap(() => {
                this.calendarService.onSetRefreshData();
            }),
        );
    }
}
