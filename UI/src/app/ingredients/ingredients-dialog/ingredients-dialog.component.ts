import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IngredientDto, IngredientService } from 'api-lib';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ingredients-dialog',
  templateUrl: './ingredients-dialog.component.html',
  styleUrls: ['./ingredients-dialog.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class IngredientsDialogComponent implements OnInit, OnDestroy {

  private onDestroy: Subject<void> = new Subject<void>();
  public newIngredient: IngredientDto = {} as IngredientDto;

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
      next: (res) => {
        this.ref.close(res);
      },
      error: (exception) => {
        console.log('errors at creating new ingredient entry: ' + exception);
      },
      complete: () => {
        console.log('successfully created ingredient entry');
      },
    });
  }
}
