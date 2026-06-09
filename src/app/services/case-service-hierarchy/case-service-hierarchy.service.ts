import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {
    buildJunctionKeySet,
    CaseServiceHierarchyIds,
    getCaseServiceHierarchyWarningKeys,
    JunctionRecord,
    sanitizeCaseServiceHierarchyForImport,
    ServiceTypeRecord,
    toNullableCaseServiceId,
} from 'src/app/shared/utils/case-service-hierarchy.util';
import { CallService } from '../call/call.service';
import { SweetAlertService } from '../sweet-alert/sweet-alert.service';
@Injectable({
    providedIn: 'root',
})
export class CaseServiceHierarchyService {
    constructor(
        private callService: CallService,
        private translate: TranslateService,
        private sweetAlertService: SweetAlertService,
    ) {}

    async warnOnSaveIfNeeded(groupId: any, typeId: any, subTypeId: any, serviceTypes: ServiceTypeRecord[]): Promise<void> {
        const ids = {
            caseServiceGroupId: toNullableCaseServiceId(groupId),
            caseServiceTypeId: toNullableCaseServiceId(typeId),
            caseServiceSubTypeId: toNullableCaseServiceId(subTypeId),
        };

        if (ids.caseServiceGroupId === null && ids.caseServiceTypeId === null && ids.caseServiceSubTypeId === null) {
            return;
        }

        let junctionKeys: Set<string> | null = null;
        if (ids.caseServiceTypeId !== null && ids.caseServiceSubTypeId !== null) {
            junctionKeys = await this.getJunctionKeySet();
        }
        const warningKeys = getCaseServiceHierarchyWarningKeys(ids, serviceTypes, junctionKeys);

        if (warningKeys.length > 0) {
            this.showWarningKeys(warningKeys);
        }
    }

    sanitizeForImport(
        ids: Partial<CaseServiceHierarchyIds>,
        serviceTypes: ServiceTypeRecord[],
        junctionRows: JunctionRecord[],
    ): { ids: CaseServiceHierarchyIds; warningKeys: string[] } {
        return sanitizeCaseServiceHierarchyForImport(ids, serviceTypes, buildJunctionKeySet(junctionRows));
    }

    translateWarningKeys(warningKeys: string[]): string {
        return warningKeys.map((key) => this.translate.instant(key)).join('\n');
    }

    showWarningKeys(warningKeys: string[]): void {
        if (warningKeys.length === 0) {
            return;
        }
        this.sweetAlertService.warningText(this.translateWarningKeys(warningKeys));
    }

    private async getJunctionKeySet(): Promise<Set<string>> {
        const response: any = await firstValueFrom(this.callService.getCaseServiceTypeSubType());
        const rows = typeof response === 'string' ? JSON.parse(response) : response;
        const junctionRows = Array.isArray(rows) ? rows : [];
        return buildJunctionKeySet(junctionRows);
    }
}
