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
        [HttpGet("current")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.Identity?.Name; // pobierz id z tokena
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Nie jesteś zalogowany." });
            }

            var user = await _userManager.FindByIdAsync(userId); 
            if (user == null)
            {
                return NotFound(new { message = "Nie znaleziono użytkownika." });
            }

            return Ok(new
            {
                id = user.Id,
                username = user.UserName
            });
        }
    }
}
