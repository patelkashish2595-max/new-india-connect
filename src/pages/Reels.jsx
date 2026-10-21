
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Volume2,
  VolumeX,
  Upload,
  Plus,
  X,
} from "lucide-react";

export default function Reels() {
  const [reels, setReels] = useState([]);
  const [liked, setLiked] = useState({});
  const [muted, setMuted] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const [commentReelId, setCommentReelId] = useState(null);

  const fileRef = useRef(null);
  const feedRef = useRef(null);
  const videoRefs = useRef({});
  const nextId = useRef(1);
  const urlsRef = useRef([]);

  useEffect(() => {
    return () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Automatically play the Reel visible on screen.
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
            Object.values(videoRefs.current).forEach((other) => {
              if (other && other !== video) other.pause();
            });

            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { root: feed, threshold: [0, 0.65, 1] }
    );

    feed.querySelectorAll("video").forEach((video) => {
      observer.observe(video);
    });

    return () => observer.disconnect();
  }, [reels]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file.");
      event.target.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("Video must be smaller than 100 MB.");
      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      urlsRef.current = urlsRef.current.filter(
        (url) => url !== previewUrl
      );
    }

    const url = URL.createObjectURL(file);
    urlsRef.current.push(url);

    setSelectedFile(file);
    setPreviewUrl(url);
  };

  const publishReel = () => {
    if (!selectedFile || !previewUrl) {
      alert("Please choose a video first.");
      return;
    }

    const newReel = {
      id: nextId.current++,
      username: "you",
      caption: caption.trim() || selectedFile.name,
      video: previewUrl,
      likes: 0,
      comments: 0,
      localUrl: true,
    };

    setReels((current) => [newReel, ...current]);
    setCaption("");
    setSelectedFile(null);
    setPreviewUrl("");
    setShowUpload(false);

    if (fileRef.current) fileRef.current.value = "";
    if (feedRef.current) feedRef.current.scrollTop = 0;
  };

  const cancelUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      urlsRef.current = urlsRef.current.filter(
        (url) => url !== previewUrl
      );
    }

    setSelectedFile(null);
    setPreviewUrl("");
    setCaption("");
    setShowUpload(false);

    if (fileRef.current) fileRef.current.value = "";
  };

  const shareReel = async (reel) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "New India Connect Reel",
          text: reel.caption,
          url: window.location.href,
        });
      } catch {
        // Sharing was cancelled or unavailable.
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Page link copied. Note: the local video itself is not uploaded.");
      } catch {
        alert("Sharing is not supported in this browser.");
      }
    }
  };

  const addComment = (reelId) => {
    const text = commentText.trim();
    if (!text) return;

    setComments((current) => ({
      ...current,
      [reelId]: [...(current[reelId] || []), text],
    }));

    setReels((current) =>
      current.map((reel) =>
        reel.id === reelId
          ? { ...reel, comments: reel.comments + 1 }
          : reel
      )
    );

    setCommentText("");
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Reels</h1>
          <p style={styles.subtitle}>
            Discover moments from your community
          </p>
        </div>

        <button
          type="button"
          style={styles.primaryButton}
          onClick={() => setShowUpload((value) => !value)}
        >
          <Plus size={19} /> Create Reel
        </button>
      </header>

      {showUpload && (
        <section style={styles.uploadPanel}>
          <div style={styles.panelHeader}>
            <h3 style={{ margin: 0 }}>Create a Reel</h3>
            <button
              type="button"
              style={styles.closeButton}
              onClick={cancelUpload}
              aria-label="Close upload panel"
            >
              <X size={20} />
            </button>
          </div>

          <p style={styles.helper}>
            Choose a video from your computer. Maximum size: 100 MB.
          </p>

          <textarea
            style={styles.captionInput}
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Write a caption..."
            maxLength={300}
            rows={3}
          />

          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div style={styles.uploadActions}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={18} /> Choose Video
            </button>

            {selectedFile && (
              <span style={styles.fileName}>
                {selectedFile.name}
              </span>
            )}
          </div>

          {previewUrl && (
            <div style={styles.previewContainer}>
              <video
                src={previewUrl}
                controls
                playsInline
                style={styles.preview}
              />

              <button
                type="button"
                style={styles.primaryButton}
                onClick={publishReel}
              >
                Publish Reel
              </button>
            </div>
          )}
        </section>
      )}

      <section ref={feedRef} style={styles.feed}>
        {reels.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Upload size={32} />
            </div>
            <h3>No Reels yet</h3>
            <p>
              Be the first to share a video with your community.
            </p>
            <button
              type="button"
              style={styles.primaryButton}
              onClick={() => setShowUpload(true)}
            >
              <Plus size={18} /> Create Your First Reel
            </button>
          </div>
        ) : (
          reels.map((reel) => (
            <article key={reel.id} style={styles.card}>
              <video
                ref={(element) => {
                  if (element) videoRefs.current[reel.id] = element;
                  else delete videoRefs.current[reel.id];
                }}
                src={reel.video}
                playsInline
                loop
                muted={muted}
                controls
                preload="metadata"
                style={styles.video}
              />

              <button
                type="button"
                style={styles.soundButton}
                aria-label={muted ? "Turn sound on" : "Mute videos"}
                onClick={() => setMuted((value) => !value)}
              >
                {muted ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>

              <div style={styles.overlay}>
                <strong>@{reel.username}</strong>
                <p style={{ marginBottom: 8 }}>{reel.caption}</p>

                <div style={styles.actions}>
                  <button
                    type="button"
                    style={styles.action}
                    onClick={() =>
                      setLiked((old) => ({
                        ...old,
                        [reel.id]: !old[reel.id],
                      }))
                    }
                  >
                    <Heart
                      size={23}
                      fill={liked[reel.id] ? "#ff3158" : "none"}
                      color={liked[reel.id] ? "#ff3158" : "#fff"}
                    />
                    {reel.likes + (liked[reel.id] ? 1 : 0)}
                  </button>

                  <button
                    type="button"
                    style={styles.action}
                    onClick={() =>
                      setCommentReelId(
                        commentReelId === reel.id ? null : reel.id
                      )
                    }
                  >
                    <MessageCircle size={23} />
                    {reel.comments}
                  </button>

                  <button
                    type="button"
                    style={styles.action}
                    onClick={() => shareReel(reel)}
                  >
                    <Send size={22} /> Share
                  </button>
                </div>
              </div>

              {commentReelId === reel.id && (
                <div style={styles.commentPanel}>
                  {(comments[reel.id] || []).map((comment, index) => (
                    <p key={`${reel.id}-${index}`} style={styles.comment}>
                      {comment}
                    </p>
                  ))}

                  <div style={styles.commentForm}>
                    <input
                      value={commentText}
                      onChange={(event) => setCommentText(event.target.value)}
                      placeholder="Write a comment..."
                      style={styles.commentInput}
                      maxLength={300}
                    />
                    <button
                      type="button"
                      style={styles.commentButton}
                      onClick={() => addComment(reel.id)}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    width: "100%",
    maxWidth: 900,
    margin: "0 auto",
    padding: "20px 16px",
    boxSizing: "border-box",
    color: "#263247",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },
  title: {
    margin: 0,
    fontSize: 29,
    fontWeight: 800,
    background: "linear-gradient(110deg, #d62976, #962fbf)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: { color: "#7b8496", fontSize: 14, marginTop: 6 },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: 0,
    borderRadius: 10,
    padding: "11px 15px",
    background: "linear-gradient(110deg, #d62976, #962fbf)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "1px solid #dce0e8",
    borderRadius: 10,
    padding: "10px 14px",
    background: "#fff",
    color: "#263247",
    fontWeight: 600,
    cursor: "pointer",
  },
  uploadPanel: {
    padding: 18,
    marginBottom: 18,
    border: "1px solid #e8eaf0",
    borderRadius: 16,
    background: "#fff",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  closeButton: {
    display: "grid",
    placeItems: "center",
    width: 36,
    height: 36,
    border: 0,
    borderRadius: 9,
    background: "#f1f2f6",
    cursor: "pointer",
  },
  helper: { color: "#7b8496", fontSize: 13 },
  captionInput: {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    padding: 12,
    margin: "12px 0",
    border: "1px solid #dce0e8",
    borderRadius: 9,
    font: "inherit",
    resize: "vertical",
  },
  uploadActions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
  },
  fileName: {
    color: "#596579",
    fontSize: 13,
    overflowWrap: "anywhere",
  },
  previewContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 16,
  },
  preview: {
    width: "100%",
    maxWidth: 300,
    maxHeight: 400,
    borderRadius: 12,
    background: "#111",
  },
  feed: {
    height: "min(76vh, 760px)",
    minHeight: 480,
    overflowY: "auto",
    overscrollBehavior: "contain",
    scrollSnapType: "y mandatory",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18,
    padding: "2px 0 18px",
  },
  emptyState: {
    width: "100%",
    maxWidth: 390,
    minHeight: 380,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: 12,
    padding: 24,
    boxSizing: "border-box",
    border: "1px dashed #dce0e8",
    borderRadius: 20,
    background: "#fff",
  },
  emptyIcon: {
    display: "grid",
    placeItems: "center",
    width: 68,
    height: 68,
    borderRadius: "50%",
    color: "#962fbf",
    background: "#f7eafa",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: 390,
    height: "min(72vh, 700px)",
    minHeight: 450,
    flex: "0 0 auto",
    overflow: "hidden",
    borderRadius: 20,
    background: "#111",
    scrollSnapAlign: "start",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    background: "#111",
  },
  soundButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 42,
    height: 42,
    display: "grid",
    placeItems: "center",
    border: 0,
    borderRadius: "50%",
    color: "#fff",
    background: "rgba(0,0,0,.6)",
    cursor: "pointer",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "70px 16px 18px",
    color: "#fff",
    background: "linear-gradient(transparent, rgba(0,0,0,.82))",
    pointerEvents: "none",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
    alignItems: "center",
    marginTop: 12,
    pointerEvents: "auto",
  },
  action: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: 0,
    background: "transparent",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
  },
  commentPanel: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 115,
    maxHeight: 180,
    overflowY: "auto",
    padding: 12,
    borderRadius: 12,
    color: "#263247",
    background: "rgba(255,255,255,.96)",
  },
  comment: {
    fontSize: 13,
    paddingBottom: 6,
    borderBottom: "1px solid #eee",
    overflowWrap: "anywhere",
  },
  commentForm: {
    display: "flex",
    gap: 8,
    marginTop: 8,
  },
  commentInput: {
    minWidth: 0,
    flex: 1,
    padding: 9,
    border: "1px solid #dce0e8",
    borderRadius: 8,
  },
  commentButton: {
    padding: "8px 12px",
    border: 0,
    borderRadius: 8,
    background: "#962fbf",
    color: "#fff",
    cursor: "pointer",
  },
};
