import { API_BASE_URL, CLIENT_URL } from 'api-lib';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { CategoriesComponent } from './categories/categories.component';
import { CategoriesDialogComponent } from './categories/categories-dialog/categories-dialog.component';
import { DataViewModule } from 'primeng/dataview';
import { DialogService } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { GalleriaModule } from 'primeng/galleria';
import { HomeComponent } from './home/home.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { IngredientsDialogComponent } from './ingredients/ingredients-dialog/ingredients-dialog.component';
import { Inject, NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { MenubarModule } from 'primeng/menubar';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { RatingModule } from 'primeng/rating';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipeDialogComponent } from './recipe/recipe-dialog/recipe-dialog.component';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    CategoriesDialogComponent,
    HomeComponent,
    IngredientsComponent,
    IngredientsDialogComponent,
    LayoutComponent,
    RecipeComponent,
    RecipeDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ButtonModule,
    DataViewModule,
    DropdownModule,
    DynamicDialogModule,
    FileUploadModule,
    FormsModule,
    GalleriaModule,
    MenubarModule,
    MultiSelectModule,
    PaginatorModule,
    RatingModule,
    SplitterModule,
    TableModule,
    TagModule,
    ToastModule,
  ],
  providers: [
    DialogService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  baseUrl: string = '';
  clientUrl: string = '';
  constructor(
    @Inject(API_BASE_URL) baseUrl: string,
    @Inject(CLIENT_URL) clientUrl: string
  ) {
    if (baseUrl) this.baseUrl = baseUrl;
    if (clientUrl) this.clientUrl = clientUrl;

    baseUrl = this.baseUrl;
    clientUrl = this.clientUrl;
  }
}
