import { NgModule } from '@angular/core';
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

import { ProductService } from './testdata/productservice';
import { PhotoService } from './testdata/photoservice';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HomeComponent,
      IngredientsComponent,
      CategoriesComponent,
      RecipeComponent
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
    ProductService,
    PhotoService,
    DialogService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
