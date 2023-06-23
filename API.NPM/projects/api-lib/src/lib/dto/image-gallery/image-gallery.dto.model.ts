import { BaseDto } from '../base.dto.model';

export interface ImageGalleryDto extends BaseDto {
  recipeId: number;
  imageUrl: string;
}
