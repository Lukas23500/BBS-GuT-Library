namespace API.Services
{
    public interface IRecipeIngredientService : IApplicationService
    {
        Task<int> Delete(IEnumerable<int> ids);

        Task<RecipeIngredientDto?> Delete(int id);

        Task<GetRecipeIngredientDto?> Get(int id);

        Task<IEnumerable<GetRecipeIngredientDto>> GetAll();

        IAsyncEnumerable<GetRecipeIngredientDto> GetAllAsync();

        Task<IEnumerable<RecipeIngredientDto>> Save(IEnumerable<RecipeIngredientDto> recipeIngredientsDto);

        Task<RecipeIngredientDto?> Save(RecipeIngredientDto recipeIngredientDto);
    }
}