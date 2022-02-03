using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LikeDislikeCommentAPI.Model
{
    public class UserWithVideo
    {
        public long UserId { get; set; }
        public long VideoId { get; set; }
        public string Name { get; set; }
        public string VideoTitle { get; set; }
        public string VideoThumbnailPath { get; set; }

        public string VideoDescription { get; set; }


    }
}
