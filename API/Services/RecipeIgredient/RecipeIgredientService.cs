namespace API.Services
{
    public class RecipeIgredientService : ServiceBase, IRecipeIgredientService
    {
        public RecipeIgredientService(ApiDbContext context, IMapper mapper) : base(context, mapper)
        {
        }
    }
}
