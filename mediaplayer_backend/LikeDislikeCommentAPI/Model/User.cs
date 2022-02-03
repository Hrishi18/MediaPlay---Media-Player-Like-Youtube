using System;
using System.Collections.Generic;

#nullable disable

namespace LikeDislikeCommentAPI.Model
{
    public partial class User
    {
        public User()
        {
            Comments = new HashSet<Comment>();
            Likes = new HashSet<Like>();
            Videos = new HashSet<Video>();
        }

        public long UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Like> Likes { get; set; }
        public virtual ICollection<Video> Videos { get; set; }
    }
}
