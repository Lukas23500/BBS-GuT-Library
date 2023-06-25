import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { FileUploadEvent } from 'primeng/fileupload';
import { DifficultyLevel, GetRecipeDto, GetRecipeIngredientDto, ImageGalleryService, RecipeDto, RecipeIngredientDto, RecipeIngredientService, RecipeService } from 'api-lib';
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
    public config: DynamicDialogConfig,
    private recipeService: RecipeService,
    private recipeIngredientService: RecipeIngredientService,
    private dialogService: DialogService,
    private imageGalleryService: ImageGalleryService
  ) { }

  ngOnInit() {
    // this.loadRecipes();
    // this.recipeId = 11;
    this.recipeId = +JSON.stringify(this.config.data.id);
    this.loadRecipes();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  // private loadRecipes() {
  //   this.recipe = { id: 11, name: 'Mischbrot', rating: 3, instruction: 'Die Hefe in etwas Wasser (abgeschöpft von dem 1/2 Liter) auflösen. Das fein gemahlene Roggen- und Weizenmehl in eine Rührschüssel geben und alle Zutaten miteinander verrühren. Den Teig eine Stunde gehen lassen und anschließend nochmals durchkneten. Die Masse in eine gefettete Kastenform geben. Im vorgeheizten Backofen ca. 1 Stunde bei 200°C backen. Tipp: Eine feuerfeste Schüssel mit Wasser im Backofen begünstigt, dass der Teig besser aufgeht.', categoryId: 1, difficultyLevel: DifficultyLevel.Normal, prepTimeMinutes: 15, thumbnailUrl: '',
  //     recipeIngredients: [
  //       {id: 0, ingredient: {id: 0, name: 'Salz'}, amount: 'Eine Briese', ingredientId: 0, isHidden: false, recipeId: 11},
  //       {id: 1, ingredient: {id: 1, name: 'Pfeffer'}, amount: 'Eine Briese', ingredientId: 0, isHidden: false, recipeId: 11},
  //       {id: 2, ingredient: {id: 2, name: 'Chilipulver'}, amount: '10 Gramm', ingredientId: 0, isHidden: false, recipeId: 11},
  //       {id: 3, ingredient: {id: 3, name: 'Mehl'}, amount: '500 Gramm', ingredientId: 0, isHidden: false, recipeId: 11},
  //       {id: 4, ingredient: {id: 4, name: 'Ei'}, amount: '5x', ingredientId: 0, isHidden: false, recipeId: 11}
  //     ],
  //     imageGallery: [
  //       {id: 0, imageUrl: '"C:\Users\LukasSchneider\source\repos\BBS-GuT-Library\UI\src\assets\images\brot1.jpg"', isHidden: false, recipeId: 11},
  //       {id: 1, imageUrl: '"C:\Users\LukasSchneider\source\repos\BBS-GuT-Library\UI\src\assets\images\brot1.jpg"', isHidden: false, recipeId: 11},
  //       {id: 2, imageUrl: '"C:\Users\LukasSchneider\source\repos\BBS-GuT-Library\UI\src\assets\images\brot1.jpg"', isHidden: false, recipeId: 11}
  //     ]};
  // }

  private loadRecipes() {
    if (this.recipeId == 0){
      this.recipe = {} as GetRecipeDto;
      this.recipe.recipeIngredients = [{} as RecipeIngredientDto];
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
  }

  public saveRow(rowData: RecipeIngredientDto) {
    this.recipeIngredientService.save(rowData).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by saving new recipe ingredient entry: ' + exception);
      },
      complete: () => {
        console.log('successfully saved recipe ingredient entry');
      },
    });
  }

  public deleteRow(rowData: RecipeIngredientDto) {
    this.recipeIngredientService.delete(rowData.id).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by deleting new recipe ingredient entry: ' + exception);
      },
      complete: () => {
        console.log('successfully deleted recipe ingredient entry');
      },
    });
  }

  public onUpload(event: FileUploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }

  public close() {
    this.ref.close();
  }

  public show() {
    this.ref = this.dialogService.open(RecipeDialogComponent, {
      header: 'Add an ingredient',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((recipeIngredient: RecipeIngredientDto) => {
      if (recipeIngredient) {
        this.messageService.add({ severity: 'info', summary: 'Category created', detail: recipeIngredient.ingredientId.toString() });
      }
    });

    this.ref.onMaximize.subscribe((value) => {
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
      },
    });
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
    };
  }
}

interface City {
  name: string,
  code: string;
}
