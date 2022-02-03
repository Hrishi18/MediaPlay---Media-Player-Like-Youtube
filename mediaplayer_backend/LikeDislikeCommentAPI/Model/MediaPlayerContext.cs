using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace LikeDislikeCommentAPI.Model
{
    public partial class MediaPlayerContext : DbContext
    {
        public MediaPlayerContext()
        {
        }

        public MediaPlayerContext(DbContextOptions<MediaPlayerContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<Like> Likes { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Video> Videos { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {


            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=mssql,1433;Initial Catalog=MediaPlayer;User Id=SA;Password=Password2;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("category");

                entity.Property(e => e.CategoryId)
                    .ValueGeneratedNever()
                    .HasColumnName("category_id");

                entity.Property(e => e.CategoryType)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("category_type");
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.ToTable("comments");

                entity.Property(e => e.CommentId).HasColumnName("comment_id");

                entity.Property(e => e.CommentText)
                    .IsRequired()
                    .HasColumnType("text")
                    .HasColumnName("comment_text");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.Property(e => e.VideoId).HasColumnName("video_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__comments__user_i__2B3F6F97");

                entity.HasOne(d => d.Video)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(d => d.VideoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__comments__video___2A4B4B5E");
            });

            modelBuilder.Entity<Like>(entity =>
            {
                entity.HasKey(e => new { e.VideoId, e.UserId })
                    .HasName("PK__likes__036AFD60CF0F01AE");

                entity.ToTable("likes");

                entity.Property(e => e.VideoId).HasColumnName("video_id");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.Property(e => e.IsLiked).HasColumnName("isLiked");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Likes)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__likes__user_id__300424B4");

                entity.HasOne(d => d.Video)
                    .WithMany(p => p.Likes)
                    .HasForeignKey(d => d.VideoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__likes__video_id__2F10007B");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.UserId)
                    .ValueGeneratedNever()
                    .HasColumnName("user_id");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("name")
                    .IsFixedLength(true);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("password");
            });

            modelBuilder.Entity<Video>(entity =>
            {
                entity.ToTable("videos");

                entity.Property(e => e.VideoId)
                    .ValueGeneratedNever()
                    .HasColumnName("video_id");

                entity.Property(e => e.CategoryId).HasColumnName("category_id");

                entity.Property(e => e.ThumbnailPath)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("thumbnail_path");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.Property(e => e.VideoDescription)
                    .IsRequired()
                    .HasColumnType("text")
                    .HasColumnName("video_description");

                entity.Property(e => e.VideoPath)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("video_path");

                entity.Property(e => e.VideoTag)
                    .IsRequired()
                    .HasColumnType("text")
                    .HasColumnName("video_tag");

                entity.Property(e => e.VideoTitle)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("video_title");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Videos)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__videos__category__276EDEB3");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Videos)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__videos__user_id__2C3393D0");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
