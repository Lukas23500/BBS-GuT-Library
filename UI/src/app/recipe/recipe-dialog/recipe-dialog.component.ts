import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GetIngredientDto, IngredientDto, IngredientService, RecipeIngredientDto } from 'api-lib';
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
  public selectedIngredientName: string = '';
  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
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
    this.ref.close(this.newRecipeIngredient);
  }
}
