namespace API.DTOs
{
    public class UploadImageGalleryDto : IMappedDto<ImageGallery>
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int RecipeId { get; set; }

        [Required]
        public required string Type { get; set; }

        [Required]
        public required string FileName { get; set; }

        [Required]
        public required string FileBase64 { get; set; }
    }
}
