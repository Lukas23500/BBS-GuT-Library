import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RecipeDto } from 'api-lib';
import { RecipeComponent } from '../recipe/recipe.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  items: MenuItem[] = [];
  ref: DynamicDialogRef = new DynamicDialogRef;

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService
  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Categories',
        icon: 'pi pi-fw pi-list',
        routerLink: '/categories'
      },
      {
        label: 'Ingredients',
        icon: 'pi pi-fw pi-list',
        routerLink: '/ingredients'
      }
    ];
  }

  show() {
    this.ref = this.dialogService.open(RecipeComponent, {
      header: 'Create a Recipe',
      width: '90%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        id: 0
      }
    });

    this.ref.onClose.subscribe((recipe: RecipeDto) => {
      if (recipe) {
        this.messageService.add({ severity: 'info', summary: 'Recipe created', detail: recipe.name });
      }
    });

    this.ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }
}
