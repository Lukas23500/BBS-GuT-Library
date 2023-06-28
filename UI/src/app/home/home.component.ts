import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { RecipeComponent } from '../recipe/recipe.component';
import { RecipeService, GetRecipeDto, GetCategoryDto, CategoryService, RecipeDto, CategoryDto, API_BASE_URL } from 'api-lib';
import { Observable, of, share } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent implements OnInit {

  private ref: DynamicDialogRef = new DynamicDialogRef;
  public apiBaseUrl: string = '';
  public categories: Observable<GetCategoryDto[]> = new Observable<GetCategoryDto[]>();
  public recipes: Observable<GetRecipeDto[]> = new Observable<GetRecipeDto[]>;
  public selectedCategory?: CategoryDto;
  public selectedRecipeFilter: string = '';

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService,
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    @Inject(API_BASE_URL) baseUrl?: string
  ) {
    if (baseUrl) this.apiBaseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.recipes = this.loadRecipes();
    this.categories = this.loadCategories();
  }

  private loadRecipes(name?: string, categoryId?: number): Observable<GetRecipeDto[]> {
    return this.recipeService.getAll(name, categoryId).pipe(share());
  }

  private loadCategories(): Observable<GetCategoryDto[]> {
    return this.categoryService.getAll().pipe(share());
  }

  filterData() {
    this.recipes = this.loadRecipes(this.selectedRecipeFilter, this.selectedCategory?.id);
  }

  showRecipeDialog(recipe: GetRecipeDto, recipes: GetRecipeDto[]) {
    this.ref = this.dialogService.open(RecipeComponent, {
      header: 'Recipe Details',
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        recipeId: recipe.id
      }
    });

    this.ref.onClose.subscribe((recipe: GetRecipeDto) => {
      if (recipe) {
        // const index = recipes.findIndex(e => e.id == recipe.id);
        // if (index > -1) {
        //   recipes[index] = recipe;
        // }
        this.recipes = this.loadRecipes();
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  showCreateDialog(recipes: GetRecipeDto[]) {
    this.ref = this.dialogService.open(RecipeComponent, {
      header: 'Create a Recipe',
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        recipeId: 0
      }
    });

    this.ref.onClose.subscribe((recipe: RecipeDto) => {
      if (recipe) {
        this.recipes = this.loadRecipes();
        this.messageService.add({ severity: 'info', summary: 'Recipe created', detail: recipe.name });
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }
}
