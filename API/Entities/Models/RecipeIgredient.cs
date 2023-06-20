namespace API.Entities
{
    public class RecipeIgredient : BaseModel
    {
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; } = null!;
        public int IgredientId { get; set; }
        public Igredient Igredient { get; set; } = null!;
        public required string Amount { get; set; }
    }
}
