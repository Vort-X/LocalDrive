namespace LocalDrive.DataAccess
{
    public class DefaultRepository<TEntity, TKey> : IRepository<TEntity, TKey>
        where TEntity : class
        where TKey : IEquatable<TKey>
    {
        protected readonly LocalDriveDbContext context;

        public DefaultRepository(LocalDriveDbContext context)
        {
            this.context = context;
        }

        public void Create(TEntity entity)
        {
            context.Add(entity);
        }

        public TEntity? Get(TKey key)
        {
            return context.Find<TEntity>(key);
        }

        public IEnumerable<TEntity> GetAll()
        {
            return context.Set<TEntity>().AsEnumerable();
        }

        public void Remove(TKey key)
        {
            var entity = Get(key);
            if (entity == null) return;
            context.Remove(entity);
        }

        public void Update(TKey key, Action<TEntity> setFields)
        {
            var entity = Get(key);
            if (entity == null) return;
            setFields(entity);
            context.Update(entity);
        }
    }
}