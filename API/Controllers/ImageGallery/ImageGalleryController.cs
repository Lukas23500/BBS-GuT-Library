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
    }
}
