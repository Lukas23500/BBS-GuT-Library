namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class IngredientController : ApiControllerBase
    {
        private readonly IIngredientService _ingredientService;

        public IngredientController(IIngredientService ingredientService)
        {
            _ingredientService = ingredientService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetIngredientDto>> Get(int id)
        {
            var result = await _ingredientService.Get(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetIngredientDto>>> GetAll()
        {
            var result = await _ingredientService.GetAll();

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("Async")]
        public ActionResult<IAsyncEnumerable<GetIngredientDto>> GetAllAsync()
        {
            var result = _ingredientService.GetAllAsync();

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<IngredientDto>> Save([FromBody] IngredientDto ingredientDto)
        {
            var result = await _ingredientService.Save(ingredientDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<IngredientDto>>> BulkSave([FromBody] IEnumerable<IngredientDto> ingredientsDto)
        {
            var result = await _ingredientService.Save(ingredientsDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<IngredientDto>> Delete(int id)
        {
            var result = await _ingredientService.Delete(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete]
        public async Task<ActionResult<int>> BulkDelete([FromBody] IEnumerable<int> ids)
        {
            var result = await _ingredientService.Delete(ids);

            if (result == 0)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
