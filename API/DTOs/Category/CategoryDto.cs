namespace API.DTOs
{
    public class CategoryDto : BaseDto, IMappedDto<Category>
    {
        [Required]
        [StringLength(255)]
        public required string Title { get; set; }
    }
}
