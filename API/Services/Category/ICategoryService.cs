namespace API.Services
{
    public interface ICategoryService : IApplicationService
    {
        Task<int> Delete(IEnumerable<int> ids);

        Task<CategoryDto?> Delete(int id);

        Task<GetCategoryDto?> Get(int id);

        Task<IEnumerable<GetCategoryDto>> GetAll();

        IAsyncEnumerable<GetCategoryDto> GetAllAsync();

        Task<CategoryDto?> Save(CategoryDto categoryDto);

        Task<IEnumerable<CategoryDto>> Save(IEnumerable<CategoryDto> categoriesDto);
    }
}
