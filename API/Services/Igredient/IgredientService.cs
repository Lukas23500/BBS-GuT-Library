namespace API.Services
{
    internal class IgredientService : ServiceBase, IIgredientService
    {
        public IgredientService(ApiDbContext context, IMapper mapper) : base(context, mapper)
        {
        }
    }
}
