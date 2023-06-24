import { IngredientDto, RecipeService } from 'api-lib/projects/api-lib/src/public-api';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RecipeComponent } from '../recipe/recipe.component';
import { GetRecipeDto } from 'api-lib/projects/api-lib/src/lib/dto/recipe/get-recipe.dto.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  ref: DynamicDialogRef = new DynamicDialogRef;

  public recipe_data: GetRecipeDto[] = [];

  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private loadRecipes() {
    this.recipeService.getAll('', 0).pipe(takeUntil(this.onDestroy)).subscribe({
      next: (data) => {
        this.recipe_data = data;
      },
      error: (exception) => {
        console.log('error by loading all recipe entries: ' + exception);
      },
      complete: () => {
        console.log('get all recipe entries complete');
      }
    });
  }

  show(recipe_id: any) {
    this.ref = this.dialogService.open(RecipeComponent, {
      header: 'Recipe Details',
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        id: recipe_id
      }
    });

    this.ref.onClose.subscribe((ingredient: IngredientDto) => {});

    this.ref.onMaximize.subscribe((value) => {
        this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  onSortChange(event: any) {
      let value = event.value;

      if (value.indexOf('!') === 0) {
          this.sortOrder = -1;
          this.sortField = value.substring(1, value.length);
      } else {
          this.sortOrder = 1;
          this.sortField = value;
      }
  }
}
