import apiRequest from "./api.js";
export const getPosts = () => apiRequest("/posts");
export const createPost = (post) => apiRequest("/posts", { method: "POST", body: JSON.stringify(post) });
export const likePost = (postId) => apiRequest(`/posts/${encodeURIComponent(postId)}/like`, { method: "POST", body: JSON.stringify({}) });
export const addPostComment = (postId, text) => apiRequest(`/posts/${encodeURIComponent(postId)}/comments`, { method: "POST", body: JSON.stringify({ text }) });
