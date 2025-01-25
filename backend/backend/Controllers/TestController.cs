using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("articles")]
        public ActionResult<List<Article>> GetArticles()
        {
            var articles = _context.Articles.ToList();
            return Ok(articles);
        }
    }
}
