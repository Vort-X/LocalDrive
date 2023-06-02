namespace LocalDrive.DataAccess
{
    public interface IRepository<TEntity, TKey> where TEntity : class where TKey : IEquatable<TKey>
    {
        void Create(TEntity entity);
        TEntity? Get(TKey key);
        IEnumerable<TEntity> GetAll();
        void Remove(TKey key);
        void Update(TKey key, Action<TEntity> setFields);
    }
}