namespace API.Entities
{
    public class Recipe : BaseModel
    {
        public required string Name { get; set; }
        public int PrepTime { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; }
        public required string Instruction { get; set; }
        public int Rating { get; set; }
        public required string ThumbnailUrl { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        public ICollection<ImageGallery> ImageGallery { get; } = new List<ImageGallery>();
        public ICollection<RecipeIngredient> RecipeIngredients { get; } = new List<RecipeIngredient>();
    }
}
