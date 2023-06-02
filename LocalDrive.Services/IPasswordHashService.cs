namespace LocalDrive.Services
{
    public interface IPasswordHashService
    {
        string Hash(string password);
        bool CheckPassword(string password, string hash);
    }
}
