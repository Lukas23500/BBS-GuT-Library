namespace API.DTOs
{
    public class GetRecipeDto : IMappedDto<Recipe>
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int PrepTimeMinutes { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; }
        public required string Instruction { get; set; }
        public int Rating { get; set; }
        public required string ThumbnailUrl { get; set; }
        public int CategoryId { get; set; }

        public ICollection<GetImageGalleryDto>? ImageGallery { get; set; }
        public ICollection<GetRecipeIngredientDto>? RecipeIngredients { get; set; }
    }
}
