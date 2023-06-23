namespace API.Services
{
    public class RecipeIngredientService : ServiceBase, IRecipeIngredientService
    {
        public RecipeIngredientService(ApiDbContext context, IMapper mapper) : base(context, mapper)
        {
        }

        public async Task<GetRecipeIngredientDto?> Get(int id)
        {
            var recipeIngredient = await _context.RecipeIngredient
                .Where(c => c.Id == id)
                .ProjectTo<GetRecipeIngredientDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            return recipeIngredient;
        }

        public async Task<IEnumerable<GetRecipeIngredientDto>> GetAll()
        {
            var recipeIngredients = await _context.RecipeIngredient
                .ProjectTo<GetRecipeIngredientDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return recipeIngredients;
        }

        public async IAsyncEnumerable<GetRecipeIngredientDto> GetAllAsync()
        {
            var recipeIngredients = _context.RecipeIngredient
                .ProjectTo<GetRecipeIngredientDto>(_mapper.ConfigurationProvider)
                .AsAsyncEnumerable();

            await foreach (var recipeIngredient in recipeIngredients)
            {
                yield return recipeIngredient;
            }
        }

        public async Task<RecipeIngredientDto?> Save(RecipeIngredientDto recipeIngredientDto)
        {
            var recipeIngredient = _mapper.Map<RecipeIngredient>(recipeIngredientDto);

            if (recipeIngredient.Id <= 0)
            {
                await _context.RecipeIngredient.AddAsync(recipeIngredient);
            }
            else
            {
                var existingRecipeIngredient = await _context.RecipeIngredient
                    .AsTracking()
                    .Where(c => c.Id == recipeIngredient.Id)
                    .FirstOrDefaultAsync();

                if (existingRecipeIngredient == null)
                {
                    return null;
                }

                _context.Entry(existingRecipeIngredient).CurrentValues.SetValues(recipeIngredient);

                recipeIngredient = existingRecipeIngredient;
            }

            await _context.SaveChangesAsync();

            return _mapper.Map<RecipeIngredientDto>(recipeIngredient);
        }

        public async Task<IEnumerable<RecipeIngredientDto>> Save(IEnumerable<RecipeIngredientDto> recipeIngredientsDto)
        {
            var existingRecipeIngredientIds = recipeIngredientsDto
               .Where(c => c.Id > 0)
               .Select(c => c.Id);

            var existingCategories = await _context.RecipeIngredient
                .AsTracking()
                .Where(c => existingRecipeIngredientIds.Contains(c.Id))
                .ToListAsync();

            var newCategories = recipeIngredientsDto.Where(c => c.Id <= 0)
                .Select(_mapper.Map<RecipeIngredient>)
                .ToList();

            foreach (var recipeIngredientDto in recipeIngredientsDto)
            {
                var existingRecipeIngredient = existingCategories.FirstOrDefault(c => c.Id == recipeIngredientDto.Id);
                if (existingRecipeIngredient != null)
                {
                    _mapper.Map(recipeIngredientDto, existingRecipeIngredient);
                }
            }

            _context.RecipeIngredient.AddRange(newCategories);

            await _context.SaveChangesAsync();

            var savedCategories = newCategories.Concat(existingCategories);
            return _mapper.Map<IEnumerable<RecipeIngredientDto>>(savedCategories);
        }

        public async Task<RecipeIngredientDto?> Delete(int id)
        {
            var recipeIngredient = await _context.RecipeIngredient.FindAsync(id);

            if (recipeIngredient != null)
            {
                _context.RecipeIngredient.Remove(recipeIngredient);
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<RecipeIngredientDto>(recipeIngredient);
        }

        public async Task<int> Delete(IEnumerable<int> ids)
        {
            var entityIdsParameter = string.Join(",", ids.ToArray());
            string? tableName = GetTableName<RecipeIngredient>();

            var deleteSql = $"DELETE FROM {tableName} WHERE Id IN ({entityIdsParameter})";

            var affectedRows = await _context.Database.ExecuteSqlRawAsync(deleteSql);

            return affectedRows;
        }
    }
}
