import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IngredientDto, IngredientService } from 'api-lib';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ingredients-dialog',
  templateUrl: './ingredients-dialog.component.html',
  styleUrls: ['./ingredients-dialog.component.scss']
})
export class IngredientsDialogComponent implements OnInit, OnDestroy {

  public new_ingredient: IngredientDto = {} as IngredientDto;

  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private ingredientService: IngredientService
  ) { }

  ngOnInit(): void {
    this.new_ingredient = {} as IngredientDto;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  public saveNewEntry() {
    this.ingredientService.save(this.new_ingredient).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by creating new ingredient entry: ' + exception);
      },
      complete: () => {
        console.log('successfully created ingredient entry');
      },
    });
  }

  close() {
    this.ref.close();
  }
}
