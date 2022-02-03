using LikeDislikeCommentAPI.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace LikeDislikeCommentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LikeController : ControllerBase
    {

        private readonly MediaPlayerContext _context;

        public LikeController(MediaPlayerContext context)
        {
            _context = context;
        }


        //Returns All Liked and Disliked Videos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Like>>> GetLikes()
        {
            return await _context.Likes.ToListAsync();
        }


        //Returns all Liked videos by the user
        [HttpGet("likedvideos/{userid}")]
        public async Task<ActionResult<IEnumerable<Video>>> GetLikedVideos(long userid)
        {
            List<Video> videos = new List<Video>();
            var likes = await _context.Likes.Where(x => (x.UserId == userid && x.IsLiked == true)).ToListAsync();

            if (likes == null)
            {
                return NotFound();
            }

            foreach (var item in likes)
            {
                Video temp = _context.Videos.Where(x => (x.VideoId == item.VideoId)).FirstOrDefault();

                videos.Add(temp);
            }
            IEnumerable<Video> video1 = videos;
            return videos;
        }
        //Returns all Liked videos by the user
        [HttpGet("likeduserwithvideos/{userid}")]
        public async Task<ActionResult<IEnumerable<UserWithVideo>>> GetLikedUserWithVideos(long userid)
        {
            List<Video> videos = new List<Video>();
            var likes = await _context.Likes.Where(x => (x.UserId == userid && x.IsLiked == true)).ToListAsync();

            if (likes == null)
            {
                return NotFound();
            }

            foreach (var item in likes)
            {
                Video temp = _context.Videos.Where(x => (x.VideoId == item.VideoId)).FirstOrDefault();

                videos.Add(temp);
            }
            IEnumerable<Video> video1 = videos;
            

        
            List<UserWithVideo> uservideos = new List<UserWithVideo>();
         
            foreach (var item in video1)
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



        //Returns all Disliked videos by the user
        [HttpGet("dislikedvideos/{userid}")]
        public async Task<ActionResult<IEnumerable<Like>>> GetDislikedVideos(long userid)
        {
            var likes = await _context.Likes.Where(x => (x.UserId == userid && x.IsLiked == false)).ToListAsync();
            if (likes == null)
            {
                return NotFound();
            }

            return likes;
        }


        //Check if video is liked/disliked by the user
        [HttpGet("{userid}/{videoid}")]
        public async Task<ActionResult<int>> GetLikeStatus(long userid, long videoid)
        {
            var likes = await _context.Likes.Where(x => (x.UserId == userid && x.VideoId == videoid)).FirstAsync();

            if (likes.IsLiked == true)
            {
                return 1;
            }
            else if (likes.IsLiked == false)
            {
                return 0;
            }
            return 2;

        }


        //Returns number of Likes on a video
        [HttpGet("likescount/{videoid}")]
        public async Task<ActionResult<int>> GetNumberOfLikes(long videoid)
        {
            var likes = await _context.Likes.Where(x => (x.VideoId == videoid && x.IsLiked == true)).ToListAsync();
            int numOfLikes = likes.Count();

            if (likes == null)
            {
                return NotFound();
            }

            return numOfLikes;
        }

        //Returns number of Dislikes on a video
        [HttpGet("dislikescount/{videoid}")]
        public async Task<ActionResult<int>> GetNumberOfDislikes(long videoid)
        {
            var dislikes = await _context.Likes.Where(x => (x.VideoId == videoid && x.IsLiked == false)).ToListAsync();
            int numOfDislikes = dislikes.Count();

            if (dislikes == null)
            {
                return NotFound();
            }

            return numOfDislikes;
        }



        //Put(Update) a like/dislike
        [HttpPut("putlike/{like}")]
        public async Task<IActionResult> PutLike(Like like)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Not a valid data");
            }


            _context.Entry(like).State = EntityState.Modified;


            var existingLikeStatus = _context.Likes.Where(l => (l.UserId == like.UserId) && (l.VideoId == like.VideoId)).FirstOrDefault<Like>();

            if (existingLikeStatus != null)
            {
                existingLikeStatus.IsLiked = like.IsLiked;

                await _context.SaveChangesAsync();
            }
            else
            {
                return NotFound();
            }

            return Ok();
        }


        //Post(Create) a like/dislike
        [HttpPost("{userid}/{videoid}/{isliked}")]
        public async Task<IActionResult> PostLike(long userid, long videoid, bool isliked)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Not a valid model");
            }

            _context.Likes.Add(new Like()
            {
                UserId = userid,
                VideoId = videoid,
                IsLiked = isliked
            });

            await _context.SaveChangesAsync();
            return Ok();
        }

        //Delete a Like/Dislike
        [HttpDelete("{userid}/{videoid}")]
        public async Task<IActionResult> DeleteLike(long userid, long videoid)
        {
            if ((userid <= 0) || (videoid <= 0))
            {
                return BadRequest("Not a valid model");
            }
            var like = _context.Likes
                .Where(l => l.UserId == userid && l.VideoId == videoid)
                .FirstOrDefault();

            _context.Entry(like).State = EntityState.Deleted;


            await _context.SaveChangesAsync();
            return Ok();
        }







    }
}
