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

        [HttpGet("{id}")]
        public async Task<ActionResult<GetRecipeIngredientDto>> Get(int id)
        {
            var result = await _recipeIngredientService.Get(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetRecipeIngredientDto>>> GetAll()
        {
            var result = await _recipeIngredientService.GetAll();

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("Async")]
        public ActionResult<IAsyncEnumerable<GetRecipeIngredientDto>> GetAllAsync()
        {
            var result = _recipeIngredientService.GetAllAsync();

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<RecipeIngredientDto>> Save([FromBody] RecipeIngredientDto recipeIngredientDto)
        {
            var result = await _recipeIngredientService.Save(recipeIngredientDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<RecipeIngredientDto>>> BulkSave([FromBody] IEnumerable<RecipeIngredientDto> recipeIngredientsDto)
        {
            var result = await _recipeIngredientService.Save(recipeIngredientsDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<RecipeIngredientDto>> Delete(int id)
        {
            var result = await _recipeIngredientService.Delete(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete]
        public async Task<ActionResult<int>> BulkDelete([FromBody] IEnumerable<int> ids)
        {
            var result = await _recipeIngredientService.Delete(ids);

            if (result == 0)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
