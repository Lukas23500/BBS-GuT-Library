import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { FileUploadEvent } from 'primeng/fileupload';
import { DifficultyLevel, GetRecipeDto, RecipeDto, RecipeIngredientDto, RecipeService, CategoryService, GetCategoryDto, ImageGalleryDto } from 'api-lib';
import { MessageService } from 'primeng/api';
import { RecipeDialogComponent } from './recipe-dialog/recipe-dialog.component';
import { Observable, Subject, of, share, takeUntil } from 'rxjs';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit, OnDestroy {
  public get DifficultyLevel(): any {
    return Object.entries(DifficultyLevel);
  }


  // public recipe: GetRecipeDto = {} as GetRecipeDto;
  public recipe: Observable<RecipeDto> = new Observable<RecipeDto>;
  public recipeId: number = 0;
  public categories: GetCategoryDto[] = [];
  private onDestroy: Subject<void> = new Subject<void>();

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
  ) { }

  ngOnInit() {
    this.recipeId = JSON.parse(this.config.data.recipeId);
    this.categories = JSON.parse(this.config.data.categories);

    if (this.recipeId == 0) {
      this.recipe = this.initNewRecipe();
    } else {
      this.recipe = this.loadRecipe();
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private initNewRecipe() {
    const newRecipe: RecipeDto = {
      id: 0,
      name: '',
      instruction: '',
      rating: 1,
      prepTimeMinutes: 0,
      difficultyLevel: DifficultyLevel.Simple,
      categoryId: 0,
      thumbnailUrl: '',
      imageGallery: [] as ImageGalleryDto[],
      recipeIngredients: [] as RecipeIngredientDto[],
      isHidden: false
    };

    return of(newRecipe);
  }

  private loadRecipe(): Observable<RecipeDto> {
    return this.recipeService.get(this.recipeId).pipe(share());
  }

  public deleteRecipeIngredientRow(recipe: RecipeDto, rowData: RecipeIngredientDto) {
    const index = recipe.recipeIngredients.indexOf(rowData);
    if (index > -1) {
      recipe.recipeIngredients.splice(index, 1);
    }
  }

  public onUpload(event: FileUploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Image uploaded', detail: 'File Uploaded with Basic Mode' });
  }

  public close() {
    this.ref.close();
  }

  public showRecipeIngredientDialog(recipe: RecipeDto) {
    this.ref2 = this.dialogService.open(RecipeDialogComponent, {
      header: 'Add an ingredient',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref2.onClose.subscribe((recipeIngredient: RecipeIngredientDto) => {
      if (recipeIngredient) {
        recipe.recipeIngredients.push(recipeIngredient);
        this.messageService.add({ severity: 'info', summary: 'Recipe Ingredient added', detail: recipeIngredient.ingredient.name });
      }
    });

    this.ref2.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  public saveRecipe(recipe: RecipeDto) {
    this.recipeService.save(recipe).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by saving new recipe entry: ' + exception);
      },
      complete: () => {
        console.log('successfully saved recipe entry');
        this.ref.close(recipe);
      },
    });
  }

  public deleteRecipe(recipe: RecipeDto) {
    this.recipeService.delete(recipe.id).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by deleting new recipe entry: ' + exception);
      },
      complete: () => {
        console.log('successfully deleted recipe entry');
        this.ref.close(recipe);
      },
    });
  }

  public onSortChange(recipe: RecipeDto, event: any) {
    recipe.categoryId = event.value.id;
  }

  public onDifficultyChange(recipe: RecipeDto, event: any) {
    recipe.difficultyLevel = event.value.id;
  }
}
