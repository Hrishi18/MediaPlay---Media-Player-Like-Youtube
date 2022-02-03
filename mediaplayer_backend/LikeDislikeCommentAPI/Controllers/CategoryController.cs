using LikeDislikeCommentAPI.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LikeDislikeCommentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : Controller
    {
        private readonly MediaPlayerContext _context;

        public CategoryController(MediaPlayerContext context)
        {
            _context = context;
        }

        //Returns filtered videos on a search
        [HttpGet("{videoid}")]
        public async Task<ActionResult<Category>> GetCategory(long videoid)
        {
            var vid = _context.Videos.Where(x => (x.VideoId == videoid)).FirstOrDefault();    
            var category = await _context.Categories.FindAsync(vid.CategoryId);

            if (category == null)
            {
                return NotFound();
            }

            return category;



        }

    }
}

