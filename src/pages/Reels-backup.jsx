
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from "lucide-react";

const demoReels = [
  {
    id: 1,
    username: "newindiaconnect",
    caption: "Welcome to New India Connect! 🇮🇳",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    likes: 1250,
    comments: 86,
  },
  {
    id: 2,
    username: "creator_india",
    caption: "Share your moments with the world ✨",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 842,
    comments: 42,
  },
];

export default function Reels() {
  const [liked, setLiked] = useState({});
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState({});
  const [activeVideo, setActiveVideo] = useState(1);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Reels</h1>
          <p style={styles.subtitle}>Discover moments from your community</p>
        </div>
      </header>

      <div style={styles.feed}>
        {demoReels.map((reel) => (
          <article key={reel.id} style={styles.card}>
            <video
              src={reel.video}
              controls
              playsInline
              loop
              muted={muted}
              onPlay={() => {
                setActiveVideo(reel.id);
                setPlaying((old) => ({ ...old, [reel.id]: true }));
              }}
              onPause={() =>
                setPlaying((old) => ({ ...old, [reel.id]: false }))
              }
              style={styles.video}
            />

            <button
              type="button"
              aria-label={muted ? "Unmute videos" : "Mute videos"}
              onClick={() => setMuted((old) => !old)}
              style={styles.soundButton}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <div style={styles.details}>
              <strong>@{reel.username}</strong>
              <p>{reel.caption}</p>

              <div style={styles.actions}>
                <button
                  type="button"
                  onClick={() =>
                    setLiked((old) => ({
                      ...old,
                      [reel.id]: !old[reel.id],
                    }))
                  }
                  style={{
                    ...styles.action,
                    color: liked[reel.id] ? "#e1306c" : "#263247",
                  }}
                >
                  <Heart
                    size={22}
                    fill={liked[reel.id] ? "#e1306c" : "none"}
                  />
                  {reel.likes + (liked[reel.id] ? 1 : 0)}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert("Comments feature will be connected next.")
                  }
                  style={styles.action}
                >
                  <MessageCircle size={22} />
                  {reel.comments}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "New India Connect Reel",
                        text: reel.caption,
                        url: window.location.href,
                      }).catch(() => {});
                    } else {
                      alert("Share is not supported in this browser.");
                    }
                  }}
                  style={styles.action}
                >
                  <Send size={21} />
                  Share
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

const styles = {
  page: {
    width: "100%",
    maxWidth: 720,
    margin: "0 auto",
    padding: "24px 18px 50px",
    color: "#263247",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    background: "linear-gradient(110deg, #d62976, #962fbf)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#7b8496",
    fontSize: 14,
  },
  feed: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 22,
  },
  card: {
    position: "relative",
    overflow: "hidden",
    border: "1px solid #e8eaf0",
    borderRadius: 20,
    background: "#fff",
    boxShadow: "0 8px 28px rgba(16,43,89,0.06)",
  },
  video: {
    display: "block",
    width: "100%",
    aspectRatio: "9 / 12",
    objectFit: "cover",
    background: "#151515",
  },
  soundButton: {
    position: "absolute",
    top: 12,
    right: 12,
    display: "grid",
    placeItems: "center",
    width: 40,
    height: 40,
    border: 0,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    cursor: "pointer",
  },
  details: {
    padding: 16,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 14,
  },
  action: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: 0,
    background: "transparent",
    fontSize: 13,
    cursor: "pointer",
  },
};
