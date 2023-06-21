namespace API.Services
{
    internal class CategoryService : ServiceBase, ICategoryService
    {
        public CategoryService(ApiDbContext context, IMapper mapper) : base(context, mapper)
        {
        }

        public async Task<GetCategoryDto?> Get(int id)
        {
            var category = await _context.Category
                .Where(c => c.Id == id)
                .ProjectTo<GetCategoryDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            return category;
        }

        public async Task<IEnumerable<GetCategoryDto>> GetAll()
        {
            var categories = await _context.Category
                .OrderBy(c => c.Title)
                .ProjectTo<GetCategoryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return categories;
        }

        public async IAsyncEnumerable<GetCategoryDto> GetAllAsync()
        {
            var categories = _context.Category
                .OrderBy(c => c.Title)
                .ProjectTo<GetCategoryDto>(_mapper.ConfigurationProvider)
                .AsAsyncEnumerable();

            await foreach (var category in categories)
            {
                yield return category;
            }
        }

        public async Task<CategoryDto?> Save(CategoryDto categoryDto)
        {
            var category = _mapper.Map<Category>(categoryDto);

            if (category.Id <= 0)
            {
                await _context.Category.AddAsync(category);
            }
            else
            {
                var existingCategory = await _context.Category
                    .AsTracking()
                    .Where(c => c.Id == category.Id)
                    .FirstOrDefaultAsync();

                if (existingCategory == null)
                {
                    return null;
                }

                _context.Entry(existingCategory).CurrentValues.SetValues(category);

                category = existingCategory;
            }

            await _context.SaveChangesAsync();

            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<IEnumerable<CategoryDto>> Save(IEnumerable<CategoryDto> categoriesDto)
        {
            var existingCategoryIds = categoriesDto
               .Where(c => c.Id > 0)
               .Select(c => c.Id);

            var existingCategories = await _context.Category
                .AsTracking()
                .Where(c => existingCategoryIds.Contains(c.Id))
                .ToListAsync();

            var newCategories = categoriesDto.Where(c => c.Id <= 0)
                .Select(_mapper.Map<Category>)
                .ToList();

            foreach (var categoryDto in categoriesDto)
            {
                var existingCategory = existingCategories.FirstOrDefault(c => c.Id == categoryDto.Id);
                if (existingCategory != null)
                {
                    _mapper.Map(categoryDto, existingCategory);
                }
            }

            _context.Category.AddRange(newCategories);

            await _context.SaveChangesAsync();

            var savedCategories = newCategories.Concat(existingCategories);
            return _mapper.Map<IEnumerable<CategoryDto>>(savedCategories);
        }

        public async Task<CategoryDto?> Delete(int id)
        {
            var category = await _context.Category.FindAsync(id);

            if (category != null)
            {
                _context.Category.Remove(category);
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<int> Delete(IEnumerable<int> ids)
        {
            var entityIdsParameter = string.Join(",", ids.ToArray());
            string? tableName = GetTableName<Category>();

            var deleteSql = $"DELETE FROM {tableName} WHERE Id IN ({entityIdsParameter})";

            var affectedRows = await _context.Database.ExecuteSqlRawAsync(deleteSql);

            return affectedRows;
        }
    }
}
