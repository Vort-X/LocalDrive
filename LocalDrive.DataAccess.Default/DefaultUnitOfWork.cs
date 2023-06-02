using LocalDrive.Entities;

namespace LocalDrive.DataAccess
{
    public class DefaultUnitOfWork : IUnitOfWork
    {
        private readonly LocalDriveDbContext context;
        private bool disposedValue;

        public DefaultUnitOfWork(LocalDriveDbContext context)
        {
            this.context = context;
        }

        public IRepository<FileMetadata, int> FileMetadataRepository => new DefaultRepository<FileMetadata, int>(context);
        public IRepository<Profile, int> ProfileRepository => new DefaultRepository<Profile, int>(context);
        public IRepository<ProfileAccess, int> ProfileAccessRepository => new DefaultRepository<ProfileAccess, int>(context);

        public void SaveChanges()
        {
            context.SaveChanges();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects)
                    context.Dispose();
                }

                // TODO: free unmanaged resources (unmanaged objects) and override finalizer
                // TODO: set large fields to null
                disposedValue = true;
            }
        }

        // // TODO: override finalizer only if 'Dispose(bool disposing)' has code to free unmanaged resources
        // ~DefaultUnitOfWork()
        // {
        //     // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        //     Dispose(disposing: false);
        // }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
