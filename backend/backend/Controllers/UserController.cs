using backend.Models;
using backend.Services;
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
        private readonly SessionService _sessionService;

        public UserController(UserManager<User> userManager, SessionService sessionService)
        {
            _userManager = userManager;
            _sessionService = sessionService;
        }

        // pobiera aktualnie zalogowanego usera
        [HttpGet("current-user")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            // Pobranie user_id z sesji 
            var userId = _sessionService.GetUserIdFromSession();

            if (string.IsNullOrEmpty(userId))
            {
                // sesja wygasla - unauthorized
                return Unauthorized(new { message = "Sesja wygasła lub użytkownik nie jest zalogowany." });
            }

            // Pobierz dane użytkownika
            var user = await _userManager.FindByIdAsync(userId);

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
