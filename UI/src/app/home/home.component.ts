import { Component } from '@angular/core';
import { Product } from '../testdata/product';
import { ProductService } from '../testdata/productservice';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RecipeComponent } from '../recipe/recipe.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  products: Product[] = [];

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  ref: DynamicDialogRef = new DynamicDialogRef;

  constructor(
    private productService: ProductService,
    public dialogService: DialogService,
    public messageService: MessageService
  ) {}

  ngOnInit() {
    this.productService.getProducts().then((data) => (this.products = data.slice(0, 5)));

    this.sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];
  }

  show() {
    this.ref = this.dialogService.open(RecipeComponent, {
      header: 'Recipe Details',
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((product: Product) => {});

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

  getSeverity (product: Product) {
      switch (product.inventoryStatus) {
          case 'INSTOCK':
              return 'success';

          case 'LOWSTOCK':
              return 'warning';

          case 'OUTOFSTOCK':
              return 'danger';

          default:
              return undefined;
      }
  };
}
