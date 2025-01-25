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
            Console.WriteLine("rejestrowanie uzytkowika...");
            if (!ModelState.IsValid)
            {
                Console.WriteLine("Bledne dane rejestracji");
                return BadRequest(new { message = "Błędne dane rejestracji.", errors = ModelState.Values });
            }

            var user = new User
            {
                UserName = userDto.Username,
                //IsAdmin = userDto.IsAdmin
            };

            var result = await _userManager.CreateAsync(user, userDto.Password);
            Console.WriteLine("result: " + result);

            if (!result.Succeeded)
            {
                Console.WriteLine("Nie udało sie");
                return BadRequest(new { message = "Rejestracja nie powiodła się.", errors = result.Errors });
            }

            // logowanie
            await _signInManager.SignInAsync(user, isPersistent: false);

            // cookie
            Response.Cookies.Append("auth_cookie", user.Id, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            });

            //if (userDto.IsAdmin)
            //{
            //    await _userManager.AddToRoleAsync(user, "Admin");
            //}

            Console.WriteLine("rejestracja udana");

            return Ok(new { message = "Rejestracja zakończona sukcesem." });
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

            // dodanie cookie
            Response.Cookies.Append("auth_cookie", user.Id, new CookieOptions
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

            // usuniecie cookie
            Response.Cookies.Delete("auth_cookie");

            return Ok(new { message = "Wylogowano pomyślnie." });
        }

        // sprawdzenie czy user jest zalogowany
        [HttpGet("check-auth")]
        [Authorize]
        public IActionResult CheckAuth()
        {
            var userId = User.Identity?.Name;

            if (!string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Użytkownik nie jest zalogowany." });
            }

            return Ok(new { message = "Użytkownik jest zalogowany.", userId });
        }
    }
}
