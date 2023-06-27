namespace API.Services
{
    public class RecipeService : ServiceBase, IRecipeService
    {
        private readonly IImageGalleryService _imageGalleryService;
        private readonly IRecipeIngredientService _recipeIngredientService;

        public RecipeService(ApiDbContext context, IMapper mapper, IImageGalleryService imageGalleryService, IRecipeIngredientService recipeIngredientService) : base(context, mapper)
        {
            _imageGalleryService = imageGalleryService;
            _recipeIngredientService = recipeIngredientService;
        }

        public async Task<RecipeDto?> Get(int id)
        {
            var recipe = await _context.Recipe
                .Include(r => r.ImageGallery)
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Ingredient)
                .FirstOrDefaultAsync(r => r.Id == id);

            return recipe == null ? null : _mapper.Map<RecipeDto>(recipe);
        }

        public async Task<IEnumerable<GetRecipeDto>> GetAll(string? name, int? categoryId)
        {
            IQueryable<Recipe> query = _context.Recipe;

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(r => r.Name.Contains(name));
            }

            if (categoryId > 0)
            {
                query = query.Where(r => r.CategoryId == categoryId);
            }

            var recipes = await query
                .IgnoreAutoIncludes()
                .ProjectTo<GetRecipeDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return recipes;
        }

        public async IAsyncEnumerable<GetRecipeDto> GetAllAsync(string? name, int? categoryId)
        {
            IQueryable<Recipe> query = _context.Recipe;

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(r => r.Name.Contains(name));
            }

            if (categoryId > 0)
            {
                query = query.Where(r => r.CategoryId == categoryId);
            }

            var recipes = query
                .IgnoreAutoIncludes()
                .ProjectTo<GetRecipeDto>(_mapper.ConfigurationProvider)
                .AsAsyncEnumerable();

            await foreach (var recipe in recipes)
            {
                yield return recipe;
            }
        }

        public async Task<RecipeDto?> Save(RecipeDto recipeDto)
        {
            List<RecipeIngredientDto> recipeIngredient = (List<RecipeIngredientDto>)recipeDto.RecipeIngredients;
            recipeIngredient.ForEach(e => e.Ingredient = null);
            recipeDto.RecipeIngredients = recipeIngredient;

            var recipe = _mapper.Map<Recipe>(recipeDto);

            if (recipe.Id <= 0)
            {
                await _context.Recipe.AddAsync(recipe);
            }
            else
            {
                var existingRecipe = await _context.Recipe
                    .AsTracking()
                    .Include(r => r.ImageGallery)
                    .Include(r => r.RecipeIngredients)
                        .ThenInclude(ri => ri.Ingredient)
                    .FirstOrDefaultAsync(r => r.Id == recipe.Id);

                if (existingRecipe == null)
                {
                    return null;
                }

                _context.Entry(existingRecipe).CurrentValues.SetValues(recipe);

                recipe = existingRecipe;
            }

            await _context.SaveChangesAsync();

            return _mapper.Map<RecipeDto>(recipe);
        }

        public async Task<IEnumerable<RecipeDto>> Save(IEnumerable<RecipeDto> recipesDto)
        {
            var existingRecipeIds = recipesDto
               .Where(c => c.Id > 0)
               .Select(c => c.Id);

            var existingRecipes = await _context.Recipe
                .AsTracking()
                .Where(c => existingRecipeIds.Contains(c.Id))
                .ToListAsync();

            var newRecipes = recipesDto.Where(c => c.Id <= 0)
                .Select(_mapper.Map<Recipe>)
                .ToList();

            foreach (var recipeDto in recipesDto)
            {
                var existingRecipe = existingRecipes.FirstOrDefault(c => c.Id == recipeDto.Id);
                if (existingRecipe != null)
                {
                    _mapper.Map(recipeDto, existingRecipe);
                }
            }

            _context.Recipe.AddRange(newRecipes);

            await _context.SaveChangesAsync();

            var savedRecipes = newRecipes.Concat(existingRecipes);
            return _mapper.Map<IEnumerable<RecipeDto>>(savedRecipes);
        }

        public async Task<RecipeDto?> Delete(int id)
        {
            var recipe = await _context.Recipe.FindAsync(id);

            if (recipe != null)
            {
                _context.Recipe.Remove(recipe);
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<RecipeDto>(recipe);
        }

        public async Task<int> Delete(IEnumerable<int> ids)
        {
            var entityIdsParameter = string.Join(",", ids.ToArray());
            string? tableName = GetTableName<Recipe>();

            var deleteSql = $"DELETE FROM {tableName} WHERE Id IN ({entityIdsParameter})";

            var affectedRows = await _context.Database.ExecuteSqlRawAsync(deleteSql);

            return affectedRows;
        }
    }
}
