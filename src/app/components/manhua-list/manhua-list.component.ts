import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Manhua, ManhuaStatus, ManhuaStatusLabels } from '../../models/manhua.model';
import { ManhuaDatabaseService } from '../../services/manhua-database.service';
import { ModalDialogService } from '@nativescript/angular';
import { ManhuaModalComponent } from '../manhua-modal/manhua-modal.component';
import { confirm } from '@nativescript/core/ui/dialogs';
import { RouterExtensions } from '@nativescript/angular';
import { Utils } from '@nativescript/core';

@Component({
    selector: 'app-manhua-list',
    templateUrl: './manhua-list.component.html',
    styleUrls: ['./manhua-list.component.css']
})
export class ManhuaListComponent implements OnInit {
    manhuas: Manhua[] = [];
    filteredManhuas: Manhua[] = [];
    currentFilter: string = 'all';
    searchQuery: string = '';
    statusLabels = ManhuaStatusLabels;

    constructor(
        private manhuaService: ManhuaDatabaseService,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private routerExtensions: RouterExtensions
    ) { }

    ngOnInit() {
        this.loadManhuas();
    }

    onNavigateToHome() {
        this.routerExtensions.navigate(['/'], {
            transition: {
                name: 'fade'
            }
        });
    }

    navigateToFilms() {
        console.log('Navigation vers les films');
        try {
            this.routerExtensions.navigate(['/films'], {
                transition: {
                    name: 'slide',
                    duration: 200,
                    curve: 'ease'
                },
                clearHistory: false
            });
            console.log('Navigation terminée');
        } catch (error) {
            console.error('Erreur lors de la navigation:', error);
        }
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

    async loadManhuas() {
        try {
            console.log('Chargement des manhuas avec filtre:', this.currentFilter);
            this.manhuas = await this.manhuaService.getManhuas(this.currentFilter, this.searchQuery);
            this.filteredManhuas = [...this.manhuas];
            console.log('Manhuas chargés:', this.manhuas);
        } catch (error) {
            console.error('Erreur lors du chargement des manhuas:', error);
            alert('Erreur lors du chargement des manhuas');
        }
    }

    setFilter(filter: string) {
        console.log('Application du filtre:', filter);
        this.currentFilter = filter;
        this.loadManhuas();
    }

    onSearch(event: any) {
        console.log('Recherche:', event.object.text);
        this.searchQuery = event.object.text.toLowerCase();
        this.loadManhuas();
    }

    async showManhuaModal(manhua?: Manhua) {
        console.log('Ouverture du modal manhua');
        try {
            const options = {
                viewContainerRef: this.viewContainerRef,
                context: manhua ? { manhua } : {},
                fullscreen: true,
                animated: true,
                stretched: false
            };

            console.log('Options du modal:', options);
            const result = await this.modalService.showModal(ManhuaModalComponent, options);

            if (result) {
                console.log('Résultat du modal:', result);
                await this.loadManhuas();
            }
        } catch (error) {
            console.error('Erreur lors de l\'affichage du modal:', error);
            alert('Erreur lors de l\'ouverture du modal');
        }
    }

    async confirmDelete(manhua: Manhua) {
        try {
            const result = await confirm({
                title: "Confirmation",
                message: "Voulez-vous vraiment supprimer ce manhua ?",
                okButtonText: "Oui",
                cancelButtonText: "Non"
            });

            if (result) {
                await this.manhuaService.deleteManhua(manhua.id);
                await this.loadManhuas();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du manhua:', error);
            alert('Erreur lors de la suppression');
        }
    }

    openUrl(url: string) {
        if (url) {
            Utils.openUrl(url);
        }
    }

    getStatusLabel(status: ManhuaStatus): string {
        return ManhuaStatusLabels[status];
    }

    getStatusClass(status: ManhuaStatus): string {
        switch (status) {
            case ManhuaStatus.IN_PROGRESS:
                return 'in_progress';
            case ManhuaStatus.PAUSED:
                return 'paused';
            case ManhuaStatus.CANCELLED:
                return 'cancelled';
            case ManhuaStatus.COMPLETED:
                return 'completed';
            default:
                return '';
        }
    }
}
