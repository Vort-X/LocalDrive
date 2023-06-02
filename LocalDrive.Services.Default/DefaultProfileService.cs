using LocalDrive.DataAccess;
using LocalDrive.Entities;

namespace LocalDrive.Services
{
    public class DefaultProfileService : IProfileService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IPasswordHashService passwordHashService;

        public DefaultProfileService(IUnitOfWork unitOfWork, IPasswordHashService passwordHashService)
        {
            this.unitOfWork = unitOfWork;
            this.passwordHashService = passwordHashService;

            Seed();
        }

        private void Seed()
        {
            if (!GetProfiles().Any(p => p.IsOwner))
            {
                unitOfWork.ProfileRepository.Create(new()
                {
                    Login = "admin",
                    PasswordHash = passwordHashService.Hash("admin"),
                    IsOwner = true,
                    LastModifyDate = DateTime.UtcNow
                });
                unitOfWork.SaveChanges();
            }
        }

        public bool CheckCredentials(string login, string password)
        {
            var profile = GetProfiles().FirstOrDefault(p => p.Login == login);
            return profile != null && passwordHashService.CheckPassword(password, profile.PasswordHash!);
        }

        public bool CreateProfile(string login, string password)
        {
            if (GetProfiles().Any(p => p.Login == login))
            {
                return false;
            }
            unitOfWork.ProfileRepository.Create(new()
            {
                Login= login,
                PasswordHash= passwordHashService.Hash(password),
                IsOwner= false,
                LastModifyDate= DateTime.UtcNow
            });
            unitOfWork.SaveChanges();
            return true;
        }

        public bool DeleteProfile(int id)
        {
            if (unitOfWork.ProfileRepository.Get(id) == null)
            {
                return false;
            }
            unitOfWork.ProfileAccessRepository.GetAll()
                .Where(a => a.ProfileId == id)
                .Select(a => a.Id)
                .ToList()
                .ForEach(unitOfWork.ProfileAccessRepository.Remove);
            unitOfWork.ProfileRepository.Remove(id);
            unitOfWork.SaveChanges();
            return true;
        }

        public Profile? GetProfile(int id)
        {
            return unitOfWork.ProfileRepository.Get(id);
        }

        public Profile? GetProfile(string login)
        {
            return GetProfiles().FirstOrDefault(p => p.Login == login);
        }

        public IEnumerable<Profile> GetProfiles()
        {
            return unitOfWork.ProfileRepository.GetAll();
        }

        public bool UpdateProfile(int id, string login, string password)
        {
            if (unitOfWork.ProfileRepository.Get(id) == null)
            {
                return false;
            }
            unitOfWork.ProfileRepository.Update(id, p =>
            {
                p.Login = login;
                p.PasswordHash = passwordHashService.Hash(password);
                p.LastModifyDate = DateTime.Now;
            });
            unitOfWork.SaveChanges();
            return true;
        }

        public void UpdateProfileLastLogin(int id)
        {
            if (unitOfWork.ProfileRepository.Get(id) == null)
            {
                return;
            }
            unitOfWork.ProfileRepository.Update(id, p =>
            {
                p.LastSignInDate = DateTime.Now;
            });
            unitOfWork.SaveChanges();
        }
    }
}
