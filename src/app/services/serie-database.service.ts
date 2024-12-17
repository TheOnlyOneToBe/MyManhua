import { Injectable } from '@angular/core';
import { Serie, SerieStatus } from '../models/serie.model';
import { getString, setString } from '@nativescript/core/application-settings';

@Injectable({
    providedIn: 'root'
})
export class SerieDatabaseService {
    private readonly STORAGE_KEY = 'series';
    private series: Serie[] = [];

    constructor() {
        this.loadSeries();
    }

    private loadSeries() {
        const storedSeries = getString(this.STORAGE_KEY);
        if (storedSeries) {
            this.series = JSON.parse(storedSeries);
        }
    }

    private saveSeries() {
        setString(this.STORAGE_KEY, JSON.stringify(this.series));
    }

    async add(serie: Serie): Promise<number> {
        const newId = this.series.length > 0 
            ? Math.max(...this.series.map(s => s.id || 0)) + 1 
            : 1;
        
        const newSerie = { ...serie, id: newId };
        this.series.push(newSerie);
        this.saveSeries();
        return newId;
    }

    async update(serie: Serie): Promise<void> {
        const index = this.series.findIndex(s => s.id === serie.id);
        if (index !== -1) {
            this.series[index] = { ...serie };
            this.saveSeries();
        }
    }

    async delete(id: number): Promise<void> {
        const index = this.series.findIndex(s => s.id === id);
        if (index !== -1) {
            this.series.splice(index, 1);
            this.saveSeries();
        }
    }

    async getSeries(filter: string = 'all', searchQuery: string = ''): Promise<Serie[]> {
        let filteredSeries = [...this.series];
        
        if (filter !== 'all') {
            filteredSeries = filteredSeries.filter(s => s.status === filter);
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredSeries = filteredSeries.filter(s => 
                s.title.toLowerCase().includes(query)
            );
        }
        
        return filteredSeries.sort((a, b) => a.title.localeCompare(b.title));
    }

    async getById(id: number): Promise<Serie | null> {
        return this.series.find(s => s.id === id) || null;
    }
}
