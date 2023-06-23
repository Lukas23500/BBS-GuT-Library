namespace API.DTOs
{
    public class RecipeIngredientDto : BaseDto, IMappedDto<RecipeIngredient>
    {
        [Required]
        public int RecipeId { get; set; }

        [Required]
        public int IngredientId { get; set; }

        public GetIngredientDto? Ingredient { get; set; }

        [Required]
        [StringLength(255)]
        public required string Amount { get; set; }
    }
}
