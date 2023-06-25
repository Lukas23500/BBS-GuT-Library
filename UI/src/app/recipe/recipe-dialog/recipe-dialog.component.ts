import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GetIngredientDto, IngredientDto, IngredientService, RecipeIngredientDto, RecipeIngredientService } from 'api-lib';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-recipe-dialog',
  templateUrl: './recipe-dialog.component.html',
  styleUrls: ['./recipe-dialog.component.scss']
})
export class RecipeDialogComponent implements OnDestroy, OnInit {

  public newRecipeIngredient: RecipeIngredientDto = {} as RecipeIngredientDto;
  public ingredientData: GetIngredientDto[] = [];
  public selectedIngredient: IngredientDto = {} as IngredientDto;
  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private recipeIngredientService: RecipeIngredientService,
    private ingredientService: IngredientService
  ) { }

  ngOnInit(): void {
    this.newRecipeIngredient = {} as RecipeIngredientDto;
    this.loadIngredients();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  // private loadIngredients() {
  //   this.ingredientData = [
  //     {id: 0, name: 'Salz'},
  //     {id: 1, name: 'Pfeffer'},
  //     {id: 2, name: 'Chilipulver'},
  //     {id: 3, name: 'Mehl'},
  //     {id: 4, name: 'Ei'}
  //   ];
  // }

  private loadIngredients() {
    this.ingredientService.getAll().pipe(takeUntil(this.onDestroy)).subscribe({
      next: (data) => {
        this.ingredientData = data;
      },
      error: (exception) => {
        console.log('error by loading all ingredient entries: ' + exception);
      },
      complete: () => {
        console.log('get all ingredient entries complete');
      }
    });
  }

  public saveNewEntry() {
    this.newRecipeIngredient.ingredient = this.selectedIngredient;
    this.recipeIngredientService.save(this.newRecipeIngredient).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by creating new recipe ingredient entry: ' + exception);
      },
      complete: () => {
        console.log('successfully created recipe ingredient entry');
      },
    });
  }

  close() {
    this.ref.close();
  }
}
