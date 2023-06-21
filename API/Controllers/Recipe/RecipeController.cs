namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class RecipeController : ApiControllerBase
    {
        private readonly IRecipeService _recipeService;

        public RecipeController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }
    }
}
