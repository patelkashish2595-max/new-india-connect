
import React, { useState } from "react";
import { MoreHorizontal, MessageCircle } from "lucide-react";
import Avatar from "../common/Avatar";
import PostActions from "./PostActions";
import Comments from "./Comments";

export default function PostCard({ post }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const username = post.username || post.name || "newindiaconnect";
  const imageUrl =
    post.imageUrl ||
    (post.image
      ? `https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=900&q=85`
      : "");

  function addComment(event) {
    event.preventDefault();
    if (!commentText.trim()) return;

    setComments((current) => [
      ...current,
      {
        id: Date.now(),
        username: "you",
        text: commentText.trim(),
        likes: 0,
      },
    ]);

    setCommentText("");
    setCommentsOpen(true);
  }

  async function sharePost() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${username}`,
          text: post.caption || "Check out this post on New India Connect",
          url,
        });
      } catch {
        // User cancelled sharing.
      }
    } else if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        alert("Page link copied!");
      } catch {
        alert("Sharing is not available in this browser.");
      }
    } else {
      alert("Sharing is not available in this browser.");
    }
  }

  return (
    <article
      style={{
        width: "100%",
        maxWidth: 470,
        margin: "0 auto 24px",
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: 12,
        }}
      >
        <Avatar
          name={post.avatar || username}
          src={post.avatarUrl}
          color={post.color || "#C13584"}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <strong>{username}</strong>
          {post.location && (
            <div style={{ fontSize: 12, color: "#777", marginTop: 3 }}>
              {post.location}
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="More post options"
          onClick={() => alert("More post options will be added later.")}
          style={iconButton}
        >
          <MoreHorizontal size={23} />
        </button>
      </header>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={post.caption || "Community post"}
          loading="lazy"
          style={{
            display: "block",
            width: "100%",
            maxHeight: 600,
            aspectRatio: "4 / 4.5",
            objectFit: "cover",
            background: "#f5f5f5",
          }}
        />
      )}

      <div style={{ padding: "0 12px" }}>
        <PostActions
          initialLikes={post.likes || 0}
          onComment={() => setCommentsOpen((open) => !open)}
          onShare={sharePost}
        />

        <div style={{ fontSize: 14, marginBottom: 8 }}>
          <strong>{username}</strong>{" "}
          <span>{post.caption || "Sharing a moment with the community ✨"}</span>
        </div>

        <button
          type="button"
          onClick={() => setCommentsOpen((open) => !open)}
          style={{
            border: 0,
            background: "transparent",
            padding: "4px 0 12px",
            color: "#888",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          {commentsOpen
            ? "Hide comments"
            : `View comments (${comments.length})`}
        </button>

        {commentsOpen && (
          <div style={{ paddingBottom: 12 }}>
            <Comments postId={post.id} initialComments={comments} />

            <form onSubmit={addComment} style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a comment..."
                maxLength={500}
                aria-label="Write a comment"
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: 10,
                  border: "1px solid #eee",
                  borderRadius: 18,
                }}
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#C13584",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

const iconButton = {
  display: "grid",
  placeItems: "center",
  border: 0,
  background: "transparent",
  color: "#262626",
  cursor: "pointer",
};
