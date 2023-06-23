namespace API.DTOs
{
    public class GetRecipeIngredientDto : IMappedDto<RecipeIngredient>
    {
        public int Id { get; set; }
        public int RecipeId { get; set; }
        public int IngredientId { get; set; }
        public GetIngredientDto? Ingredient { get; set; }
        public required string Amount { get; set; }
    }
}
