namespace backend.Models
{
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("articles")]
    public class Article
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string Subtitle { get; set; }
        public required string Content { get; set; }
        public required string BannerUrl { get; set; }
        public  DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public required string UserId { get; set; }

        [ForeignKey("UserId")]
        public required virtual User User { get; set; }
    }
}
