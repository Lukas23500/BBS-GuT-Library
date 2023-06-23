namespace API.Services
{
    public interface IImageGalleryService : IApplicationService
    {
        Task<int> Delete(IEnumerable<int> ids);

        Task<ImageGalleryDto?> Delete(int id);

        Task<GetImageGalleryDto?> Get(int id);

        Task<IEnumerable<GetImageGalleryDto>> GetAll();

        IAsyncEnumerable<GetImageGalleryDto> GetAllAsync();

        Task<IEnumerable<ImageGalleryDto>> Save(IEnumerable<ImageGalleryDto> imageGalleriesDto);

        Task<ImageGalleryDto?> Save(ImageGalleryDto imageGalleryDto);

        Task<IEnumerable<GetImageGalleryDto>> Upload(IEnumerable<UploadImageGalleryDto> uploadImageGalleryDto);

        Task<GetImageGalleryDto?> Upload(UploadImageGalleryDto uploadImageGalleryDto);
    }
}