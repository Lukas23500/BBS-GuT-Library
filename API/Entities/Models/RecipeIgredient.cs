namespace API.Entities
{
    public class RecipeIngredient : BaseModel
    {
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; } = null!;
        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; } = null!;
        public required string Amount { get; set; }
    }
}
