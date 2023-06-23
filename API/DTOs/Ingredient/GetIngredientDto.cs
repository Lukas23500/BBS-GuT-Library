namespace API.DTOs
{
    public class GetIngredientDto : IMappedDto<Ingredient>
    {
        public int Id { get; set; }
        public required string Name { get; set; }
    }
}
