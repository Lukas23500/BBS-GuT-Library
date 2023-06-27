import { CategoriesDialogComponent } from './categories-dialog/categories-dialog.component';
import { CategoryDto, CategoryService, GetCategoryDto } from 'api-lib';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CategoriesComponent implements OnInit, OnDestroy {

  private ref: DynamicDialogRef = new DynamicDialogRef;
  public categoryData: GetCategoryDto[] = [];
  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private categoryService: CategoryService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) { }

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
        this.categoryData = data;
      },
      error: (exception) => {
        console.log('error by loading all category entries: ' + exception);
      },
      complete: () => {
        console.log('get all categoriy entries complete');
      }
    });
  }

  public saveRow(rowData: CategoryDto) {
    this.categoryService.save(rowData).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by saving new category entry: ' + exception);
      },
      complete: () => {
        console.log('successfully saved category entry');
      },
    });
  }

  public deleteRow(rowData: CategoryDto) {
    this.categoryService.delete(rowData.id).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
        console.log('error by deleting new category entry: ' + exception);
      },
      complete: () => {
        console.log('successfully deleted category entry');
        const index = this.categoryData.indexOf(rowData);
        if (index > -1) {
          this.categoryData.splice(index, 1);
        }
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
        this.loadCategories();
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }
}
