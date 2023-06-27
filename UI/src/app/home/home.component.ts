import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { RecipeComponent } from '../recipe/recipe.component';
import { RecipeService, GetRecipeDto, GetCategoryDto, CategoryService, RecipeDto } from 'api-lib';
import { Observable, Subject, of, share, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private ref: DynamicDialogRef = new DynamicDialogRef;
  private selectedCategoryId: number = 0;
  public categories: Observable<GetCategoryDto[]> = new Observable<GetCategoryDto[]>();
  public recipes: Observable<GetRecipeDto[]> = new Observable<GetRecipeDto[]>;
  public selectedRecipeFilter: string = '';

  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService,
    private recipeService: RecipeService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.recipes = this.loadRecipes();
    this.categories = this.loadCategories();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private loadRecipes(): Observable<GetRecipeDto[]> {
    return this.recipeService.getAll().pipe(share());
  }

  private loadCategories(): Observable<GetCategoryDto[]> {
    return this.categoryService.getAll().pipe(share());
  }

  show(recipe: GetRecipeDto, categories: GetCategoryDto[]) {
    this.ref = this.dialogService.open(RecipeComponent, {
      header: 'Recipe Details',
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        recipeId: recipe.id,
        categories: categories
      }
    });

    this.ref.onClose.subscribe((recipe: GetRecipeDto) => {
      if (recipe) {
        // const index = this.recipes.indexOf(recipe);
        // if (index > -1) {
        //   this.recipes[index] = of(recipe);
        // }
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  onSortChange(event: any) {
    this.selectedCategoryId = event.value.id;
  }
}
