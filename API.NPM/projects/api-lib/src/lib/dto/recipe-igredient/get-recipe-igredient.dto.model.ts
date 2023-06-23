import { GetIngredientDto } from '../ingredient/get-ingredient.dto.model';

export interface GetRecipeIngredientDto {
  id: number;
  recipeId: number;
  ingredientId: number;
  ingredient: GetIngredientDto;
  amount: string;
}
