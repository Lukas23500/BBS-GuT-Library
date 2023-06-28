import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { FileUploadEvent } from 'primeng/fileupload';
import { RecipeDto, RecipeIngredientDto, RecipeService, GetCategoryDto, ImageGalleryDto, CategoryService, DifficultyLevel, UploadImageGalleryDto, ImageGalleryService } from 'api-lib';
import { MessageService } from 'primeng/api';
import { RecipeDialogComponent } from './recipe-dialog/recipe-dialog.component';
import { Observable, Subject, of, share, takeUntil } from 'rxjs';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RecipeComponent implements OnInit, OnDestroy {
  private onDestroy: Subject<void> = new Subject<void>();
  private uploadImageGallery: UploadImageGalleryDto = {} as UploadImageGalleryDto;
  public categories: Observable<GetCategoryDto[]> = new Observable<GetCategoryDto[]>;
  public difficultyLevel: any[];
  public recipe: Observable<RecipeDto> = new Observable<RecipeDto>;
  public recipeId: number = 0;
  public selectedCategory: GetCategoryDto = {} as GetCategoryDto;

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

  constructor(
    private messageService: MessageService,
    public ref: DynamicDialogRef,
    public ref2: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    private imageGalleryService: ImageGalleryService,
    private dialogService: DialogService,
  ) {
    this.difficultyLevel = Object.values(DifficultyLevel);
  }

  ngOnInit() {
    this.recipeId = JSON.parse(this.config.data.recipeId);
    this.categories = this.loadCategories();

    if (this.recipeId == 0) {
      this.recipe = this.initNewRecipe();
    } else {
      this.recipe = this.loadRecipe();
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private initNewRecipe() {
    const newRecipe: RecipeDto = {
      id: 0,
      name: '',
      instruction: '',
      rating: 1,
      prepTimeMinutes: 0,
      difficultyLevel: DifficultyLevel.Simple,
      categoryId: 0,
      thumbnailUrl: '',
      imageGallery: [] as ImageGalleryDto[],
      recipeIngredients: [] as RecipeIngredientDto[],
      isHidden: false
    };

    return of(newRecipe);
  }

  private loadRecipe(): Observable<RecipeDto> {
    return this.recipeService.get(this.recipeId).pipe(share());
  }

  private loadCategories(): Observable<GetCategoryDto[]> {
    return this.categoryService.getAll().pipe(share());
  }

  public deleteRecipeIngredientRow(recipe: RecipeDto, rowData: RecipeIngredientDto) {
    const index = recipe.recipeIngredients.indexOf(rowData);
    if (index > -1) {
      recipe.recipeIngredients.splice(index, 1);
    }
  }

  public close() {
    this.ref.close(-1);
  }

  public showRecipeIngredientDialog(recipe: RecipeDto) {
    this.ref2 = this.dialogService.open(RecipeDialogComponent, {
      header: 'Add an ingredient',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref2.onClose.subscribe((recipeIngredient: RecipeIngredientDto) => {
      if (recipeIngredient) {
        recipe.recipeIngredients.push(recipeIngredient);
        this.messageService.add({ severity: 'info', summary: 'Recipe Ingredient added', detail: recipeIngredient.ingredient.name });
      }
    });

    this.ref2.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  public saveRecipe(recipe: RecipeDto) {
    this.recipeService.save(recipe).pipe(takeUntil(this.onDestroy)).subscribe({
      next: (res) => {
        if (this.uploadImageGallery.fileBase64?.length > 0) {
          this.uploadImage(recipe);
        }
        this.ref.close(res.id);
      },
      error: (exception) => {
        console.log('errors at saving new recipe entry: ' + exception);
      },
      complete: () => {
        console.log('successfully saved recipe entry');
      },
    });
  }

  public deleteRecipe(recipe: RecipeDto) {
    this.recipeService.delete(recipe.id).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('errors at deleting new recipe entry: ' + exception);
      },
      complete: () => {
        console.log('successfully deleted recipe entry');
        this.ref.close(recipe.id);
      },
    });
  }

  public onCategoryChange(recipe: RecipeDto, event: any) {
    recipe.categoryId = event.value.id;
  }

  public onDifficultyChange(recipe: RecipeDto, event: any) {
    recipe.difficultyLevel = event.value.id;
  }

  public onUploadNewImage(recipe: RecipeDto, event: FileUploadEvent) {
    let fileList: File[] = event.files;
    const file: File = fileList[0];

    let fileReader = new FileReader();
    fileReader.onloadend = () => {
      const fileBase64: string = fileReader.result as string;
      this.uploadImageGallery.fileBase64 = fileBase64;
    };
    fileReader.readAsText(file);

    this.uploadImageGallery = {
      id: 0,
      recipeId: 0,
      type: file.type,
      fileName: file.name,
      fileBase64: ''
    };
  }

  private uploadImage(recipe: RecipeDto) {
    this.uploadImageGallery.id = recipe.imageGallery.length > 0 ? recipe.imageGallery[0].id : 0
    this.uploadImageGallery.recipeId = recipe.id;

    this.imageGalleryService.upload(this.uploadImageGallery).pipe(takeUntil(this.onDestroy)).subscribe({
      next: (res) => {
        this.uploadImageGallery = {} as UploadImageGalleryDto;

        recipe.thumbnailUrl = res.imageUrl;
        this.saveRecipe(recipe);

        console.log('successfully uploaded image');
      },
      error: (exception) => {
        console.log('errors at uploading image ' + exception);
      }
    });
  }
}
