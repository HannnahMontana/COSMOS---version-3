using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArticlesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;

        public ArticlesController(AppDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // dodawanie
        [HttpPost("add")]
        [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> AddArticle([FromBody] AddArticleDto articleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Nieprawidłowe dane wejściowe.", errors = ModelState.Values });
            }

            // sprawdza czy jest taki user w bazie
            var user = await _userManager.FindByIdAsync(articleDto.UserId);
            if (user == null)
            {
                return NotFound(new { message = "Nie znaleziono użytkownika o podanym ID." });
            }

            // procedura 
            var result = await _context.Database
                .ExecuteSqlInterpolatedAsync($@"
                    EXEC AddArticle 
                    @Title = {articleDto.Title}, 
                    @Subtitle = {articleDto.Subtitle}, 
                    @Content = {articleDto.Content}, 
                    @BannerUrl = {articleDto.BannerUrl}, 
                    @UserId = {user.Id}");

            return Ok(new { message = "Artykuł został pomyślnie dodany.", result });
        }

        // pobieranie wszystkich artykułów
        [HttpGet]
        public async Task<IActionResult> GetArticles([FromQuery] int limit = 6, [FromQuery] int offset = 0)
        {
            try
            {
                // pobieranie artykulow
                var articles = await _context.Articles
                    .OrderByDescending(a => a.CreatedAt)
                    .Skip(offset)
                    .Take(limit)
                    .ToListAsync();

                // sprawdzenie czy jest wiecej
                var hasMore = await _context.Articles.CountAsync() > offset + articles.Count;

                return Ok(new { articles, hasMore });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Wystąpił błąd podczas pobierania artykułów.", error = ex.Message });
            }
        }

        // pobieranie artykulu na podstawie id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticleWithAuthor(int id)
        {
            try
            {
                // pobranie artykulu i usera
                var article = await _context.Articles
                    .Include(a => a.User)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (article == null)
                {
                    return NotFound(new { message = "Artykuł o podanym ID nie został znaleziony." });
                }

                // przygotowanie response
                var response = new
                {
                    article.Id,
                    article.Title,
                    article.Subtitle,
                    article.Content,
                    article.BannerUrl,
                    article.CreatedAt,
                    Author = new
                    {
                        article.User.Id,
                        article.User.UserName
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Wystąpił błąd podczas pobierania artykułu.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArticle(int id, [FromBody] UpdateArticleDto updatedArticleDto)
        {
            try
            {
                // surowy sql przez triggera
                var rowsAffected = await _context.Database.ExecuteSqlInterpolatedAsync($@"
                    UPDATE articles
                    SET title = {updatedArticleDto.Title},
                        subtitle = {updatedArticleDto.Subtitle},
                        content = {updatedArticleDto.Content},
                        bannerUrl = {updatedArticleDto.BannerUrl}
                    WHERE id = {id}
                ");

                // jesli nie ma takiego artykulu
                if (rowsAffected == 0)
                {
                    return NotFound(new { message = "Artykuł o podanym ID nie został znaleziony." });
                }

                return Ok(new { message = "Artykuł został pomyślnie zaktualizowany." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Wystąpił błąd podczas edycji artykułu.", error = ex.Message });
            }
        }

        // usuwanie
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            try
            {
                // pobieranie artykulu
                var article = await _context.Articles.FirstOrDefaultAsync(a => a.Id == id);

                if (article == null)
                {
                    return NotFound(new { message = "Artykuł o podanym ID nie został znaleziony." });
                }

                // usuwanie
                _context.Articles.Remove(article);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Artykuł został pomyślnie usunięty." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Wystąpił błąd podczas usuwania artykułu.", error = ex.Message });
            }
        }

        [HttpGet("articles-above-average/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetArticlesAboveAverage(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Nie znaleziono użytkownika o podanym ID." });
                }

                var articleCount = await _context.Articles
                    .FromSqlInterpolated($@"
                        SELECT dbo.GetArticleCountAboveAverageByUser({userId}) AS ArticleCount
                    ")
                    .Select(a => a.Id) 
                    .CountAsync();

                return Ok(new
                {
                    message = "Pomyślnie pobrano liczbę artykułów powyżej średniej długości.",
                    userId = user.Id,
                    articleCount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Wystąpił błąd podczas pobierania danych.", error = ex.Message });
            }
        }

    }
}
