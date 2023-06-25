import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { RecipeComponent } from '../recipe/recipe.component';
import { RecipeService, GetRecipeDto, IngredientDto, DifficultyLevel, GetCategoryDto, CategoryService } from 'api-lib';
import { SelectItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public categoryData: GetCategoryDto[] = [];
  private ref: DynamicDialogRef = new DynamicDialogRef;
  public recipeData: GetRecipeDto[] = [];
  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService,
    private recipeService: RecipeService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadRecipes();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  // private loadRecipes() {
  //   this.recipeData = [
  //     {id: 11, name: 'Mischbrot', rating: 3, instruction: 'Die Hefe in etwas Wasser (abgeschöpft von dem 1/2 Liter) auflösen. Das fein gemahlene Roggen- und Weizenmehl in eine Rührschüssel geben und alle Zutaten miteinander verrühren. Den Teig eine Stunde gehen lassen und anschließend nochmals durchkneten. Die Masse in eine gefettete Kastenform geben. Im vorgeheizten Backofen ca. 1 Stunde bei 200°C backen. Tipp: Eine feuerfeste Schüssel mit Wasser im Backofen begünstigt, dass der Teig besser aufgeht.', categoryId: 1, difficultyLevel: DifficultyLevel.Normal, prepTimeMinutes: 15, thumbnailUrl: '',
  //     recipeIngredients: [],
  //     imageGallery: []}
  //   ];
  //   this.categoryData = [
  //     {id: -1, title: 'All'},
  //     {id: 0, title: 'Suppe'},
  //     {id: 1, title: 'Auflauf'},
  //     {id: 2, title: 'Brot'},
  //     {id: 3, title: 'Pizza'},
  //     {id: 4, title: 'Burger'}
  //   ];
  // }

  private loadRecipes() {
    this.recipeService.getAll('', 0).pipe(takeUntil(this.onDestroy)).subscribe({
      next: (data) => {
        this.recipeData = data;
      },
      error: (exception) => {
        console.log('error by loading all recipe entries: ' + exception);
      },
      complete: () => {
        console.log('get all recipe entries complete');
      }
    });
    this.categoryService.getAll().pipe(takeUntil(this.onDestroy)).subscribe({
      next: (data) => {
        this.categoryData = data;
      },
      error: (exception) => {
        console.log('error by loading all category entries: ' + exception);
      },
      complete: () => {
        console.log('get all category entries complete');
      }
    });
  }

  show(recipeId: any) {
    this.ref = this.dialogService.open(RecipeComponent, {
      header: 'Recipe Details',
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        id: recipeId
      }
    });

    this.ref.onClose.subscribe((ingredient: IngredientDto) => { });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  onSortChange(event: any) {
    if (event.value.title == 'All') {
      this.recipeData.filter((recipe: GetRecipeDto) => recipe.categoryId !== null);
    }else{
      this.recipeData.filter((recipe: GetRecipeDto) => recipe.categoryId === event.value.id);
    }
  }
}
