namespace API.Services
{
    public class RecipeIngredientService : ServiceBase, IRecipeIngredientService
    {
        public RecipeIngredientService(ApiDbContext context, IMapper mapper) : base(context, mapper)
        {
        }
    }
}
