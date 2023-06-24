import { Inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { CategoriesComponent } from './categories/categories.component';
import { RecipeComponent } from './recipe/recipe.component';

import { MenubarModule } from 'primeng/menubar';
import { DataViewModule } from 'primeng/dataview';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { GalleriaModule } from 'primeng/galleria';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { SplitterModule } from 'primeng/splitter';

import { API_BASE_URL, CLIENT_URL } from 'api-lib/projects/api-lib/src/lib/service/base.service';
import { CategoriesDialogComponent } from './categories/categories-dialog/categories-dialog.component';
import { IngredientsDialogComponent } from './ingredients/ingredients-dialog/ingredients-dialog.component';
import { RecipeDialogComponent } from './recipe/recipe-dialog/recipe-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HomeComponent,
      IngredientsComponent,
      CategoriesComponent,
      RecipeComponent,
      CategoriesDialogComponent,
      IngredientsDialogComponent,
      RecipeDialogComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MenubarModule,
    DataViewModule,
    RatingModule,
    TagModule,
    DynamicDialogModule,
    ButtonModule,
    DropdownModule,
    PaginatorModule,
    TableModule,
    GalleriaModule,
    MultiSelectModule,
    FileUploadModule,
    ToastModule,
    SplitterModule
  ],
  providers: [
    DialogService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  // baseUrl: string = '';
  // clientUrl: string = '';
  // constructor(
  //   @Inject(API_BASE_URL) baseUrl: string,
  //   @Inject(CLIENT_URL) clientUrl: string
  // ) {
  //   if (baseUrl) this.baseUrl = baseUrl;
  //   if (clientUrl) this.clientUrl = clientUrl;

  //   baseUrl = this.baseUrl;
  //   clientUrl = this.clientUrl;
  // }
}
