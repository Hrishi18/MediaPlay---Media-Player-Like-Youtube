using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LikeDislikeCommentAPI.Model;


namespace LikeDislikeCommentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MediaPlayerContext _context;
        private readonly JwtService _jwtService;
        public UsersController(MediaPlayerContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(long id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(long id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PostUser(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            User userCheck = _context.Users.Where(x => x.Email == user.Email).FirstOrDefault();
            if (userCheck != null)
            {
                return Conflict();
            }
            Random random = new Random();
            long num;
            while (true)
            {
                num = random.Next(Int32.MaxValue);
                if (_context.Users.Find(num) is null)
                {
                    break;
                }
            }
            user.UserId = num;

            _context.Users.Add(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            user.Password = string.Empty;
            // return CreatedAtAction("GetUser", new { id = user.UserId }, user);

            return Ok(new
            {
                message = "success"

            });
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPost(template: "login")]
        public IActionResult Login(User loginData)
        {
            User user = _context.Users.Where(x => x.Email == loginData.Email).FirstOrDefault();

            if (user == null) return BadRequest(error: new { message = "Invalid Credentials" });

            if (!BCrypt.Net.BCrypt.Verify(text: loginData.Password, hash: user.Password))
            {
                return BadRequest(error: new { message = "Invalid Credentials" });
            }

            var jwt = _jwtService.Generate((int)user.UserId);
            Response.Headers.Add("jwt", jwt);
            Response.Headers.Add("uname", user.Name);
            Response.Headers.Add("uid", Convert.ToString(user.UserId));
            //Response.Cookies.Append(key: "jwt", value: jwt, new Microsoft.AspNetCore.Http.CookieOptions
            //{
            //    HttpOnly = true
            //});
            return Ok(new
            {
                message = "success"

            });
        }

        [HttpGet(template: "verify")]
        public User Verify(string jwt)
        {
            try
            {
                var token = _jwtService.Verify(jwt);
                int UserId = int.Parse(token.Issuer);
                User user = _context.Users.Where(x => x.UserId == UserId).FirstOrDefault();
                if (user is null) return null;
                return user;
            }
            catch (Exception)
            {
                return null;
            }
        }
        [HttpPost(template: "Logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete(key: "jwt");

            return Ok(new
            {
                message = "success"
            });
        }
        private bool UserExists(long id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}