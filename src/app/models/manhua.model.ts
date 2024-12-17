export enum ManhuaStatus {
    IN_PROGRESS = 'in_progress',
    PAUSED = 'paused',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}

export const ManhuaStatusLabels = {
    [ManhuaStatus.IN_PROGRESS]: 'En cours',
    [ManhuaStatus.PAUSED]: 'En pause',
    [ManhuaStatus.CANCELLED]: 'Annulé',
    [ManhuaStatus.COMPLETED]: 'Complété'
};

export interface Manhua {
    id?: number;
    title: string;
    imageUrl: string;
    totalChapters: number;
    lastReadChapter: number;
    sourceUrl: string;
    status: ManhuaStatus;
}
