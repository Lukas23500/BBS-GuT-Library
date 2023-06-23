namespace API.DTOs
{
    public class GetImageGalleryDto : IMappedDto<ImageGallery>
    {
        public int Id { get; set; }
        public int RecipeId { get; set; }
        public required string ImageUrl { get; set; }
    }
}
