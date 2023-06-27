namespace API.Services
{
    public interface IRecipeService : IApplicationService
    {
        Task<int> Delete(IEnumerable<int> ids);

        Task<RecipeDto?> Delete(int id);

        Task<RecipeDto?> Get(int id);

        Task<IEnumerable<GetRecipeDto>> GetAll(string? name, int? categoryId);

        IAsyncEnumerable<GetRecipeDto> GetAllAsync(string? name, int? categoryId);

        Task<IEnumerable<RecipeDto>> Save(IEnumerable<RecipeDto> recipesDto);

        Task<RecipeDto?> Save(RecipeDto recipeDto);
    }
}