export interface UploadImageGalleryDto {
  id: number;
  recipeId: number;
  imageUrl: string;
  type: string;
  fileName: string;
  fileBase64: string;
}
