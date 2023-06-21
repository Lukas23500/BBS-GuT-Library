namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class RecipeIngredientController : ApiControllerBase
    {
        private readonly IRecipeIngredientService _recipeIngredientService;

        public RecipeIngredientController(IRecipeIngredientService recipeIngredientService)
        {
            _recipeIngredientService = recipeIngredientService;
        }
    }
}
