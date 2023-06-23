namespace API.DTOs
{
    public class GetCategoryDto : IMappedDto<Category>
    {
        public int Id { get; set; }
        public required string Title { get; set; }
    }
}
