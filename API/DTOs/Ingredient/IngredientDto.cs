namespace API.DTOs
{
    public class IngredientDto : BaseDto, IMappedDto<Ingredient>
    {
        [Required]
        [StringLength(255)]
        public required string Name { get; set; }
    }
}
