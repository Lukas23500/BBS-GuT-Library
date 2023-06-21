namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class RecipeIgredientController : ApiControllerBase
    {
        private readonly IRecipeIgredientService _recipeIgredientService;

        public RecipeIgredientController(IRecipeIgredientService recipeIgredientService)
        {
            _recipeIgredientService = recipeIgredientService;
        }
    }
}
