namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class IgredientController : ApiControllerBase
    {
        private readonly IIgredientService _igredientService;

        public IgredientController(IIgredientService igredientService)
        {
            _igredientService = igredientService;
        }
    }
}
