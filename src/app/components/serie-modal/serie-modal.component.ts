import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { Serie, SerieStatus, SerieStatusLabels } from '../../models/serie.model';
import { SerieDatabaseService } from '../../services/serie-database.service';

@Component({
    selector: 'app-serie-modal',
    templateUrl: './serie-modal.component.html',
    styleUrls: ['./serie-modal.component.css']
})
export class SerieModalComponent implements OnInit {
    serieData: Serie;
    statusOptions: string[];
    selectedStatus: string;

    constructor(
        private params: ModalDialogParams,
        private serieService: SerieDatabaseService
    ) {
        const serie = params.context.serie;
        this.serieData = serie ? { ...serie } : {
            title: '',
            imageUrl: '',
            totalSeasons: 1,
            currentSeason: 1,
            status: SerieStatus.TO_DOWNLOAD
        };
        this.statusOptions = Object.values(SerieStatusLabels);
        this.selectedStatus = SerieStatusLabels[this.serieData.status];
    }

    ngOnInit() {}

    async save() {
        try {
            if (!this.serieData.title.trim()) {
                alert('Le titre est requis');
                return;
            }

            // Convertir le label du statut en valeur de l'enum
            this.serieData.status = this.getStatusKeyByLabel(this.selectedStatus);

            if (this.serieData.id) {
                await this.serieService.update(this.serieData);
            } else {
                await this.serieService.add(this.serieData);
            }
            this.params.closeCallback(true);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la série:', error);
            alert('Erreur lors de la sauvegarde de la série');
        }
    }

    close() {
        this.params.closeCallback(false);
    }

    getStatusKeyByLabel(label: string): SerieStatus {
        const entry = Object.entries(SerieStatusLabels).find(([_, value]) => value === label);
        return entry ? entry[0] as SerieStatus : SerieStatus.TO_DOWNLOAD;
    }
}
