import { Component } from '@angular/core';
import { Manhua, ManhuaStatus, ManhuaStatusLabels } from '../../models/manhua.model';
import { ModalDialogParams } from '@nativescript/angular';
import { ManhuaDatabaseService } from '../../services/manhua-database.service';
import { ImageService } from '../../services/image.service';

@Component({
    selector: 'manhua-modal',
    templateUrl: './manhua-modal.component.html',
    styleUrls: ['./manhua-modal.component.css']
})
export class ManhuaModalComponent {
    manhua: Manhua;
    isEditing: boolean;
    statuses = Object.values(ManhuaStatus);
    statusItems: string[];
    statusLabels = ManhuaStatusLabels;
    finalImagePath: string;

    constructor(
        private params: ModalDialogParams,
        private manhuaService: ManhuaDatabaseService,
        private imageService: ImageService
    ) {
        console.log('ManhuaModalComponent constructor');
        const existingManhua = params.context?.manhua;
        this.isEditing = !!existingManhua;
        
        if (this.isEditing) {
            console.log('Editing existing manhua:', existingManhua);
            this.manhua = { ...existingManhua };
        } else {
            console.log('Creating new manhua');
            this.manhua = {
                id: null,
                title: '',
                totalChapters: 0,
                lastReadChapter: 0,
                sourceUrl: '',
                imageUrl: '',
                status: ManhuaStatus.IN_PROGRESS
            };
        }

        this.statusItems = this.statuses.map(status => this.statusLabels[status]);
        console.log('Status items:', this.statusItems);
    }

    onStatusChange(args: any) {
        const picker = args.object;
        this.manhua.status = this.statuses[picker.selectedIndex];
        console.log('New status:', this.manhua.status);
    }

    getSelectedIndex(): number {
        return this.statuses.indexOf(this.manhua.status);
    }

    async onSave() {
        try {
            console.log('Saving manhua:', this.manhua);
            
            // Validation
            if (!this.manhua.title) {
                alert('Le titre est requis');
                return;
            }
            
            if (this.manhua.lastReadChapter > this.manhua.totalChapters) {
                alert('Le dernier chapitre lu ne peut pas être supérieur au nombre total de chapitres');
                return;
            }

            // Confirmer l'image si elle existe
            if (this.finalImagePath) {
                const confirmedImagePath = await this.imageService.confirmImage();
                if (confirmedImagePath) {
                    this.manhua.imageUrl = confirmedImagePath;
                }
            }

            // Sauvegarde
            if (this.isEditing) {
                console.log('Updating existing manhua');
                await this.manhuaService.updateManhua(this.manhua);
            } else {
                console.log('Creating new manhua');
                const newId = await this.manhuaService.addManhua(this.manhua);
                console.log('New manhua created with ID:', newId);
                this.manhua.id = newId;
            }

            console.log('Manhua saved successfully');
            this.params.closeCallback(this.manhua);
        } catch (error) {
            console.error('Error saving manhua:', error);
            alert('Une erreur est survenue lors de la sauvegarde');
        }
    }

    async selectImage() {
        try {
            const result = await this.imageService.pickImage();
            if (result) {
                // Utiliser le chemin temporaire pour l'affichage
                this.manhua.imageUrl = result.tempPath;
                // Stocker le chemin final pour plus tard
                this.finalImagePath = result.finalPath;
            }
        } catch (error) {
            console.error('Error selecting image:', error);
            alert('Erreur lors de la sélection de l\'image');
        }
    }

    onCancel() {
        // Supprimer l'image temporaire si elle existe
        this.imageService.cancelImage();
        console.log('Modal cancelled');
        this.params.closeCallback(null);
    }
}
