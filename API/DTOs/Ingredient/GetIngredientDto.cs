namespace API.DTOs
{
    public class GetIngredientDto : IMappedDto<Ingredient>
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string Name { get; set; }
    }
}
