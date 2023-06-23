namespace API.DTOs
{
    public class ImageGalleryDto : BaseDto, IMappedDto<ImageGallery>
    {
        [Required]
        public int RecipeId { get; set; }

        [Required]
        public required string ImageUrl { get; set; }
    }
}
