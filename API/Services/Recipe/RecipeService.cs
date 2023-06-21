namespace API.Services
{
    public class RecipeService : ServiceBase, IRecipeService
    {
        public RecipeService(ApiDbContext context, IMapper mapper) : base(context, mapper)
        {
        }
    }
}
