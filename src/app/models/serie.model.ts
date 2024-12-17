export enum SerieStatus {
    TO_DOWNLOAD = 'to_download',
    DOWNLOADED = 'downloaded'
}

export const SerieStatusLabels = {
    [SerieStatus.TO_DOWNLOAD]: 'À télécharger',
    [SerieStatus.DOWNLOADED]: 'Téléchargé'
};

export interface Serie {
    id?: number;
    title: string;
    imageUrl: string;
    totalSeasons: number;
    currentSeason: number;
    status: SerieStatus;
}
