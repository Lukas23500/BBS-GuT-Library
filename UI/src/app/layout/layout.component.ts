import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { RecipeDto } from 'api-lib';
import { RecipeComponent } from '../recipe/recipe.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LayoutComponent {

  items: MenuItem[] = [];

  constructor(
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
}
