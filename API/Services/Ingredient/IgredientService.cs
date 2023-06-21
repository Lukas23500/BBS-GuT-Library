namespace API.Services
{
    internal class IngredientService : ServiceBase, IIngredientService
    {
        public IngredientService(ApiDbContext context, IMapper mapper) : base(context, mapper)
        {
        }

        public async Task<GetIngredientDto?> Get(int id)
        {
            var ingredient = await _context.Ingredient
                .Where(c => c.Id == id)
                .ProjectTo<GetIngredientDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            return ingredient;
        }

        public async Task<IEnumerable<GetIngredientDto>> GetAll()
        {
            var ingredients = await _context.Ingredient
                .OrderBy(c => c.Name)
                .ProjectTo<GetIngredientDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return ingredients;
        }

        public async IAsyncEnumerable<GetIngredientDto> GetAllAsync()
        {
            var ingredients = _context.Ingredient
                .OrderBy(c => c.Name)
                .ProjectTo<GetIngredientDto>(_mapper.ConfigurationProvider)
                .AsAsyncEnumerable();

            await foreach (var ingredient in ingredients)
            {
                yield return ingredient;
            }
        }

        public async Task<IngredientDto?> Save(IngredientDto ingredientDto)
        {
            var ingredient = _mapper.Map<Ingredient>(ingredientDto);

            if (ingredient.Id <= 0)
            {
                await _context.Ingredient.AddAsync(ingredient);
            }
            else
            {
                var existingIngredient = await _context.Ingredient
                    .AsTracking()
                    .Where(c => c.Id == ingredient.Id)
                    .FirstOrDefaultAsync();

                if (existingIngredient == null)
                {
                    return null;
                }

                _context.Entry(existingIngredient).CurrentValues.SetValues(ingredient);

                ingredient = existingIngredient;
            }

            await _context.SaveChangesAsync();

            return _mapper.Map<IngredientDto>(ingredient);
        }

        public async Task<IEnumerable<IngredientDto>> Save(IEnumerable<IngredientDto> ingredientsDto)
        {
            var existingIngredientIds = ingredientsDto
               .Where(c => c.Id > 0)
               .Select(c => c.Id);

            var existingCategories = await _context.Ingredient
                .AsTracking()
                .Where(c => existingIngredientIds.Contains(c.Id))
                .ToListAsync();

            var newCategories = ingredientsDto.Where(c => c.Id <= 0)
                .Select(_mapper.Map<Ingredient>)
                .ToList();

            foreach (var ingredientDto in ingredientsDto)
            {
                var existingIngredient = existingCategories.FirstOrDefault(c => c.Id == ingredientDto.Id);
                if (existingIngredient != null)
                {
                    _mapper.Map(ingredientDto, existingIngredient);
                }
            }

            _context.Ingredient.AddRange(newCategories);

            await _context.SaveChangesAsync();

            var savedCategories = newCategories.Concat(existingCategories);
            return _mapper.Map<IEnumerable<IngredientDto>>(savedCategories);
        }

        public async Task<IngredientDto?> Delete(int id)
        {
            var ingredient = await _context.Ingredient.FindAsync(id);

            if (ingredient != null)
            {
                _context.Ingredient.Remove(ingredient);
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IngredientDto>(ingredient);
        }

        public async Task<int> Delete(IEnumerable<int> ids)
        {
            var entityIdsParameter = string.Join(",", ids.ToArray());
            string? tableName = GetTableName<Ingredient>();

            var deleteSql = $"DELETE FROM {tableName} WHERE Id IN ({entityIdsParameter})";

            var affectedRows = await _context.Database.ExecuteSqlRawAsync(deleteSql);

            return affectedRows;
        }
    }
}
