using Newtonsoft.Json;

namespace API.Data
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Category { get; set; }
        public DbSet<Igredient> Igredient { get; set; }
        public DbSet<ImageGallery> ImageGallery { get; set; }
        public DbSet<Recipe> Recipe { get; set; }
        public DbSet<RecipeIgredient> RecipeIgredient { get; set; }

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
                c.HasIndex(b => b.Title)
                    .IsUnique();
            });

            modelBuilder.Entity<Igredient>(c =>
            {
                c.Property(b => b.Name)
                    .IsRequired();
                c.HasIndex(b => b.Name)
                    .IsUnique();
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

            modelBuilder.Entity<RecipeIgredient>(c =>
            {
                //c.HasOne(b => b.Recipe).WithMany()
                //    .HasForeignKey(c => c.RecipeId)
                //    .IsRequired();
                //c.HasOne(b => b.Igredient).WithMany()
                //    .HasForeignKey(c => c.IgredientId)
                //    .IsRequired();
                c.Property(b => b.Amount)
                    .IsRequired();
            });
        }

        private static void CreateQueryFilters(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>().HasQueryFilter(p => p.IsHidden != 1);
            modelBuilder.Entity<Igredient>().HasQueryFilter(p => p.IsHidden != 1);
            modelBuilder.Entity<ImageGallery>().HasQueryFilter(p => p.IsHidden != 1);
            modelBuilder.Entity<Recipe>().HasQueryFilter(p => p.IsHidden != 1);
            modelBuilder.Entity<RecipeIgredient>().HasQueryFilter(p => p.IsHidden != 1);
        }

        private static void SeedData(ModelBuilder modelBuilder)
        {
            var categorySeedData = File.ReadAllText("./Data/SeedData/Category.json");

            var categories = JsonConvert.DeserializeObject<List<Category>>(categorySeedData);

            if (categories != null || categories?.Count > 0)
            {
                categories = categories.OrderBy(c => c.Title).ToList();
                modelBuilder.Entity<Category>().HasData(categories);
            }
        }
    }
}
