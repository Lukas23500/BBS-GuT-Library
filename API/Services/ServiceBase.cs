namespace API.Services
{
    public class ServiceBase
    {
        protected readonly ApiDbContext _context;
        protected readonly IMapper _mapper;

        public ServiceBase(ApiDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        protected string? GetTableName<TEntity>() where TEntity : class
        {
            var entityType = _context.Model.FindEntityType(typeof(TEntity));
            var tableName = entityType?.GetTableName();

            return tableName;
        }
    }
}
