namespace API.Entities
{
    public class Category : BaseModel
    {
        public required string Title { get; set; }
        public ICollection<Recipe> Recipes { get; } = new List<Recipe>();
    }
}
