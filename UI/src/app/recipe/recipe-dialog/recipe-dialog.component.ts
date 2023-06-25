import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RecipeIngredientDto, RecipeIngredientService } from 'api-lib';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-recipe-dialog',
  templateUrl: './recipe-dialog.component.html',
  styleUrls: ['./recipe-dialog.component.scss']
})
export class RecipeDialogComponent implements OnDestroy, OnInit {

  public new_recipe_ingredient: RecipeIngredientDto = {} as RecipeIngredientDto;

  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private recipeIngredientService: RecipeIngredientService
  ) { }

  ngOnInit(): void {
    this.new_recipe_ingredient = {} as RecipeIngredientDto;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  public saveNewEntry() {
    this.recipeIngredientService.save(this.new_recipe_ingredient).pipe(takeUntil(this.onDestroy)).subscribe({
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
