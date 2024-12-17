export enum FilmStatus {
    TO_DOWNLOAD = 'to_download',
    DOWNLOADED = 'downloaded',
    WATCHING = 'watching',
    
}

export const FilmStatusLabels: { [key in FilmStatus]: string } = {
    [FilmStatus.TO_DOWNLOAD]: 'À télécharger',
    [FilmStatus.DOWNLOADED]: 'Téléchargé',
    [FilmStatus.WATCHING]: 'Lue',
    
};

export interface Film {
    id?: number;
    title: string;
    imageUrl?: string;
    status: FilmStatus;
}
