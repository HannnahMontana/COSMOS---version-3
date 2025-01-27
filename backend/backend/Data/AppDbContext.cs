using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Article> Articles { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // map articles table
            builder.Entity<Article>()
                .ToTable("articles")
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // funckja z sql
            builder.HasDbFunction(() => GetArticleCountAboveAverageByUser(default))
                   .HasName("GetArticleCountAboveAverageByUser");

        }

        // funckja z mssql
        [DbFunction]
        public static int GetArticleCountAboveAverageByUser(string userId)
        {
            throw new NotImplementedException("This method is mapped to a SQL function.");
        }
    }
}
