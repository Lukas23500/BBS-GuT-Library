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

        [HttpGet("{id}")]
        public async Task<ActionResult<GetRecipeDto>> Get(int id)
        {
            var result = await _recipeService.Get(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetRecipeDto>>> GetAll([FromQuery] string name, int categoryId)
        {
            var result = await _recipeService.GetAll(name, categoryId);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("Async")]
        public ActionResult<IAsyncEnumerable<GetRecipeDto>> GetAllAsync([FromQuery] string name, int categoryId)
        {
            var result = _recipeService.GetAllAsync(name, categoryId);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<RecipeDto>> Save([FromBody] RecipeDto recipeDto)
        {
            var result = await _recipeService.Save(recipeDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<RecipeDto>>> BulkSave([FromBody] IEnumerable<RecipeDto> recipesDto)
        {
            var result = await _recipeService.Save(recipesDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<RecipeDto>> Delete(int id)
        {
            var result = await _recipeService.Delete(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete]
        public async Task<ActionResult<int>> BulkDelete([FromBody] IEnumerable<int> ids)
        {
            var result = await _recipeService.Delete(ids);

            if (result == 0)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
