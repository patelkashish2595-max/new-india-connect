import React from "react";
export default function ReelPlayer({ src, poster, caption = "" }) { return <video className="reel-player" src={src} poster={poster} controls playsInline loop aria-label={caption || "Reel video"} />; }
