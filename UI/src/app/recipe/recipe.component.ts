import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { FileUploadEvent } from 'primeng/fileupload';
import { DifficultyLevel, GetRecipeDto, RecipeDto, RecipeIngredientDto, RecipeService, CategoryService, GetCategoryDto } from 'api-lib';
import { MessageService } from 'primeng/api';
import { RecipeDialogComponent } from './recipe-dialog/recipe-dialog.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit, OnDestroy {

  public recipeId: number = 0;
  public recipe: GetRecipeDto = {} as GetRecipeDto;
  public categoryData: GetCategoryDto[] = [];
  private onDestroy: Subject<void> = new Subject<void>();
  public difficultyLevel = [{name: 'Simple'},{name: 'Normal'},{name: 'Nifty'}];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  constructor(
    private messageService: MessageService,
    public ref: DynamicDialogRef,
    public ref2: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private recipeService: RecipeService,
    private dialogService: DialogService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.recipeId = +JSON.stringify(this.config.data.id);
    this.loadRecipe();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private loadRecipe() {
    if (this.recipeId == 0){
      this.initRecipe();
    }else{
      this.recipeService.get(this.recipeId).pipe(takeUntil(this.onDestroy)).subscribe({
        next: (data) => {
          this.recipe = data;
        },
        error: (exception) => {
          console.log('error by loading all recipe ingredient entries: ' + exception);
        },
        complete: () => {
          console.log('get all recipe ingredient entries complete');
        }
      });
    }
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

  private initRecipe() {
    this.recipe = {
      id: 0,
      name: '',
      instruction: '',
      rating: 1,
      prepTimeMinutes: 10,
      difficultyLevel: DifficultyLevel.Simple,
      categoryId: 0,
      thumbnailUrl: '',
      imageGallery: [],
      recipeIngredients: []
    };
  }

  public deleteRecipeIngredientRow(rowData: RecipeIngredientDto) {
    const index = this.recipe.recipeIngredients.indexOf(rowData);
    if (index > -1) {
      this.recipe.recipeIngredients.splice(index, 1);
    }
  }

  public onUpload(event: FileUploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Image uploaded', detail: 'File Uploaded with Basic Mode' });
  }

  public close() {
    this.ref.close();
  }

  public showRecipeIngredientDialog() {
    this.ref2 = this.dialogService.open(RecipeDialogComponent, {
      header: 'Add an ingredient',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref2.onClose.subscribe((recipeIngredient: RecipeIngredientDto) => {
      if (recipeIngredient) {
        this.recipe.recipeIngredients.push(recipeIngredient);
        this.messageService.add({ severity: 'info', summary: 'Recipe Ingredient added', detail: recipeIngredient.ingredient.name });
      }
    });

    this.ref2.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  public saveNewRecipe() {
    this.recipeService.save(this.mapRecipe(this.recipe, false)).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by creating new recipe entry: ' + exception);
      },
      complete: () => {
        console.log('successfully created recipe entry');
        this.ref.close(this.recipe);
      },
    });
  }

  public saveRecipe() {
    this.recipeService.save(this.mapRecipe(this.recipe, false)).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by saving new recipe entry: ' + exception);
      },
      complete: () => {
        console.log('successfully saved recipe entry');
        this.ref.close(this.recipe);
      },
    });
  }

  public deleteRecipe() {
    this.recipeService.delete(this.recipe.id).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by deleting new recipe entry: ' + exception);
      },
      complete: () => {
        console.log('successfully deleted recipe entry');
        this.ref.close(this.recipe);
      },
    });
  }

  public onSortChange(event: any) {
    this.recipe.categoryId = event.value.id;
  }

  public onDifficultyChange(event: any) {
    this.recipe.difficultyLevel = event.value.id;
  }

  private mapRecipe(recipe: GetRecipeDto, isHidden: boolean): RecipeDto {
    return {
      id: recipe.id,
      categoryId: recipe.categoryId,
      difficultyLevel: recipe.difficultyLevel,
      imageGallery: recipe.imageGallery,
      instruction: recipe.instruction,
      isHidden: isHidden,
      name: recipe.name,
      prepTimeMinutes: recipe.prepTimeMinutes,
      rating: recipe.rating,
      recipeIngredients: recipe.recipeIngredients,
      thumbnailUrl: recipe.thumbnailUrl
    } as RecipeDto;
  }
}
