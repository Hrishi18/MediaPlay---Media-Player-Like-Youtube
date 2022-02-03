using System;
using System.Collections.Generic;

#nullable disable

namespace LikeDislikeCommentAPI.Model
{
    public partial class Category
    {
        public Category()
        {
            Videos = new HashSet<Video>();
        }

        public long CategoryId { get; set; }
        public string CategoryType { get; set; }

        public virtual ICollection<Video> Videos { get; set; }
    }
}
