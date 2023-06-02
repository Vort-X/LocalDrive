using LocalDrive.DataAccess;
using LocalDrive.Entities;

namespace LocalDrive.Services
{
    public class DefaultFileService : IFileService
    {
        private readonly IUnitOfWork unitOfWork;

        public DefaultFileService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public bool HasAccess(int profileId, int fileId)
        {
            return unitOfWork.ProfileAccessRepository.GetAll().Any(
                a => a.ProfileId == profileId && a.FileMetadataId == fileId);
        }

        public FileMetadata? GetFile(int id)
        {
            return unitOfWork.FileMetadataRepository.Get(id);
        }

        public IEnumerable<FileMetadata> GetSharedFiles(string? login = null)
        {
            if (login == null)
            {
                return unitOfWork.FileMetadataRepository.GetAll();
            }
            var profile = unitOfWork.ProfileRepository.GetAll().FirstOrDefault(p => p.Login == login);
            if (profile == null)
            {
                return Enumerable.Empty<FileMetadata>();
            }
            var fileIds = unitOfWork.ProfileAccessRepository.GetAll()
                .Where(a => a.ProfileId == profile.Id).Select(a => a.FileMetadataId).ToList();
            return unitOfWork.FileMetadataRepository.GetAll().Where(f => fileIds.Contains(f.Id));
        }

        public IEnumerable<object> GetSharedFilesForUser(int id)
        {
            var files = unitOfWork.FileMetadataRepository.GetAll();
            var accesses = unitOfWork.ProfileAccessRepository.GetAll().Where(a => a.ProfileId == id).ToList();
            return files.Select(f => new { 
                f.Id,
                f.Filename,
                LastDownload = accesses.FirstOrDefault(a => a.FileMetadataId == f.Id)?.LastDownloadDate,
                HasAccess = accesses.Exists(a => a.FileMetadataId == f.Id),
            });
        }

        public bool GrantAccess(int profileId, int fileId)
        {
            if (unitOfWork.ProfileRepository.Get(profileId) == null || 
                unitOfWork.FileMetadataRepository.Get(fileId) == null)
            {
                return false;
            }
            var accesses = unitOfWork.ProfileAccessRepository.GetAll();
            if (accesses.Any(a => a.ProfileId == profileId && a.FileMetadataId == fileId))
            {
                return false;
            }
            unitOfWork.ProfileAccessRepository.Create(new()
            {
                FileMetadataId= fileId,
                ProfileId= profileId,
                SharedDate= DateTime.Now,
            });
            unitOfWork.SaveChanges();
            return true;
        }

        public bool RevokeAccess(int profileId, int fileId)
        {
            var accesses = unitOfWork.ProfileAccessRepository.GetAll();
            var access = accesses.FirstOrDefault(a => a.ProfileId == profileId && a.FileMetadataId == fileId);
            if (access == null)
            {
                return false;
            }
            unitOfWork.ProfileAccessRepository.Remove(access.Id);
            unitOfWork.SaveChanges();
            return true;
        }

        public bool ShareFile(string path, long size)
        {
            var files = unitOfWork.FileMetadataRepository.GetAll();
            if (files.Any(a => a.Filename == path))
            {
                return false;
            }
            unitOfWork.FileMetadataRepository.Create(new()
            {
                Filename = path,
                UploadDate = DateTime.Now,
                Size = size,
            });
            unitOfWork.SaveChanges();
            return true;
        }

        public bool UnshareFile(int id)
        {
            if (unitOfWork.FileMetadataRepository.Get(id) == null)
            {
                return false;
            }
            unitOfWork.ProfileAccessRepository.GetAll()
                .Where(a => a.FileMetadataId == id)
                .Select(a => a.Id)
                .ToList()
                .ForEach(unitOfWork.ProfileAccessRepository.Remove);
            unitOfWork.FileMetadataRepository.Remove(id);
            unitOfWork.SaveChanges();
            return true;
        }

        public void UpdateFileLastDownload(int profileId, int fileId)
        {
            var access = unitOfWork.ProfileAccessRepository.GetAll().FirstOrDefault(
                a => a.ProfileId == profileId && a.FileMetadataId == fileId);
            if (access == null)
            {
                return;
            }
            unitOfWork.ProfileAccessRepository.Update(access.Id, f =>
            {
                f.LastDownloadDate = DateTime.Now;
            });
            unitOfWork.SaveChanges();
        }
    }
}
