using backend.Models;
using backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // rejestracja
        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] UserDto userDto)
        {
            Console.WriteLine("Rejestrowanie użytkownika...");
            if (!ModelState.IsValid)
            {
                Console.WriteLine("Błędne dane rejestracji");
                return BadRequest(new { message = "Błędne dane rejestracji.", errors = ModelState.Values });
            }

            var user = new User
            {
                UserName = userDto.Username,
            };

            var result = await _userManager.CreateAsync(user, userDto.Password);

            if (!result.Succeeded)
            {
                Console.WriteLine("Nie udało się zarejestrować użytkownika");
                return BadRequest(new { message = "Rejestracja nie powiodła się.", errors = result.Errors });
            }

            // logowanie po rejestracji
            await _signInManager.SignInAsync(user, isPersistent: false);

            // dodanie informacji o użytkowniku do sesji
            HttpContext.Session.SetString("user_id", user.Id);

            // dodanie ciasteczka
            Response.Cookies.Append("session_active", "true", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            });

            Console.WriteLine("Rejestracja zakończona sukcesem, użytkownik zalogowany.");

            return Ok(new { message = "Rejestracja i logowanie zakończone sukcesem." });
        }


        // logowanie
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Błędne dane logowania.", errors = ModelState.Values });
            }

            var user = await _userManager.FindByNameAsync(userDto.Username);
            if (user == null)
            {
                return Unauthorized(new { message = "Błędna nazwa użytkownika lub hasło." });
            }

            var result = await _signInManager.PasswordSignInAsync(user, userDto.Password, false, false);

            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "Błędna nazwa użytkownika lub hasło." });
            }

            // dodanie id usera do sesji
            HttpContext.Session.SetString("user_id", user.Id);

            // dodanie ciasteczka
            Response.Cookies.Append("session_active", "true", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            });

            return Ok(new { message = "Zalogowano pomyślnie." });
        }


        // wylogowanie
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            HttpContext.Session.Remove("user_id");
            Response.Cookies.Delete("session_active");

            return Ok(new { message = "Wylogowano pomyślnie." });
        }


        // sprawdzenie czy user jest zalogowany
        [HttpGet("check-auth")]
        [Authorize]
        public IActionResult CheckAuth()
        {
            var userId = HttpContext.Session.GetString("user_id");

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Użytkownik nie jest zalogowany." });
            }

            return Ok(new { message = "Użytkownik jest zalogowany.", userId });
        }

    }
}
