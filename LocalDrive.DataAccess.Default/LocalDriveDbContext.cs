using LocalDrive.Entities;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;

namespace LocalDrive.DataAccess
{
    public class LocalDriveDbContext : DbContext
    {
        public LocalDriveDbContext([NotNull] DbContextOptions<LocalDriveDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<FileMetadata> FileMetadata { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<ProfileAccess> ProfileAccesses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
