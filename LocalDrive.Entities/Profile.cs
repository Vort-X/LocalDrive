namespace LocalDrive.Entities
{
    public class Profile
    {
        public int Id { get; set; }
        public string? Login { get; set; }
        public string? PasswordHash { get; set; }
        public DateTime LastModifyDate { get; set; }
        public DateTime LastSignInDate { get; set; }
        public bool IsOwner { get; set; }
    }
}
