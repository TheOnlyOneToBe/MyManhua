import { Injectable } from '@angular/core';
import { ImageSource } from '@nativescript/core/image-source';
import { knownFolders, path, File, Folder } from '@nativescript/core/file-system';
import { ImageAsset } from '@nativescript/core';
import * as imagepicker from '@nativescript/imagepicker';

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    private tempImagePath: string = null;

    constructor() { }

    async pickImage(): Promise<{ tempPath: string, finalPath: string }> {
        try {
            const context = imagepicker.create({
                mode: 'single'
            });

            const authorized = await context.authorize();
            if (authorized) {
                const selection = await context.present();
                if (selection && selection.length > 0) {
                    const selectedImage = selection[0];
                    if (selectedImage && selectedImage.asset) {
                        // Sauvegarder d'abord dans un dossier temporaire
                        const tempPath = await this.saveImageToTemp(selectedImage.asset);
                        // Générer le chemin final (mais ne pas encore sauvegarder)
                        const finalPath = this.generateFinalImagePath();
                        this.tempImagePath = tempPath;
                        return { tempPath, finalPath };
                    }
                }
            }
            return null;
        } catch (error) {
            console.error('Error picking image:', error);
            throw error;
        }
    }

    private async saveImageToTemp(imageAsset: ImageAsset): Promise<string> {
        try {
            const imageSource = await ImageSource.fromAsset(imageAsset);
            const fileName = `temp_${Date.now()}.jpg`;
            const tempFolder = knownFolders.temp();
            const filePath = path.join(tempFolder.path, fileName);
            
            const saved = await imageSource.saveToFile(filePath, 'jpg');
            if (saved) {
                return filePath;
            }
            return null;
        } catch (error) {
            console.error('Error saving temp image:', error);
            throw error;
        }
    }

    private generateFinalImagePath(): string {
        const fileName = `manhua_${Date.now()}.jpg`;
        return `~/assets/manhuas/${fileName}`;
    }

    async confirmImage(): Promise<string> {
        if (!this.tempImagePath) {
            return null;
        }

        try {
            // Créer le dossier final s'il n'existe pas
            const finalFolder = path.join(knownFolders.currentApp().path, 'assets/manhuas');
            const folderExists = Folder.exists(finalFolder);
            if (!folderExists) {
                Folder.fromPath(finalFolder);
            }

            // Lire l'image temporaire
            const tempFile = File.fromPath(this.tempImagePath);
            const imageSource = await ImageSource.fromFile(this.tempImagePath);
            
            // Sauvegarder dans le dossier final
            const fileName = `manhua_${Date.now()}.jpg`;
            const finalPath = path.join(finalFolder, fileName);
            const saved = await imageSource.saveToFile(finalPath, 'jpg');
            
            if (saved) {
                // Supprimer le fichier temporaire
                tempFile.remove();
                this.tempImagePath = null;
                return `~/assets/manhuas/${fileName}`;
            }
            return null;
        } catch (error) {
            console.error('Error confirming image:', error);
            throw error;
        }
    }

    async cancelImage(): Promise<void> {
        if (this.tempImagePath) {
            try {
                const tempFile = File.fromPath(this.tempImagePath);
                await tempFile.remove();
                this.tempImagePath = null;
            } catch (error) {
                console.error('Error removing temp image:', error);
            }
        }
    }
}
