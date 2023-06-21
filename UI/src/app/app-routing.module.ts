import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { CategoriesComponent } from './categories/categories.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { RecipeComponent } from './recipe/recipe.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    data: { needsFrame: false },
    children: [
      {
        path: '',
        component: LayoutComponent,
        children: [
          {
            path: '',
            component: HomeComponent,
            children: [
              {
                path: 'new-recipe',
                component: RecipeComponent
              },
              {
                path: 'recipe',
                component: RecipeComponent
              }
            ]
          },
          {
            path: 'categories',
            component: CategoriesComponent
          },
          {
            path: 'ingredients',
            component: IngredientsComponent
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
