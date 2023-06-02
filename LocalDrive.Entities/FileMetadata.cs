namespace LocalDrive.Entities
{
    public class FileMetadata
    {
        public int Id { get; set; }
        public string? Filename { get; set; }
        public long Size { get; set; }
        public DateTime UploadDate { get; set; }
    }
}