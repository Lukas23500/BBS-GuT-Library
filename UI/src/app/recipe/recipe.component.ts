import { RecipeIngredientService } from 'api-lib/projects/api-lib/src/public-api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { GetRecipeDto } from 'api-lib/projects/api-lib/src/lib/dto/recipe/get-recipe.dto.model';
import { Subject, takeUntil } from 'rxjs';
import { RecipeService } from 'api-lib/projects/api-lib/src/exported-services';
import { RecipeIngredientDto } from 'api-lib/projects/api-lib/src/exported-dtos';
import { RecipeDialogComponent } from './recipe-dialog/recipe-dialog.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit, OnDestroy {

  images: any[] | undefined;
  recipe_id: number = 0;

  responsiveOptions: any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
  ];

  public recipe: GetRecipeDto = {} as GetRecipeDto;
  private selected_ingedient: RecipeIngredientDto = {} as RecipeIngredientDto;

  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private messageService: MessageService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private recipeService: RecipeService,
    private recipeIngredientService: RecipeIngredientService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadRecipes();

    if (+JSON.stringify(this.config.data.id) != 0) {
      this.recipe_id = +JSON.stringify(this.config.data.id);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private loadRecipes() {
    this.recipeService.get(this.recipe_id).pipe(takeUntil(this.onDestroy)).subscribe({
      next: (data) => {
        this.recipe = data;
      },
      error: (exception) => {
        console.log('error by loading all recipe ingredient entries: ' + exception);
      },
      complete: () => {
        console.log('get all recipe ingredient entries complete');
      }
    });
  }

  public editRow(rowData: RecipeIngredientDto) {
    this.selected_ingedient = { ...rowData };
  }

  public saveRow() {
    this.recipeIngredientService.save(this.selected_ingedient).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
          console.log('error by saving new recipe ingredient entry: ' + exception);
      },
      complete: () => {
          console.log('successfully saved recipe ingredient entry');
      },
    });
  }

  public cancelRowEdit() {
    this.selected_ingedient.id = 0;
    this.selected_ingedient.isHidden = false;
    this.selected_ingedient.amount = '';
  }

  public deleteRow(rowData: RecipeIngredientDto) {
    this.recipeIngredientService.delete(rowData.id).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
          console.log('error by deleting new recipe ingredient entry: ' + exception);
      },
      complete: () => {
          console.log('successfully deleted recipe ingredient entry');
      },
    });
  }

  public onUpload(event: FileUploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  }

  public close()
  {
    this.ref.close();
  }

  public show() {
    this.ref = this.dialogService.open(RecipeDialogComponent, {
      header: 'Create a Category',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((recipeIngredient: RecipeIngredientDto) => {
        if (recipeIngredient) {
            this.messageService.add({ severity: 'info', summary: 'Category created', detail: recipeIngredient.ingredientId.toString() });
        }
    });

    this.ref.onMaximize.subscribe((value) => {
        this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }
}

interface City {
  name: string,
  code: string
}
