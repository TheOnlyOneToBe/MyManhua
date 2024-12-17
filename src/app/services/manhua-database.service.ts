import { Injectable } from '@angular/core';
import { Manhua, ManhuaStatus } from '../models/manhua.model';
import { getString, setString } from '@nativescript/core/application-settings';

@Injectable({
    providedIn: 'root'
})
export class ManhuaDatabaseService {
    private readonly STORAGE_KEY = 'manhuas';
    private manhuas: Manhua[] = [];

    constructor() {
        this.loadManhuas();
    }

    private loadManhuas() {
        const storedManhuas = getString(this.STORAGE_KEY);
        if (storedManhuas) {
            this.manhuas = JSON.parse(storedManhuas);
        }
    }

    private saveManhuas() {
        setString(this.STORAGE_KEY, JSON.stringify(this.manhuas));
    }

    async addManhua(manhua: Manhua): Promise<number> {
        const newId = this.manhuas.length > 0 
            ? Math.max(...this.manhuas.map(m => m.id || 0)) + 1 
            : 1;
        
        const newManhua = { ...manhua, id: newId };
        this.manhuas.push(newManhua);
        this.saveManhuas();
        return newId;
    }

    async updateManhua(manhua: Manhua): Promise<void> {
        const index = this.manhuas.findIndex(m => m.id === manhua.id);
        if (index !== -1) {
            this.manhuas[index] = { ...manhua };
            this.saveManhuas();
        }
    }

    async deleteManhua(id: number): Promise<void> {
        const index = this.manhuas.findIndex(m => m.id === id);
        if (index !== -1) {
            this.manhuas.splice(index, 1);
            this.saveManhuas();
        }
    }

    async getManhuas(filter: string = 'all', searchQuery: string = ''): Promise<Manhua[]> {
        let filteredManhuas = [...this.manhuas];
        
        if (filter !== 'all') {
            filteredManhuas = filteredManhuas.filter(m => m.status === filter);
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredManhuas = filteredManhuas.filter(m => 
                m.title.toLowerCase().includes(query)
            );
        }
        
        return filteredManhuas.sort((a, b) => a.title.localeCompare(b.title));
    }

    async getManhuaById(id: number): Promise<Manhua | null> {
        return this.manhuas.find(m => m.id === id) || null;
    }
}
