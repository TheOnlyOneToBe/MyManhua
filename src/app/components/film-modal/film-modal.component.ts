import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { Film, FilmStatus, FilmStatusLabels } from '../../models/film.model';
import { FilmDatabaseService } from '../../services/film-database.service';

@Component({
    selector: 'app-film-modal',
    templateUrl: './film-modal.component.html',
    styleUrls: ['./film-modal.component.css']
})
export class FilmModalComponent implements OnInit {
    filmData: Film;
    statusOptions: string[];
    selectedStatus: string;

    constructor(
        private params: ModalDialogParams,
        private filmService: FilmDatabaseService
    ) {
        const film = params.context.film;
        this.filmData = film ? { ...film } : {
            title: '',
            imageUrl: '',
            status: FilmStatus.TO_DOWNLOAD
        };
        this.statusOptions = [
            FilmStatusLabels[FilmStatus.TO_DOWNLOAD],
            FilmStatusLabels[FilmStatus.DOWNLOADED],
            FilmStatusLabels[FilmStatus.WATCHING]
        ];
        this.selectedStatus = FilmStatusLabels[this.filmData.status];
    }

    ngOnInit() {}

    async save() {
        try {
            if (!this.filmData.title.trim()) {
                alert('Le titre est requis');
                return;
            }

            // Convertir le label du statut en valeur de l'enum
            this.filmData.status = this.getStatusKeyByLabel(this.selectedStatus);

            if (this.filmData.id) {
                await this.filmService.update(this.filmData);
            } else {
                await this.filmService.add(this.filmData);
            }
            this.params.closeCallback(true);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du film:', error);
            alert('Erreur lors de la sauvegarde du film');
        }
    }

    close() {
        this.params.closeCallback(false);
    }

    getStatusKeyByLabel(label: string): FilmStatus {
        const entry = Object.entries(FilmStatusLabels).find(([_, value]) => value === label);
        return entry ? entry[0] as FilmStatus : FilmStatus.TO_DOWNLOAD;
    }
}
