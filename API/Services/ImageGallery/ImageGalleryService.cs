namespace API.Services
{
    public partial class ImageGalleryService : ServiceBase, IImageGalleryService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ImageGalleryService(ApiDbContext context, IMapper mapper, IWebHostEnvironment webHostEnvironment) : base(context, mapper)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<GetImageGalleryDto?> Get(int id)
        {
            var imageGallery = await _context.ImageGallery
                .Where(c => c.Id == id)
                .ProjectTo<GetImageGalleryDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            return imageGallery;
        }

        public async Task<IEnumerable<GetImageGalleryDto>> GetAll()
        {
            var imageGalleries = await _context.ImageGallery
                .OrderBy(c => c.RecipeId)
                .ProjectTo<GetImageGalleryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return imageGalleries;
        }

        public async IAsyncEnumerable<GetImageGalleryDto> GetAllAsync()
        {
            var imageGalleries = _context.ImageGallery
                .OrderBy(c => c.RecipeId)
                .ProjectTo<GetImageGalleryDto>(_mapper.ConfigurationProvider)
                .AsAsyncEnumerable();

            await foreach (var imageGallery in imageGalleries)
            {
                yield return imageGallery;
            }
        }

        public async Task<ImageGalleryDto?> Save(ImageGalleryDto imageGalleryDto)
        {
            var imageGallery = _mapper.Map<ImageGallery>(imageGalleryDto);

            if (imageGallery.Id <= 0)
            {
                await _context.ImageGallery.AddAsync(imageGallery);
            }
            else
            {
                var existingImageGallery = await _context.ImageGallery
                    .AsTracking()
                    .Where(c => c.Id == imageGallery.Id)
                    .FirstOrDefaultAsync();

                if (existingImageGallery == null)
                {
                    return null;
                }

                _context.Entry(existingImageGallery).CurrentValues.SetValues(imageGallery);

                imageGallery = existingImageGallery;
            }

            await _context.SaveChangesAsync();

            return _mapper.Map<ImageGalleryDto>(imageGallery);
        }

        public async Task<IEnumerable<ImageGalleryDto>> Save(IEnumerable<ImageGalleryDto> imageGalleriesDto)
        {
            var existingImageGalleryIds = imageGalleriesDto
               .Where(c => c.Id > 0)
               .Select(c => c.Id);

            var existingImageGalleries = await _context.ImageGallery
                .AsTracking()
                .Where(c => existingImageGalleryIds.Contains(c.Id))
                .ToListAsync();

            var newImageGalleries = imageGalleriesDto.Where(c => c.Id <= 0)
                .Select(_mapper.Map<ImageGallery>)
                .ToList();

            foreach (var imageGalleryDto in imageGalleriesDto)
            {
                var existingImageGallery = existingImageGalleries.FirstOrDefault(c => c.Id == imageGalleryDto.Id);
                if (existingImageGallery != null)
                {
                    _mapper.Map(imageGalleryDto, existingImageGallery);
                }
            }

            _context.ImageGallery.AddRange(newImageGalleries);

            await _context.SaveChangesAsync();

            var savedImageGalleries = newImageGalleries.Concat(existingImageGalleries);
            return _mapper.Map<IEnumerable<ImageGalleryDto>>(savedImageGalleries);
        }

        public async Task<GetImageGalleryDto?> Upload(UploadImageGalleryDto uploadImageGalleryDto)
        {
            var imageGallery = _mapper.Map<ImageGallery>(uploadImageGalleryDto);

            if (imageGallery.Id <= 0)
            {
                imageGallery.ImageUrl = await SaveImage(uploadImageGalleryDto.FileBase64, uploadImageGalleryDto.FileName);
                await _context.ImageGallery.AddAsync(imageGallery);
            }
            else
            {
                var existingImageGallery = await _context.ImageGallery
                    .AsTracking()
                    .Where(c => c.Id == imageGallery.Id)
                    .FirstOrDefaultAsync();

                if (existingImageGallery == null)
                {
                    return null;
                }

                File.Delete(Path.Combine(_webHostEnvironment.WebRootPath, imageGallery.ImageUrl));
                imageGallery.ImageUrl = await SaveImage(uploadImageGalleryDto.FileBase64, uploadImageGalleryDto.FileName);

                _context.Entry(existingImageGallery).CurrentValues.SetValues(imageGallery);

                imageGallery = existingImageGallery;
            }

            await _context.SaveChangesAsync();

            return _mapper.Map<GetImageGalleryDto>(imageGallery);
        }

        public async Task<IEnumerable<GetImageGalleryDto>> Upload(IEnumerable<UploadImageGalleryDto> uploadImageGalleryDto)
        {
            var existingImageGalleryIds = uploadImageGalleryDto
               .Where(c => c.Id > 0)
               .Select(c => c.Id);

            var existingImageGalleries = await _context.ImageGallery
                .AsTracking()
                .Where(c => existingImageGalleryIds.Contains(c.Id))
                .ToListAsync();

            var newImageGalleries = uploadImageGalleryDto.Where(c => c.Id <= 0)
                .Select(_mapper.Map<ImageGallery>)
                .ToList();

            foreach (var imageGalleryDto in uploadImageGalleryDto)
            {
                var existingImageGallery = existingImageGalleries.FirstOrDefault(c => c.Id == imageGalleryDto.Id);
                if (existingImageGallery != null)
                {
                    _mapper.Map(imageGalleryDto, existingImageGallery);
                    existingImageGallery.ImageUrl = await SaveImage(imageGalleryDto.FileBase64, imageGalleryDto.FileName);
                }
            }

            foreach (var imageGalleryDto in uploadImageGalleryDto)
            {
                var newImageGallery = newImageGalleries.FirstOrDefault(c => c.Id == imageGalleryDto.Id);
                if (newImageGallery != null)
                {
                    var index = newImageGalleries.IndexOf(newImageGallery);
                    newImageGallery.ImageUrl = await SaveImage(imageGalleryDto.FileBase64, imageGalleryDto.FileName);
                    newImageGalleries.Insert(index, newImageGallery);
                }
            }

            _context.ImageGallery.AddRange(newImageGalleries);

            await _context.SaveChangesAsync();

            var savedImageGalleries = newImageGalleries.Concat(existingImageGalleries);
            return _mapper.Map<IEnumerable<GetImageGalleryDto>>(savedImageGalleries);
        }

        public async Task<ImageGalleryDto?> Delete(int id)
        {
            var imageGallery = await _context.ImageGallery.FindAsync(id);

            if (imageGallery != null)
            {
                _context.ImageGallery.Remove(imageGallery);
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<ImageGalleryDto>(imageGallery);
        }

        public async Task<int> Delete(IEnumerable<int> ids)
        {
            var entityIdsParameter = string.Join(",", ids.ToArray());
            string? tableName = GetTableName<ImageGallery>();

            var deleteSql = $"DELETE FROM {tableName} WHERE Id IN ({entityIdsParameter})";

            var affectedRows = await _context.Database.ExecuteSqlRawAsync(deleteSql);

            return affectedRows;
        }

        private async Task<string> SaveImage(string base64Image, string fileName)
        {
            try
            {
                // Remove the "data:image/png;base64," or "data:image/jpeg;base64," prefix from the base64 string
                var base64Data = MyRegex().Match(base64Image).Groups["data"].Value;

                // Decode the base64 string into a byte array
                byte[] imageBytes = Convert.FromBase64String(base64Data);

                // Create a unique file name for the image
                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";

                // Get the path to the wwwroot folder
                var wwwrootPath = _webHostEnvironment.WebRootPath;

                // Combine the wwwroot path with the relative path to the images folder
                var imagePath = Path.Combine(wwwrootPath, "images", uniqueFileName);

                // Save the image file to the images folder asynchronously
                await using var stream = new FileStream(imagePath, FileMode.Create);
                await stream.WriteAsync(imageBytes);

                // Return the file path relative to the wwwroot folder
                return Path.Combine("images", uniqueFileName);
            }
            catch (Exception)
            {
                // Handle any errors that occur during the image saving process
                // Log the exception or perform any necessary actions
                throw;
            }
        }

        [GeneratedRegex("data:image/(?<type>.+?),(?<data>.+)")]
        private static partial Regex MyRegex();
    }
}
