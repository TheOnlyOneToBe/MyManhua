import { Injectable } from '@angular/core';
import { Film } from '../models/film.model';
import { getString, setString } from '@nativescript/core/application-settings';

@Injectable({
    providedIn: 'root'
})
export class FilmDatabaseService {
    private readonly STORAGE_KEY = 'films';
    private films: Film[] = [];

    constructor() {
        this.loadFilms();
    }

    private loadFilms() {
        const storedFilms = getString(this.STORAGE_KEY);
        if (storedFilms) {
            this.films = JSON.parse(storedFilms);
        }
    }

    private saveFilms() {
        setString(this.STORAGE_KEY, JSON.stringify(this.films));
    }

    async getAll(): Promise<Film[]> {
        return this.films;
    }

    async add(film: Film): Promise<number> {
        const newId = this.films.length > 0 
            ? Math.max(...this.films.map(f => f.id || 0)) + 1 
            : 1;
        
        const newFilm = { ...film, id: newId };
        this.films.push(newFilm);
        this.saveFilms();
        return newId;
    }

    async update(film: Film): Promise<void> {
        const index = this.films.findIndex(f => f.id === film.id);
        if (index !== -1) {
            this.films[index] = { ...film };
            this.saveFilms();
        }
    }

    async delete(id: number): Promise<void> {
        const index = this.films.findIndex(f => f.id === id);
        if (index !== -1) {
            this.films.splice(index, 1);
            this.saveFilms();
        }
    }

    async getById(id: number): Promise<Film | undefined> {
        return this.films.find(f => f.id === id);
    }
}
