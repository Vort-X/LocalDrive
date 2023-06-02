using BC = BCrypt.Net.BCrypt;

namespace LocalDrive.Services
{
    public class DefaultPasswordHashService : IPasswordHashService
    {
        public bool CheckPassword(string password, string hash)
        {
            return BC.Verify(password, hash);
        }
        
        public string Hash(string password)
        {
            return BC.HashPassword(password);
        }
    }
}
