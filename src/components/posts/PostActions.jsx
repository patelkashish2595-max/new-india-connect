


import React, { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

export default function PostActions({
  initialLikes = 0,
  initialLiked = false,
  initialSaved = false,
  onLike,
  onComment,
  onShare,
  onSave,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [likes, setLikes] = useState(initialLikes);

  function handleLike() {
    const next = !liked;
    setLiked(next);
    setLikes((count) => Math.max(0, count + (next ? 1 : -1)));
    onLike?.(next);
  }

  function handleSave() {
    const next = !saved;
    setSaved(next);
    onSave?.(next);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          type="button"
          onClick={handleLike}
          aria-label={liked ? "Unlike post" : "Like post"}
          style={buttonStyle}
        >
          <Heart
            size={25}
            color={liked ? "#E1306C" : "currentColor"}
            fill={liked ? "#E1306C" : "none"}
          />
        </button>

        <button
          type="button"
          onClick={onComment}
          aria-label="Comment on post"
          style={buttonStyle}
        >
          <MessageCircle size={25} />
        </button>

        <button
          type="button"
          onClick={onShare}
          aria-label="Share post"
          style={buttonStyle}
        >
          <Send size={24} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleSave}
        aria-label={saved ? "Remove saved post" : "Save post"}
        style={buttonStyle}
      >
        <Bookmark
          size={24}
          fill={saved ? "#833AB4" : "none"}
          color={saved ? "#833AB4" : "currentColor"}
        />
      </button>

      <span style={{ fontSize: 13, color: "#777" }}>
        {likes.toLocaleString()} likes
      </span>
    </div>
  );
}

const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 2,
  border: 0,
  background: "transparent",
  color: "#262626",
  cursor: "pointer",
};
