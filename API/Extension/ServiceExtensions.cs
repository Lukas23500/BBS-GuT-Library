namespace API.Extension
{
    public static class ServiceExtensions
    {
        public static void ConfigureDbContext(this IServiceCollection services, string? connectionString)
        {
            services.AddDbContext<ApiDbContext>(options =>
                options.UseSqlServer(connectionString,
                o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery))
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));
        }

        public static void ConfigureController(this IServiceCollection services)
        {
            services.AddControllers(options =>
            {
                options.ModelMetadataDetailsProviders.Add(new NewtonsoftJsonValidationMetadataProvider());
            }).AddNewtonsoftJson();
        }

        public static void ConfigureCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins("http://localhost:4200", "https://localhost:44305", "http://localhost:5000")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .SetPreflightMaxAge(TimeSpan.FromSeconds(2520))
                        .SetIsOriginAllowedToAllowWildcardSubdomains();
                });
            });
        }

        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddApplicationServiceTransients();
            services.AddAutoMapper(typeof(MappingProfile));
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        public static void ConfigureHttpsRedirection(this IServiceCollection services)
        {
            services.AddHttpsRedirection(options =>
            {
                options.HttpsPort = 44305;
            });
        }

        public static void ConfigureCustomExceptionMiddleware(this IApplicationBuilder app)
        {
            //app.UseMiddleware<ExceptionMiddleware>();
        }

        public static void ConfigureDatabase(this IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>()?.CreateScope();
            var context = serviceScope?.ServiceProvider.GetRequiredService<ApiDbContext>();
            //context?.Database.EnsureCreated();
            context?.Database.Migrate();
        }

        private static void AddApplicationServiceTransients(this IServiceCollection services)
        {
            var assembly = typeof(IApplicationService).Assembly;

            var interfaces = assembly.GetTypes()
                .Where(IsAssignableApplicationServiceInterface)
                .ToList();

            foreach (var interfaceType in interfaces)
            {
                var implementingType = GetImplementingType(interfaceType, assembly);

                if (implementingType != null)
                {
                    services.AddTransient(interfaceType, implementingType);
                }
                else
                {
                    throw new InvalidOperationException($"Failed to find an implementing type for interface {interfaceType.FullName}");
                }
            }
        }

        private static bool IsAssignableApplicationServiceInterface(Type type)
        {
            return type.Name != nameof(IApplicationService) && typeof(IApplicationService).IsAssignableFrom(type) && type.IsInterface;
        }

        private static Type? GetImplementingType(Type interfaceType, Assembly assembly)
        {
            return assembly.GetTypes()
                .FirstOrDefault(type => interfaceType.IsAssignableFrom(type) && !type.IsInterface && !type.IsAbstract);
        }
    }
}
