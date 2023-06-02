namespace LocalDrive.Entities
{
    public class ProfileAccess
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public int FileMetadataId { get; set; }
        public DateTime SharedDate { get; set; }
        public DateTime LastDownloadDate { get; set; }
    }
}
