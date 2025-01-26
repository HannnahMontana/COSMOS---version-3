using System.ComponentModel.DataAnnotations;

namespace backend.Dtos
{
    public class UpdateArticleDto
    {
        [Required]
        [MaxLength(255)]
        public required string Title { get; set; }

        [MaxLength(255)]
        public string Subtitle { get; set; }

        [Required]
        [MinLength(50)]
        public required string Content { get; set; }

        [Required]
        [Url]
        public required string BannerUrl { get; set; }
    }
}
