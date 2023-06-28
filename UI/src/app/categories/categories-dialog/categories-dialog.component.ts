import { CategoryDto, CategoryService } from 'api-lib';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categories-dialog',
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CategoriesDialogComponent implements OnDestroy, OnInit {

  private onDestroy: Subject<void> = new Subject<void>();

  public newCategory: CategoryDto = {} as CategoryDto;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  public saveNewEntry() {
    this.categoryService.save(this.newCategory).pipe(takeUntil(this.onDestroy)).subscribe({
      next: (res) => {
        this.ref.close(res);
      },
      error: (exception) => {
        console.log('errors at creating new category entry: ' + exception);
      },
      complete: () => {
        console.log('successfully created category entry');
      },
    });
  }
}
