using Microsoft.AspNetCore.Http;

namespace backend.Services
{
    public class SessionService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SessionService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        // ustawienie sesji i cookie
        public void SetSessionAndCookie(string userId)
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null) return;

            context.Session.SetString("user_id", userId);

            context.Response.Cookies.Append("session_active", "true", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            });
        }

        // pobranie id usera z sesji
        public string GetUserIdFromSession()
        {
            var context = _httpContextAccessor.HttpContext;

            return context?.Session.GetString("user_id") ?? string.Empty;
        }

        // usuwanie ciasteczka i sesji
        public void ClearSessionAndCookie()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null) return;

            context.Session.Remove("user_id");
            context.Response.Cookies.Delete("session_active");
        }
    }
}
