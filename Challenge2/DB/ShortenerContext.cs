using Challenge2.DB.Models;
using Microsoft.EntityFrameworkCore;

namespace Challenge2.DB
{
    public class ShortenerContext : DbContext
    {
        public ShortenerContext(DbContextOptions<ShortenerContext> opts) : base(opts) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Entry>()
                .HasIndex(e => e.Link)
                .IsUnique();
        }

        public DbSet<Entry> Entries { get; set; }
    }
}
