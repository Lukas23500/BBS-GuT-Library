namespace API.DTOs
{
    public class CategoryDto : BaseDto, IMappedDto<Category>
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;
    }
}
