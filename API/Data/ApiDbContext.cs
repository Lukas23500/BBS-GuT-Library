using static API.Data.ApiDbContext;

namespace API.Data
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Category { get; set; }
        public DbSet<Ingredient> Ingredient { get; set; }
        public DbSet<ImageGallery> ImageGallery { get; set; }
        public DbSet<Recipe> Recipe { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredient { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            CreateModelConfigurations(modelBuilder);
            CreateQueryFilters(modelBuilder);
            SeedData(modelBuilder);
        }

        private static void CreateModelConfigurations(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(c =>
            {
                c.Property(b => b.Title)
                    .IsRequired();
                //c.HasIndex(b => b.Title)
                //    .IsUnique();
            });

            modelBuilder.Entity<Ingredient>(c =>
            {
                c.Property(b => b.Name)
                    .IsRequired();
                //c.HasIndex(b => b.Name)
                //    .IsUnique();
            });

            modelBuilder.Entity<ImageGallery>(c =>
            {
                c.Property(b => b.ImageUrl)
                    .IsRequired();
                //c.HasOne(b => b.Recipe).WithMany()
                //    .HasForeignKey(c => c.RecipeId)
                //    .IsRequired();
            });

            modelBuilder.Entity<Recipe>(c =>
            {
                c.Property(b => b.Name)
                    .IsRequired();
                c.Property(b => b.PrepTime)
                    .IsRequired();
                c.Property(b => b.DifficultyLevel)
                    .HasConversion(
                        v => v.ToString(),
                        v => (DifficultyLevel)Enum.Parse(typeof(DifficultyLevel), v))
                    .IsRequired();
                c.Property(b => b.Instruction)
                    .IsRequired();
                c.Property(b => b.Rating)
                    .IsRequired();
                c.Property(b => b.ThumbnailUrl)
                    .IsRequired();
                //c.HasOne(b => b.Category).WithMany()
                //    .HasForeignKey(c => c.CategoryId)
                //    .IsRequired();
            });

            modelBuilder.Entity<RecipeIngredient>(c =>
            {
                //c.HasOne(b => b.Recipe).WithMany()
                //    .HasForeignKey(c => c.RecipeId)
                //    .IsRequired();
                //c.HasOne(b => b.Ingredient).WithMany()
                //    .HasForeignKey(c => c.IngredientId)
                //    .IsRequired();
                c.Property(b => b.Amount)
                    .IsRequired();
            });
        }

        private static void CreateQueryFilters(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>().HasQueryFilter(p => p.IsHidden != true);
            modelBuilder.Entity<Ingredient>().HasQueryFilter(p => p.IsHidden != true);
            modelBuilder.Entity<ImageGallery>().HasQueryFilter(p => p.IsHidden != true);
            modelBuilder.Entity<Recipe>().HasQueryFilter(p => p.IsHidden != true);
            modelBuilder.Entity<RecipeIngredient>().HasQueryFilter(p => p.IsHidden != true);
        }

        private static void SeedData(ModelBuilder modelBuilder)
        {
            var seedData = File.ReadAllText("./Data/SeedData/Categories.json");
            var categories = JsonConvert.DeserializeObject<List<Category>>(seedData);

            if (categories != null || categories?.Count > 0)
            {
                categories = categories.OrderBy(c => c.Title).ToList();
                modelBuilder.Entity<Category>().HasData(categories);
            }

            seedData = File.ReadAllText("./Data/SeedData/Ingredients.json");
            var ingredients = JsonConvert.DeserializeObject<List<Ingredient>>(seedData);

            if (ingredients != null || ingredients?.Count > 0)
            {
                ingredients = ingredients.OrderBy(c => c.Name).ToList();
                modelBuilder.Entity<Ingredient>().HasData(ingredients);
            }
        } 
    }
}
