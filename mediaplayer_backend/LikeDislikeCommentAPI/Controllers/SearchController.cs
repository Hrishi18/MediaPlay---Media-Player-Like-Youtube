using LikeDislikeCommentAPI.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LikeDislikeCommentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : Controller
    {
        private readonly MediaPlayerContext _context;

        public SearchController(MediaPlayerContext context)
        {
            _context = context;
        }

        //Returns filtered videos on a search
        [HttpGet("searchvideo/{videotitle}")]
        public async Task<ActionResult<IEnumerable<UserWithVideo>>> GetSearchedVideos(string videotitle)
        {



            List<UserWithVideo> uservideos = new List<UserWithVideo>();
            var video = await _context.Videos.Where(x => (x.VideoTitle.Contains(videotitle))).ToListAsync();

            if (video == null)
            {
                return NotFound();
            }
            foreach (var item in video)
            {
                UserWithVideo uv = new UserWithVideo();
                User temp = _context.Users.Where(x => (x.UserId == item.UserId)).FirstOrDefault();
                uv.VideoId = item.VideoId;
                uv.VideoTitle = item.VideoTitle;
                uv.VideoThumbnailPath = item.ThumbnailPath;
                uv.VideoDescription = item.VideoDescription;
                uv.UserId = temp.UserId;
                uv.Name = temp.Name;
                uservideos.Add(uv);
            }
            return uservideos;
        }

    }
}
