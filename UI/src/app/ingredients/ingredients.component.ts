import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { GetIngredientDto, IngredientDto, IngredientService } from 'api-lib';
import { IngredientsDialogComponent } from './ingredients-dialog/ingredients-dialog.component';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class IngredientsComponent implements OnInit, OnDestroy {

  private ref: DynamicDialogRef = new DynamicDialogRef;
  public ingredientData: GetIngredientDto[] = [];
  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private messageService: MessageService,
    private ingredientService: IngredientService,
    private dialogService: DialogService
  ) { }

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

  public saveRow(rowData: IngredientDto) {
    this.ingredientService.save(rowData).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by saving new ingredient entry: ' + exception);
      },
      complete: () => {
        console.log('successfully saved ingredient entry');
      },
    });
  }

  public deleteRow(rowData: IngredientDto) {
    this.ingredientService.delete(rowData.id).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by deleting new ingredient entry: ' + exception);
      },
      complete: () => {
        console.log('successfully deleted ingredient entry');
        const index = this.ingredientData.indexOf(rowData);
        if (index > -1) {
          this.ingredientData.splice(index, 1);
        }
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

    this.ref.onClose.subscribe((ingredient: IngredientDto) => {
      if (ingredient) {
        this.messageService.add({ severity: 'info', summary: 'Ingredient created', detail: ingredient.name });
        this.loadIngredients();
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }
}
