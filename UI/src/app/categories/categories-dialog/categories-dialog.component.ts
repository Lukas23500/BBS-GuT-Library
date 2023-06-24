import { CategoryDto, CategoryService } from 'api-lib/projects/api-lib/src/public-api';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categories-dialog',
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.scss']
})
export class CategoriesDialogComponent implements OnDestroy, OnInit {

  public new_category: CategoryDto = {} as CategoryDto;

  private onDestroy: Subject<void> = new Subject<void>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
      this.new_category = {} as CategoryDto;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  public saveNewEntry() {
    this.categoryService.save(this.new_category).pipe(takeUntil(this.onDestroy)).subscribe({
      error: (exception) => {
          console.log('error by creating new category entry: ' + exception);
      },
      complete: () => {
          console.log('successfully created category entry');
      },
    })
  }

  close()
  {
    this.ref.close();
  }
}
