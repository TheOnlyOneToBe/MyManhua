import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'
import { NativeScriptFormsModule } from '@nativescript/angular'
import { NativeScriptCommonModule } from '@nativescript/angular'
import { ModalDialogService } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ItemsComponent } from './item/items.component'
import { ItemDetailComponent } from './item/item-detail.component'
import { FilmListComponent } from './components/film-list/film-list.component'
import { FilmModalComponent } from './components/film-modal/film-modal.component'
import { ManhuaListComponent } from './components/manhua-list/manhua-list.component'
import { ManhuaModalComponent } from './components/manhua-modal/manhua-modal.component'
import { SerieListComponent } from './components/serie-list/serie-list.component'
import { SerieModalComponent } from './components/serie-modal/serie-modal.component'
import { ManhuaDatabaseService } from './services/manhua-database.service'
import { FilmDatabaseService } from './services/film-database.service'
import { ImageService } from './services/image.service'
import { ImagePicker } from '@nativescript/imagepicker'

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptCommonModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemDetailComponent,
    FilmListComponent,
    FilmModalComponent,
    ManhuaListComponent,
    ManhuaModalComponent,
    SerieListComponent,
    SerieModalComponent
  ],
  providers: [
    ManhuaDatabaseService,
    FilmDatabaseService,
    ImageService,
    ModalDialogService
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
    FilmModalComponent,
    ManhuaModalComponent,
    SerieModalComponent
  ]
})
export class AppModule {}
