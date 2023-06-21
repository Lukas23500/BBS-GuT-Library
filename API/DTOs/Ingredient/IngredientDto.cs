namespace API.DTOs
{
    public class IngredientDto : BaseDto, IMappedDto<Ingredient>
    {
        [Required]
        [StringLength(100)]
        public required string Name { get; set; }
    }
}
