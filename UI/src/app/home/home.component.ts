import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { RecipeComponent } from '../recipe/recipe.component';
import { RecipeService, GetRecipeDto, GetCategoryDto, CategoryService } from 'api-lib';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public categoryData: GetCategoryDto[] = [];
  private ref: DynamicDialogRef = new DynamicDialogRef;
  public recipeData: GetRecipeDto[] = [];
  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService,
    private recipeService: RecipeService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadRecipes();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private loadRecipes() {
    this.recipeService.getAll('', 0).pipe(takeUntil(this.onDestroy)).subscribe({
      next: (data) => {
        this.recipeData = data;
      },
      error: (exception) => {
        console.log('error by loading all recipe entries: ' + exception);
      },
      complete: () => {
        console.log('get all recipe entries complete');
      }
    });
    this.categoryService.getAll().pipe(takeUntil(this.onDestroy)).subscribe({
      next: (data) => {
        this.categoryData = data;
      },
      error: (exception) => {
        console.log('error by loading all category entries: ' + exception);
      },
      complete: () => {
        console.log('get all category entries complete');
      }
    });
  }

  show(recipeId: any) {
    this.ref = this.dialogService.open(RecipeComponent, {
      header: 'Recipe Details',
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        id: recipeId
      }
    });

    this.ref.onClose.subscribe((recipe: GetRecipeDto) => {
      if (recipe) {
        const index = this.recipeData.indexOf(recipe);
        if (index > -1) {
          this.recipeData[index] = recipe;
        }
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  onSortChange(event: any) {
    if (event.value.title == 'All') {
      this.recipeData.filter((recipe: GetRecipeDto) => recipe.categoryId !== null);
    }else{
      this.recipeData.filter((recipe: GetRecipeDto) => recipe.categoryId === event.value.id);
    }
  }
}
