namespace API.Entities
{
    public class RecipeDto : BaseDto, IMappedDto<Recipe>
    {
        [Required]
        [StringLength(255)]
        public required string Name { get; set; }

        [Required]
        public int PrepTimeMinutes { get; set; }

        [Required]
        public DifficultyLevel DifficultyLevel { get; set; }

        [Required]
        [StringLength(16384)]
        public required string Instruction { get; set; }

        [Required]
        [Range(0, 5)]
        public int Rating { get; set; }

        [Required]
        public required string ThumbnailUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public ICollection<ImageGalleryDto>? ImageGallery { get; set; }
        public ICollection<RecipeIngredientDto>? RecipeIngredients { get; set; }
    }
}
