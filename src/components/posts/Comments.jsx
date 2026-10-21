
import React, { useState } from "react";
import { Heart, Send } from "lucide-react";

export default function Comments({
  postId,
  initialComments = [],
}) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [likedComments, setLikedComments] = useState([]);

  function addComment(event) {
    event.preventDefault();

    const message = text.trim();
    if (!message) return;

    setComments((current) => [
      ...current,
      {
        id: `${postId || "post"}-${Date.now()}`,
        username: "you",
        text: message,
        likes: 0,
      },
    ]);

    setText("");
  }

  function toggleLike(id) {
    setLikedComments((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <section style={{ width: "100%", color: "#262626" }}>
      <h3 style={{ fontSize: 16, margin: "0 0 16px" }}>
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      <div style={{ display: "grid", gap: 16, marginBottom: 18 }}>
        {comments.length === 0 ? (
          <p style={{ color: "#888", fontSize: 14 }}>
            No comments yet. Start the conversation!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  flexShrink: 0,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "linear-gradient(135deg,#C13584,#833AB4)",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                {(comment.username || "u").charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, overflowWrap: "anywhere" }}>
                  <strong>{comment.username || "user"}</strong>{" "}
                  {comment.text}
                </p>
                <small style={{ color: "#888" }}>
                  {comment.likes || 0} likes
                </small>
              </div>

              <button
                type="button"
                aria-label="Like comment"
                onClick={() => toggleLike(comment.id)}
                style={{
                  border: 0,
                  background: "transparent",
                  padding: 4,
                  cursor: "pointer",
                }}
              >
                <Heart
                  size={16}
                  color={likedComments.includes(comment.id) ? "#C13584" : "#888"}
                  fill={likedComments.includes(comment.id) ? "#C13584" : "none"}
                />
              </button>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={addComment}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderTop: "1px solid #EEEEEE",
          paddingTop: 14,
        }}
      >
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a comment..."
          aria-label="Write a comment"
          maxLength={500}
          style={{
            flex: 1,
            minWidth: 0,
            border: "1px solid #E5E5E5",
            borderRadius: 20,
            padding: "11px 14px",
            outlineColor: "#C13584",
          }}
        />

        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Post comment"
          style={{
            border: 0,
            background: "transparent",
            color: "#C13584",
            cursor: text.trim() ? "pointer" : "not-allowed",
            opacity: text.trim() ? 1 : 0.5,
          }}
        >
          <Send size={20} />
        </button>
      </form>

      <small style={{ display: "block", color: "#999", marginTop: 10 }}>
        Comments are currently saved only in this page session.
      </small>
    </section>
  );
}
