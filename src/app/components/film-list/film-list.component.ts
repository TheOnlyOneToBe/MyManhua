import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { FilmDatabaseService } from '../../services/film-database.service';
import { Film, FilmStatus, FilmStatusLabels } from '../../models/film.model';
import { ModalDialogService, ModalDialogOptions } from '@nativescript/angular';
import { FilmModalComponent } from '../film-modal/film-modal.component';

@Component({
    selector: 'app-film-list',
    templateUrl: './film-list.component.html',
    styleUrls: ['./film-list.component.css']
})
export class FilmListComponent implements OnInit {
    films: Film[] = [];
    filteredFilms: Film[] = [];
    currentFilter: string = 'all';
    searchQuery: string = '';

    constructor(
        private routerExtensions: RouterExtensions,
        private filmService: FilmDatabaseService,
        private modalService: ModalDialogService,
        private vcRef: ViewContainerRef
    ) { }

    ngOnInit() {
        this.loadFilms();
    }

    async loadFilms() {
        try {
            this.films = await this.filmService.getAll();
            this.applyFilters();
        } catch (error) {
            console.error('Erreur lors du chargement des films:', error);
        }
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

    navigateToSeries() {
        this.routerExtensions.navigate(['/series'], {
            transition: {
                name: 'slide',
                duration: 200,
                curve: 'ease'
            },
            clearHistory: false
        });
    }

    setFilter(filter: string) {
        this.currentFilter = filter;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredFilms = this.films.filter(film => {
            const matchesFilter = this.currentFilter === 'all' || film.status === this.currentFilter;
            const matchesSearch = !this.searchQuery || 
                                film.title.toLowerCase().includes(this.searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }

    onSearch(event: any) {
        this.searchQuery = event.value;
        this.applyFilters();
    }

    getStatusLabel(status: FilmStatus): string {
        return FilmStatusLabels[status];
    }

    async showFilmModal(film?: Film) {
        const options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: { film },
            fullscreen: false
        };

        try {
            const result = await this.modalService.showModal(FilmModalComponent, options);
            if (result) {
                await this.loadFilms();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du modal:', error);
        }
    }

    async deleteFilm(film: Film) {
        try {
            await this.filmService.delete(film.id);
            this.loadFilms();
        } catch (error) {
            console.error('Erreur lors de la suppression du film:', error);
        }
    }

    onNavigateToHome() {
        this.routerExtensions.navigate(['/'], {
            transition: {
                name: 'fade'
            }
        });
    }
}
