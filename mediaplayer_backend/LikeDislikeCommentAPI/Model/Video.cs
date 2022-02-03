using System;
using System.Collections.Generic;

#nullable disable

namespace LikeDislikeCommentAPI.Model
{
    public partial class Video
    {
        public Video()
        {
            Comments = new HashSet<Comment>();
            Likes = new HashSet<Like>();
        }

        public long VideoId { get; set; }
        public string VideoPath { get; set; }
        public string ThumbnailPath { get; set; }
        public string VideoDescription { get; set; }
        public string VideoTag { get; set; }
        public long CategoryId { get; set; }
        public long UserId { get; set; }
        public string VideoTitle { get; set; }

        public virtual Category Category { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Like> Likes { get; set; }
    }
}
