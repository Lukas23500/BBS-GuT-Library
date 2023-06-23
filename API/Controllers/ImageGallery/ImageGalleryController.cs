namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ImageGalleryController : ApiControllerBase
    {
        private readonly IImageGalleryService _imageGalleryService;

        public ImageGalleryController(IImageGalleryService imageGalleryService)
        {
            _imageGalleryService = imageGalleryService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetImageGalleryDto>> Get(int id)
        {
            var result = await _imageGalleryService.Get(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetImageGalleryDto>>> GetAll()
        {
            var result = await _imageGalleryService.GetAll();

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("Async")]
        public ActionResult<IAsyncEnumerable<GetImageGalleryDto>> GetAllAsync()
        {
            var result = _imageGalleryService.GetAllAsync();

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ImageGalleryDto>> Save([FromBody] ImageGalleryDto imageGalleryDto)
        {
            var result = await _imageGalleryService.Save(imageGalleryDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<ImageGalleryDto>>> BulkSave([FromBody] IEnumerable<ImageGalleryDto> imageGalleriesDto)
        {
            var result = await _imageGalleryService.Save(imageGalleriesDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<GetImageGalleryDto>> Upload([FromBody] UploadImageGalleryDto uploadImageGalleryDto)
        {
            var result = await _imageGalleryService.Upload(uploadImageGalleryDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<GetImageGalleryDto>>> BulkUpload([FromBody] IEnumerable<UploadImageGalleryDto> uploadImageGalleriesDto)
        {
            var result = await _imageGalleryService.Upload(uploadImageGalleriesDto);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ImageGalleryDto>> Delete(int id)
        {
            var result = await _imageGalleryService.Delete(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpDelete]
        public async Task<ActionResult<int>> BulkDelete([FromBody] IEnumerable<int> ids)
        {
            var result = await _imageGalleryService.Delete(ids);

            if (result == 0)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
