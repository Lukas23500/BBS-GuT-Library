import { CategoriesDialogComponent } from './categories-dialog/categories-dialog.component';
import { CategoryDto, CategoryService, GetCategoryDto } from 'api-lib';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Observable, Subject, share, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CategoriesComponent implements OnInit, OnDestroy {

  private onDestroy: Subject<void> = new Subject<void>();
  private ref: DynamicDialogRef = new DynamicDialogRef;
  public categories: Observable<GetCategoryDto[]> = new Observable<GetCategoryDto[]>;

  constructor(
    private categoryService: CategoryService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.categories = this.loadCategories();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private loadCategories(): Observable<GetCategoryDto[]> {
    return this.categoryService.getAll().pipe(share());
  }

  public saveRow(rowData: CategoryDto) {
    this.categoryService.save(rowData).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('errors at saving new category entry: ' + exception);
      },
      complete: () => {
        console.log('successfully saved category entry');
      },
    });
  }

  public deleteRow(rowData: CategoryDto, categories: GetCategoryDto[]) {
    this.categoryService.delete(rowData.id).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('errors at deleting new category entry: ' + exception);
      },
      complete: () => {
        const index = categories.indexOf(rowData);
        if (index > -1) {
          categories.splice(index, 1);
        }
        console.log('successfully deleted category entry');
      },
    });
  }

  public show(categories?: GetCategoryDto[]) {
    this.ref = this.dialogService.open(CategoriesDialogComponent, {
      header: 'Create a Category',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((category: CategoryDto) => {
      if (category) {
        categories?.push(category);
        this.messageService.add({ severity: 'info', summary: 'Category created', detail: category.title });
        //this.categories = this.loadCategories();
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }
}
