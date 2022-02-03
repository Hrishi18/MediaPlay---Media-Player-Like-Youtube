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
    public class CommentController : ControllerBase
    {
        private readonly MediaPlayerContext _context;

        public CommentController(MediaPlayerContext context)
        {
            _context = context;
        }

        //Returns all comments on a video
        [HttpGet("comments/{videoid}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments(long videoid)
        {
            var comments = await _context.Comments.Where(x => (x.VideoId == videoid)).ToListAsync();

            if (comments == null)
            {
                return NotFound();
            }

            return comments;


        }


        //Returns all comments on a video
        [HttpGet("commentswithusername/{videoid}")]
        public async Task<ActionResult<IEnumerable<UserWithComment>>> GetCommentsWithUserName(long videoid)
        {
            List<UserWithComment> usercomments = new List<UserWithComment>();


            var comments = await _context.Comments.Where(x => (x.VideoId == videoid)).ToListAsync();

            if (comments == null)
            {
                return NotFound();
            }


            foreach (var item in comments)
            {
                UserWithComment uc = new UserWithComment();
                User temp = _context.Users.Where(x => (x.UserId == item.UserId)).FirstOrDefault();
                uc.CommentText = item.CommentText;
                uc.Name = temp.Name;

                usercomments.Add(uc);
            }



            return usercomments;


        }




        //Put(Update) a comment
        [HttpPut("putcomment")]
        public async Task<IActionResult> PutComment(Comment comment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Not a valid data");
            }


            _context.Entry(comment).State = EntityState.Modified;

            var existingLikeStatus = _context.Comments.Where(l => (l.UserId == comment.UserId) && (l.VideoId == comment.VideoId)).FirstOrDefault<Comment>();

            if (existingLikeStatus != null)
            {
                existingLikeStatus.CommentText = comment.CommentText;

                await _context.SaveChangesAsync();
            }
            else
            {
                return NotFound();
            }

            return Ok();
        }


        //Post(Create) a comment
        [HttpPost("{userid}/{videoid}/{commenttext}")]
        public async Task<IActionResult> PostComment(long userid, long videoid, string commenttext)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Not a valid model");
            }
            //return username and comment text
            _context.Comments.Add(new Comment()
            {
                UserId = userid,
                VideoId = videoid,
                CommentText = commenttext
            });

            await _context.SaveChangesAsync();
            return Ok();
        }

        //Delete a Comment
        [HttpDelete("{userid}/{videoid}")]
        public async Task<IActionResult> DeleteComment(long userid, long videoid)
        {
            if ((userid <= 0) || (videoid <= 0))
            {
                return BadRequest("Not a valid model");
            }
            var comment = _context.Comments
                .Where(c => c.UserId == userid && c.VideoId == videoid)
                .FirstOrDefault();

            _context.Entry(comment).State = EntityState.Deleted;


            await _context.SaveChangesAsync();
            return Ok();
        }



    }
}
