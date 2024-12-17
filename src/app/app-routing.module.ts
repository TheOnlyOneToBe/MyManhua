import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { ItemsComponent } from './item/items.component'
import { ItemDetailComponent } from './item/item-detail.component'
import { FilmListComponent } from './components/film-list/film-list.component'
import { ManhuaListComponent } from './components/manhua-list/manhua-list.component'
import { SerieListComponent } from './components/serie-list/serie-list.component'

const routes: Routes = [
  { path: '', redirectTo: '/films', pathMatch: 'full' },
  { path: 'films', component: FilmListComponent },
  { path: 'manhuas', component: ManhuaListComponent },
  { path: 'series', component: SerieListComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'item/:id', component: ItemDetailComponent }
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
