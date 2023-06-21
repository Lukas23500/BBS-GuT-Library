namespace API.Services
{
    public interface IIngredientService : IApplicationService
    {
        Task<int> Delete(IEnumerable<int> ids);

        Task<IngredientDto?> Delete(int id);

        Task<GetIngredientDto?> Get(int id);

        Task<IEnumerable<GetIngredientDto>> GetAll();

        IAsyncEnumerable<GetIngredientDto> GetAllAsync();

        Task<IngredientDto?> Save(IngredientDto categoryDto);

        Task<IEnumerable<IngredientDto>> Save(IEnumerable<IngredientDto> ingredientsDto);
    }
}
