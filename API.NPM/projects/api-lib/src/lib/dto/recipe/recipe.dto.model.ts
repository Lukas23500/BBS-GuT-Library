import { DifficultyLevel } from '../../enum/difficulty-level.enum';
import { BaseDto } from '../base.dto.model';
import { ImageGalleryDto } from '../image-gallery/image-gallery.dto.model';
import { RecipeIngredientDto } from '../recipe-igredient/recipe-igredient.dto.model';

export interface RecipeDto extends BaseDto {
  name: string;
  prepTimeMinutes: number;
  difficultyLevel: DifficultyLevel;
  instruction: string;
  rating: number;
  thumbnailUrl: string;
  categoryId: number;
  imageGallery: ImageGalleryDto[];
  recipeIngredients: RecipeIngredientDto[];
}
