using System.Linq;
using Challenge2.DB;
using Microsoft.AspNetCore.Mvc;

namespace Challenge2.Controllers
{
    public class RedirectController : Controller
    {
        private readonly ShortenerContext _context;

        public RedirectController(ShortenerContext context)
        {
            _context = context;
        }

        [Route("/{slug:regex(^[[a-z0-9]]*$)}")]
        public IActionResult Index(string slug)
        {
            var entry = _context.Entries.SingleOrDefault(e => e.Link == slug);

            if (entry == null)
                return NotFound();

            return Redirect(entry.Url);
        }
    }
}