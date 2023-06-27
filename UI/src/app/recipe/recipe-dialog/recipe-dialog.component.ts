import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GetIngredientDto, IngredientDto, IngredientService, RecipeIngredientDto } from 'api-lib';
import { Observable, Subject, share, takeUntil } from 'rxjs';

@Component({
  selector: 'app-recipe-dialog',
  templateUrl: './recipe-dialog.component.html',
  styleUrls: ['./recipe-dialog.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RecipeDialogComponent implements OnDestroy, OnInit {

  public newRecipeIngredient: RecipeIngredientDto = {} as RecipeIngredientDto;
  public ingredients: Observable<GetIngredientDto[]> = new Observable<GetIngredientDto[]>;
  public selectedIngredient: IngredientDto = {} as IngredientDto;
  public selectedIngredientName: string = '';
  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private ingredientService: IngredientService
  ) { }

  ngOnInit(): void {
    this.ingredients = this.loadIngredients();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private loadIngredients(): Observable<GetIngredientDto[]> {
    return this.ingredientService.getAll().pipe(share());
  }

  public saveNewEntry() {
    this.newRecipeIngredient.ingredient = this.selectedIngredient;
    this.newRecipeIngredient.ingredientId = this.selectedIngredient.id;
    this.ref.close(this.newRecipeIngredient);
  }
}
