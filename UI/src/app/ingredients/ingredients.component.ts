import { IngredientService } from 'api-lib/projects/api-lib/src/public-api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GetIngredientDto, IngredientDto } from 'api-lib/projects/api-lib/src/exported-dtos';
import { Subject, takeUntil } from 'rxjs';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { IngredientsDialogComponent } from './ingredients-dialog/ingredients-dialog.component';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent implements OnInit, OnDestroy {

  ref: DynamicDialogRef = new DynamicDialogRef;

  public ingredient_data: GetIngredientDto[] = [];
  private selected_ingredient: IngredientDto = {} as IngredientDto;

  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private messageService: MessageService,
    private ingredientService: IngredientService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadIngredients();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private loadIngredients() {
    this.ingredientService.getAll().pipe(takeUntil(this.onDestroy)).subscribe({
      next: (data) => {
        this.ingredient_data = data;
      },
      error: (exception) => {
        console.log('error by loading all ingredient entries: ' + exception);
      },
      complete: () => {
        console.log('get all ingredient entries complete');
      }
    });
  }

  public editRow(rowData: IngredientDto) {
    this.selected_ingredient = { ...rowData };
  }

  public saveRow() {
    this.ingredientService.save(this.selected_ingredient).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
          console.log('error by saving new ingredient entry: ' + exception);
      },
      complete: () => {
          console.log('successfully saved ingredient entry');
      },
    });
  }

  public cancelRowEdit() {
    this.selected_ingredient.id = 0;
    this.selected_ingredient.isHidden = false;
    this.selected_ingredient.name = '';
  }

  public deleteRow(rowData: IngredientDto) {
    this.ingredientService.delete(rowData.id).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
          console.log('error by deleting new ingredient entry: ' + exception);
      },
      complete: () => {
          console.log('successfully deleted ingredient entry');
      },
    });
  }

  public show() {
    this.ref = this.dialogService.open(IngredientsDialogComponent, {
      header: 'Create an Ingredient',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((category: IngredientDto) => {
        if (category) {
            this.messageService.add({ severity: 'info', summary: 'Ingredient created', detail: category.name });
        }
    });

    this.ref.onMaximize.subscribe((value) => {
        this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }
}
