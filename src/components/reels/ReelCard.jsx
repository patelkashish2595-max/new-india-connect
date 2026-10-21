import React from "react";
import ReelPlayer from "./ReelPlayer.jsx";
export default function ReelCard({ reel, onLike }) { return <article className="reel-card"><ReelPlayer src={reel.mediaUrl} poster={reel.poster} caption={reel.caption} /><p>{reel.caption}</p><button type="button" onClick={() => onLike?.(reel)}>Like · {reel.likes || 0}</button></article>; }
