import { BaseDto } from '../base.dto.model';
import { GetIngredientDto } from '../ingredient/get-ingredient.dto.model';

export interface RecipeIngredientDto extends BaseDto {
  recipeId: number;
  ingredientId: number;
  ingredient: GetIngredientDto;
  amount: string;
}
