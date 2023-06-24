import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from 'api-lib/projects/api-lib/src/exported-services';
import { CategoryDto, GetCategoryDto } from 'api-lib/projects/api-lib/src/exported-dtos';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { CategoriesDialogComponent } from './categories-dialog/categories-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  ref: DynamicDialogRef = new DynamicDialogRef;

  public category_data: GetCategoryDto[] = [];
  private selected_category: CategoryDto = {} as CategoryDto;

  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private dialogService: DialogService,
    private messageService: MessageService
    ){}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private loadCategories() {
    this.categoryService.getAll().pipe(takeUntil(this.onDestroy)).subscribe({
      next: (data) => {
        this.category_data = data;
      },
      error: (exception) => {
        console.log('error by loading all category entries: ' + exception);
      },
      complete: () => {
        console.log('get all categoriy entries complete');
      }
    });
  }

  public editRow(rowData: CategoryDto) {
    this.selected_category = { ...rowData };
  }

  public saveRow() {
    this.categoryService.save(this.selected_category).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
          console.log('error by saving new category entry: ' + exception);
      },
      complete: () => {
          console.log('successfully saved category entry');
      },
    });
  }

  public cancelRowEdit() {
    this.selected_category.id = 0;
    this.selected_category.isHidden = false;
    this.selected_category.title = '';
  }

  public deleteRow(rowData: CategoryDto) {
    this.categoryService.delete(rowData.id).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
          console.log('error by deleting new category entry: ' + exception);
      },
      complete: () => {
          console.log('successfully deleted category entry');
      },
    });
  }

  public show() {
    this.ref = this.dialogService.open(CategoriesDialogComponent, {
      header: 'Create a Category',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((category: CategoryDto) => {
        if (category) {
            this.messageService.add({ severity: 'info', summary: 'Category created', detail: category.title });
        }
    });

    this.ref.onMaximize.subscribe((value) => {
        this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }
}
