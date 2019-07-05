using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Challenge2.DB;
using Challenge2.DB.Models;
using System.ComponentModel.DataAnnotations;

namespace Challenge2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntriesController : ControllerBase
    {
        private readonly ShortenerContext _context;

        public EntriesController(ShortenerContext context)
        {
            _context = context;
        }

        // GET: api/Entries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entry>>> GetEntries()
        {
            return await _context.Entries.ToListAsync();
        }

        // GET: api/Entries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Entry>> GetEntry(int id)
        {
            var entry = await _context.Entries.FindAsync(id);

            if (entry == null)
            {
                return NotFound();
            }

            return entry;
        }

        // PUT: api/Entries/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEntry(int id, Entry entry)
        {
            if (id != entry.Id)
            {
                return BadRequest();
            }

            _context.Entry(entry).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EntryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (DbUpdateException e)
            {
                return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>() {
                    { "Link", new string[] { "Model with this Shortcut already exists" } } }));
            }

            return NoContent();
        }

        // POST: api/Entries
        [HttpPost]
        public async Task<ActionResult<Entry>> PostEntry(Entry entry)
        {
            try
            {
                _context.Entries.Add(entry);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetEntry", new { id = entry.Id }, entry);
            }
            catch (DbUpdateException e)
            {
                return ValidationProblem(new ValidationProblemDetails(new Dictionary<string, string[]>() {
                    { "Link", new string[] { "Model with this Shortcut already exists" } } }));
            }
        }

        // DELETE: api/Entries/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Entry>> DeleteEntry(int id)
        {
            var entry = await _context.Entries.FindAsync(id);
            if (entry == null)
            {
                return NotFound();
            }

            _context.Entries.Remove(entry);
            await _context.SaveChangesAsync();

            return entry;
        }

        private bool EntryExists(int id)
        {
            return _context.Entries.Any(e => e.Id == id);
        }
    }
}
