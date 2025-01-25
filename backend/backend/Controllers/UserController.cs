using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UserController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        // pobiera aktualnie zalogowanego usera
        [HttpGet("current-user")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            // sprawdzenie, czy sesja istnieje
            var userId = HttpContext.Session.GetString("user_id");

            if (string.IsNullOrEmpty(userId))
            {
                // sesja wygasla - unauthorized
                return Unauthorized(new { message = "Sesja wygasła lub użytkownik nie jest zalogowany." });
            }

            // pobierz username
            var userName = User.Identity?.Name;

            if (string.IsNullOrEmpty(userName))
            {
                return Unauthorized(new { message = "Użytkownik nie jest zalogowany." });
            }

            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound(new { message = "Nie znaleziono użytkownika." });
            }

            return Ok(new
            {
                id = user.Id,
                username = user.UserName,
                roles = await _userManager.GetRolesAsync(user)
            });
        }

    }
}
