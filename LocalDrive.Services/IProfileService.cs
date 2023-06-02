using LocalDrive.Entities;

namespace LocalDrive.Services
{
    public interface IProfileService
    {
        IEnumerable<Profile> GetProfiles();
        Profile? GetProfile(int id);
        Profile? GetProfile(string login);
        bool CreateProfile(string login, string password);
        bool DeleteProfile(int id);
        bool UpdateProfile(int id, string login, string password);
        void UpdateProfileLastLogin(int id);
        bool CheckCredentials(string login, string password);
    }
}
