namespace API.Services
{
    public class ImageGalleryService : ServiceBase, IImageGalleryService
    {
        public ImageGalleryService(ApiDbContext context, IMapper mapper) : base(context, mapper)
        {
        }
    }
}
