using System;
using System.Collections.Generic;

#nullable disable

namespace LikeDislikeCommentAPI.Model
{
    public partial class Comment
    {
        public long VideoId { get; set; }
        public long UserId { get; set; }
        public string CommentText { get; set; }
        public long CommentId { get; set; }

        public virtual User User { get; set; }
        public virtual Video Video { get; set; }
    }
}
