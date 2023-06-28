export interface UploadImageGalleryDto {
  id: number;
  recipeId: number;
  type: string;
  fileName: string;
  fileBase64: string;
}
