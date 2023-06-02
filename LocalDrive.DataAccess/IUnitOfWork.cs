using LocalDrive.Entities;

namespace LocalDrive.DataAccess
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<FileMetadata, int> FileMetadataRepository { get; }
        IRepository<Profile, int> ProfileRepository { get; }
        IRepository<ProfileAccess, int> ProfileAccessRepository { get; }

        void SaveChanges();
    }
}
