import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { GetIngredientDto, IngredientDto, IngredientService } from 'api-lib';
import { IngredientsDialogComponent } from './ingredients-dialog/ingredients-dialog.component';
import { MessageService } from 'primeng/api';
import { Observable, Subject, share, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class IngredientsComponent implements OnInit, OnDestroy {

  private onDestroy: Subject<void> = new Subject<void>();
  private ref: DynamicDialogRef = new DynamicDialogRef;
  public ingredients: Observable<GetIngredientDto[]> = new Observable<GetIngredientDto[]>;

  constructor(
    private messageService: MessageService,
    private ingredientService: IngredientService,
    private dialogService: DialogService
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

  public saveRow(rowData: IngredientDto) {
    this.ingredientService.save(rowData).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('errors at saving new ingredient entry: ' + exception);
      },
      complete: () => {
        console.log('successfully saved ingredient entry');
      },
    });
  }

  public deleteRow(rowData: IngredientDto, ingredients: GetIngredientDto[]) {
    this.ingredientService.delete(rowData.id).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('errors at deleting new ingredient entry: ' + exception);
      },
      complete: () => {
        const index = ingredients.indexOf(rowData);
        if (index > -1) {
          ingredients.splice(index, 1);
        }
        console.log('successfully deleted ingredient entry');
      },
    });
  }

  public show(ingredients?: GetIngredientDto[]) {
    this.ref = this.dialogService.open(IngredientsDialogComponent, {
      header: 'Create an Ingredient',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((ingredient: IngredientDto) => {
      if (ingredient) {
        ingredients?.push(ingredient)
        this.messageService.add({ severity: 'info', summary: 'Ingredient created', detail: ingredient.name });
        // this.ingredients = this.loadIngredients();
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }
}
