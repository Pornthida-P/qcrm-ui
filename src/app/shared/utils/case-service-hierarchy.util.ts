export type CaseServiceHierarchyIds = {
    caseServiceGroupId: number | null;
    caseServiceTypeId: number | null;
    caseServiceSubTypeId: number | null;
};

export type ServiceTypeRecord = {
    id: number;
    caseServiceGroupId?: number | null;
};

export type JunctionRecord = {
    caseServiceTypeId: number;
    caseServiceSubTypeId: number;
};

export function toNullableCaseServiceId(value: any): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

export function buildJunctionKeySet(junctionRows: JunctionRecord[]): Set<string> {
    return new Set(junctionRows.map((row) => `${Number(row.caseServiceTypeId)}:${Number(row.caseServiceSubTypeId)}`));
}

export function getCaseServiceHierarchyWarningKeys(
    ids: Partial<CaseServiceHierarchyIds>,
    serviceTypes: ServiceTypeRecord[],
    junctionKeys: Set<string> | null,
): string[] {
    const warnings: string[] = [];
    const groupId = toNullableCaseServiceId(ids.caseServiceGroupId);
    const typeId = toNullableCaseServiceId(ids.caseServiceTypeId);
    const subTypeId = toNullableCaseServiceId(ids.caseServiceSubTypeId);

    if (subTypeId !== null && typeId === null) {
        warnings.push('alert.serviceHierarchySubTypeWithoutType');
    }

    if (typeId !== null) {
        const type = serviceTypes.find((item) => Number(item.id) === typeId);
        if (!type) {
            warnings.push('alert.serviceHierarchyTypeNotFound');
        } else if (groupId !== null && type.caseServiceGroupId != null && Number(type.caseServiceGroupId) !== groupId) {
            warnings.push('alert.serviceHierarchyTypeNotInGroup');
        }
    }

    if (typeId !== null && subTypeId !== null && junctionKeys) {
        if (!junctionKeys.has(`${typeId}:${subTypeId}`)) {
            warnings.push('alert.serviceHierarchySubTypeNotMapped');
        }
    }

    return warnings;
}

export function sanitizeCaseServiceHierarchyForImport(
    ids: Partial<CaseServiceHierarchyIds>,
    serviceTypes: ServiceTypeRecord[],
    junctionKeys: Set<string>,
): { ids: CaseServiceHierarchyIds; warningKeys: string[] } {
    let groupId = toNullableCaseServiceId(ids.caseServiceGroupId);
    let typeId = toNullableCaseServiceId(ids.caseServiceTypeId);
    let subTypeId = toNullableCaseServiceId(ids.caseServiceSubTypeId);
    const warningKeys: string[] = [];

    if (subTypeId !== null && typeId === null) {
        warningKeys.push('alert.serviceHierarchySubTypeWithoutType');
        subTypeId = null;
    }

    if (typeId !== null) {
        const type = serviceTypes.find((item) => Number(item.id) === typeId);
        if (!type) {
            warningKeys.push('alert.serviceHierarchyTypeNotFound');
            typeId = null;
            subTypeId = null;
        } else if (groupId !== null && type.caseServiceGroupId != null && Number(type.caseServiceGroupId) !== groupId) {
            warningKeys.push('alert.serviceHierarchyTypeNotInGroup');
            typeId = null;
            subTypeId = null;
        }
    }

    if (typeId !== null && subTypeId !== null && !junctionKeys.has(`${typeId}:${subTypeId}`)) {
        warningKeys.push('alert.serviceHierarchySubTypeNotMapped');
        subTypeId = null;
    }

    return {
        ids: {
            caseServiceGroupId: groupId,
            caseServiceTypeId: typeId,
            caseServiceSubTypeId: subTypeId,
        },
        warningKeys,
    };
}
