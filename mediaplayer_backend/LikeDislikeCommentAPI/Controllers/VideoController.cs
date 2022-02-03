using LikeDislikeCommentAPI.Model;
using LikeDislikeCommentAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Firebase.Auth;
using System.Threading;
using Firebase.Storage;

namespace LikeDislikeCommentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideoController : Controller
    {
        private readonly MediaPlayerContext _context;
        private static string ApiKey = "AIzaSyBJW12L7tOxbxrvRgwN-fBs7luEyW0aGe4";
        private static string Bucket = "mediaplayer-76215.appspot.com";
        private static string AuthEmail = "user@gmail.com";
        private static string AuthPassword = "user123";

        public VideoController(MediaPlayerContext context)
        {
            _context = context;
        }




        [HttpGet]
        public async Task<ActionResult<IEnumerable<Video>>> GetVideos()
        {
            return await _context.Videos.ToListAsync(); ;
        }

        // GET: api/Videos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Video>> GetVideo(long id)
        {
            var video = await _context.Videos.FindAsync(id);

            if (video == null)
            {
                return NotFound();
            }

            return video;
        }


        //SideVideo
        [HttpGet("userwithvideo")]
        public async Task<ActionResult<IEnumerable<UserWithVideo>>> GetUserWithVideo()
        {
            List<UserWithVideo> uservideos = new List<UserWithVideo>();
            var video = await _context.Videos.ToListAsync();

            if (video == null)
            {
                return NotFound();
            }
            foreach (var item in video)
            {
                UserWithVideo uv = new UserWithVideo();
                Model.User temp = _context.Users.Where(x => (x.UserId == item.UserId)).FirstOrDefault();
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

        [HttpGet("userwithcategoryvideo/{videoid}")]
        public async Task<ActionResult<IEnumerable<UserWithVideo>>> GetUserWithCategoryVideo(long videoid)
        {
            var vid = _context.Videos.Where(x => (x.VideoId == videoid)).FirstOrDefault();
            List<UserWithVideo> uservideos = new List<UserWithVideo>();
            var video = await _context.Videos.Where(x => (x.CategoryId == vid.CategoryId)).ToListAsync();

            video.Remove(video.First(x => x.VideoId == videoid));

            if (video == null)
            {
                return NotFound();
            }
            foreach (var item in video)
            {
                UserWithVideo uv = new UserWithVideo();
                Model.User temp = _context.Users.Where(x => (x.UserId == item.UserId)).FirstOrDefault();
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



        [HttpGet("userwithuservideo/{userid}")]
        public async Task<ActionResult<IEnumerable<UserWithVideo>>> GetUserWithUserVideo(long userid)
        {
            var vid = await _context.Videos.Where(x => (x.UserId == userid)).ToListAsync();
            List<UserWithVideo> uservideos = new List<UserWithVideo>();
           

            if (vid == null)
            {
                return NotFound();
            }
            foreach (var item in vid)
            {
                UserWithVideo uv = new UserWithVideo();
                Model.User temp = _context.Users.Where(x => (x.UserId == item.UserId)).FirstOrDefault();
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



        // PUT: api/Videos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVideo(long id, Video video)
        {
            if (id != video.VideoId)
            {
                return BadRequest();
            }

            _context.Entry(video).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VideoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Videos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost, DisableRequestSizeLimit]
        public async Task<ActionResult<Video>> PostVideo([FromForm] VideoReceiver videoData)
        {
            
            string jwt = Request.Headers["jwt"];
            UsersController users = new UsersController(_context, new JwtService());
            Model.User user = users.Verify(jwt);
            if (user is null)
            {
                return Unauthorized();
            }
            Video video = videoData.Video;
            Random random = new Random();
            long num;
            while (true)
            {
                num = random.Next(Int32.MaxValue);
                if (_context.Videos.Find(num) is null)
                {
                    break;
                }
            }
            video.VideoId = num;
            string finalPathReturn = String.Empty;
            try
            {
                var postedFile = videoData.VideoFile;
               // var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");
                if (postedFile.Length > 0)
                {
                    //// 3a. read the file name of the received file
                    var fileName = ContentDispositionHeaderValue.Parse(postedFile.ContentDisposition)
                       .FileName.Trim('"');

                    //// 3b. save the file on Path
                    //var finalPath = Path.Combine(uploadFolder, fileName);
                    byte[] fileBytes;
                    //finalPathReturn = finalPath;
                    using (var memoryStream = new MemoryStream())
                    {
                        postedFile.CopyTo(memoryStream);
                        fileBytes = memoryStream.ToArray();
                        
                    }
                    var stream = new MemoryStream(fileBytes);
                    /////////////////////////////////////////////////////////////
                    // FirebaseStorage.Put method accepts any type of stream.

                    //var stream = File.Open(@"C:\someFile.png", FileMode.Open);

                    // of course you can login using other method, not just email+password
                    var auth = new FirebaseAuthProvider(new FirebaseConfig(ApiKey));
                    var a = await auth.SignInWithEmailAndPasswordAsync(AuthEmail, AuthPassword);                    // you can use CancellationTokenSource to cancel the upload midway
                    var cancellation = new CancellationTokenSource();

                    var task = new FirebaseStorage(
                        Bucket,
                        new FirebaseStorageOptions
                        {
                            AuthTokenAsyncFactory = () => Task.FromResult(a.FirebaseToken),
                            ThrowOnCancel = true // when you cancel the upload, exception is thrown. By default no exception is thrown
                })
                        .Child("videos")
                        .Child(fileName)                        
                        .PutAsync(stream, cancellation.Token);

                    finalPathReturn = await task;
                }
                else
                {
                    return BadRequest("The File is not received.");
                }

                video.VideoPath = finalPathReturn;


                postedFile = videoData.ThumbnailFile;
                //uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");
                if (postedFile.Length > 0)
                {
                    // 3a. read the file name of the received file
                    var fileName = ContentDispositionHeaderValue.Parse(postedFile.ContentDisposition)
                        .FileName.Trim('"');

                    // 3b. save the file on Path
                    //var finalPath = Path.Combine(uploadFolder, fileName);
                    //finalPathReturn = finalPath;
                    byte[] fileBytes;
                    using (var memoryStream = new MemoryStream())
                    {
                        postedFile.CopyTo(memoryStream);
                        fileBytes = memoryStream.ToArray();

                    }
                    var stream = new MemoryStream(fileBytes);

                    var auth = new FirebaseAuthProvider(new FirebaseConfig(ApiKey));
                    var a = await auth.SignInWithEmailAndPasswordAsync(AuthEmail, AuthPassword);                    // you can use CancellationTokenSource to cancel the upload midway
                    var cancellation = new CancellationTokenSource();

                    var task = new FirebaseStorage(
                        Bucket,
                        new FirebaseStorageOptions
                        {
                            AuthTokenAsyncFactory = () => Task.FromResult(a.FirebaseToken),
                            ThrowOnCancel = true // when you cancel the upload, exception is thrown. By default no exception is thrown
                        })
                        .Child("images")
                        .Child(fileName)
                        .PutAsync(stream, cancellation.Token);

                    finalPathReturn = await task;

                }
                else
                {
                    return BadRequest("The File is not received.");
                }
                video.ThumbnailPath = finalPathReturn;
                _context.Videos.Add(video);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (VideoExists(video.VideoId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Some Error Occcured while uploading File {e.Message}");
            }


            return Ok($"File is uploaded Successfully url {finalPathReturn}");
        }


        // DELETE: api/Videos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVideo(long id)
        {
            var video = await _context.Videos.FindAsync(id);
            var likes = _context.Likes.Where(x => (x.VideoId == id)).ToList();
            var comments = _context.Comments.Where(x => (x.VideoId == id)).ToList();

            if (video == null)
            {
                return NotFound();
            }
            if (likes != null)
            {
                foreach (var like in likes)
                    _context.Likes.Remove(like);
            }
            if (comments != null)
            {
                foreach (var comment in comments)
                    _context.Comments.Remove(comment);
            }
            System.IO.File.Delete(video.VideoPath);
            _context.Videos.Remove(video);
            await _context.SaveChangesAsync();

            return Ok($"File is deleted Successfully");
        }

        private bool VideoExists(long id)
        {
            return _context.Videos.Any(e => e.VideoId == id);
        }

    }
}
