import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  show() {
  //   this.ref = this.dialogService.open(ProductListDemo, {
  //     header: 'Select a Product',
  //     width: '70%',
  //     contentStyle: { overflow: 'auto' },
  //     baseZIndex: 10000,
  //     maximizable: true
  // });

  // this.ref.onClose.subscribe((product: Product) => {
  //     if (product) {
  //         this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
  //     }
  // });

  // this.ref.onMaximize.subscribe((value) => {
  //     this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
  // });
  }
}
