namespace API.Entities
{
    public class ImageGallery : BaseModel
    {
        public required string ImageUrl { get; set; }
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; } = null!;
    }
}
