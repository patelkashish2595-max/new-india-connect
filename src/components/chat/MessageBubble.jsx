import React from "react";
export default function MessageBubble({ message, own = false }) { return <div className={`message-bubble${own ? " own" : ""}`}><p>{message?.text || ""}</p>{message?.createdAt && <time>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>}</div>; }
