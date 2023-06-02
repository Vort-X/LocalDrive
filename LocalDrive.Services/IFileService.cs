using LocalDrive.Entities;

namespace LocalDrive.Services
{
    public interface IFileService
    {
        IEnumerable<FileMetadata> GetSharedFiles(string? login = null);
        FileMetadata? GetFile(int id);
        void UpdateFileLastDownload(int profileId, int fileId);
        bool ShareFile(string path, long size);
        bool UnshareFile(int id);
        IEnumerable<object> GetSharedFilesForUser(int id);
        bool HasAccess(int profileId, int fileId);
        bool GrantAccess(int profileId, int fileId);
        bool RevokeAccess(int profileId, int fileId);
    }
}