import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Serie, SerieStatus, SerieStatusLabels } from '../../models/serie.model';
import { SerieDatabaseService } from '../../services/serie-database.service';
import { ModalDialogService } from '@nativescript/angular';
import { SerieModalComponent } from '../serie-modal/serie-modal.component';
import { confirm } from '@nativescript/core/ui/dialogs';
import { RouterExtensions } from '@nativescript/angular';

@Component({
    selector: 'app-serie-list',
    templateUrl: './serie-list.component.html',
    styleUrls: ['./serie-list.component.css']
})
export class SerieListComponent implements OnInit {
    series: Serie[] = [];
    filteredSeries: Serie[] = [];
    currentFilter: string = 'all';
    searchQuery: string = '';
    statusLabels = SerieStatusLabels;

    constructor(
        private serieService: SerieDatabaseService,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private routerExtensions: RouterExtensions
    ) { }

    ngOnInit() {
        this.loadSeries();
    }

    onNavigateToHome() {
        this.routerExtensions.navigate(['/'], {
            transition: {
                name: 'fade'
            }
        });
    }

    navigateToManhuas() {
        this.routerExtensions.navigate(['/manhuas'], {
            transition: {
                name: 'slide',
                duration: 200,
                curve: 'ease'
            },
            clearHistory: false
        });
    }

    navigateToFilms() {
        this.routerExtensions.navigate(['/films'], {
            transition: {
                name: 'slide',
                duration: 200,
                curve: 'ease'
            },
            clearHistory: false
        });
    }

    async loadSeries() {
        try {
            this.series = await this.serieService.getSeries(this.currentFilter, this.searchQuery);
            this.filteredSeries = [...this.series];
        } catch (error) {
            console.error('Erreur lors du chargement des séries:', error);
            alert('Erreur lors du chargement des séries');
        }
    }

    setFilter(filter: string) {
        this.currentFilter = filter;
        this.loadSeries();
    }

    onSearch(event: any) {
        this.searchQuery = event.value;
        this.loadSeries();
    }

    async showSerieModal(serie?: Serie) {
        try {
            const options = {
                viewContainerRef: this.viewContainerRef,
                context: serie ? { serie } : {},
                fullscreen: true
            };

            const result = await this.modalService.showModal(SerieModalComponent, options);
            if (result) {
                await this.loadSeries();
            }
        } catch (error) {
            console.error('Erreur lors de l\'affichage du modal:', error);
            alert('Erreur lors de l\'ouverture du modal');
        }
    }

    async confirmDelete(serie: Serie) {
        try {
            const result = await confirm({
                title: "Confirmation",
                message: "Voulez-vous vraiment supprimer cette série ?",
                okButtonText: "Oui",
                cancelButtonText: "Non"
            });

            if (result) {
                await this.serieService.delete(serie.id);
                await this.loadSeries();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la série:', error);
            alert('Erreur lors de la suppression');
        }
    }

    getStatusLabel(status: SerieStatus): string {
        return SerieStatusLabels[status];
    }

    getStatusClass(status: SerieStatus): string {
        switch (status) {
            case SerieStatus.TO_DOWNLOAD:
                return 'to-download';
            case SerieStatus.DOWNLOADED:
                return 'downloaded';
            default:
                return '';
        }
    }
}
