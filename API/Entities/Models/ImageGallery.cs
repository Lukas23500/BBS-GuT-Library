namespace API.Entities
{
    public class ImageGallery : BaseModel
    {
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; } = null!;
        public required string ImageUrl { get; set; }
    }
}
