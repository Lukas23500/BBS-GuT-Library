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

  public newIngredient: IngredientDto = {} as IngredientDto;
  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private ingredientService: IngredientService
  ) { }

  ngOnInit(): void {
    this.newIngredient = {} as IngredientDto;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  public saveNewEntry() {
    this.ingredientService.save(this.newIngredient).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by creating new ingredient entry: ' + exception);
        this.ref.close();
      },
      complete: () => {
        console.log('successfully created ingredient entry');
      },
    });
  }
}
