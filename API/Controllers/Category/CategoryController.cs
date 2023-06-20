namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CategoryController : ApiControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetCategoryDto>> Get(int id)
        {
            var result = await _categoryService.Get(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetCategoryDto>>> GetAll()
        {
            var result = await _categoryService.GetAll();

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("Async")]
        public ActionResult<IAsyncEnumerable<GetCategoryDto>> GetAllAsync()
        {
            var result = _categoryService.GetAllAsync();

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> Save([FromBody] CategoryDto categoryDto)
        {
            var result = await _categoryService.Save(categoryDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> BulkSave([FromBody] IEnumerable<CategoryDto> categoriesDto)
        {
            var result = await _categoryService.Save(categoriesDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete]
        public async Task<ActionResult<Category>> Delete(int id)
        {
            var result = await _categoryService.Delete(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete]
        public async Task<ActionResult<int>> BulkDelete([FromBody] IEnumerable<int> ids)
        {
            var result = await _categoryService.Delete(ids);

            if (result == 0)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
