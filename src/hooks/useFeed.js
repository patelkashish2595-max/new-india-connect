import { useCallback, useEffect, useState } from "react";
import { getPosts } from "../services/postService.js";
export default function useFeed() { const [posts, setPosts] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const refresh = useCallback(async () => { setLoading(true); setError(""); try { const data = await getPosts(); setPosts(data.posts || []); } catch (e) { setError(e.message || "Could not load feed"); } finally { setLoading(false); } }, []); useEffect(() => { refresh(); }, [refresh]); return { posts, setPosts, loading, error, refresh }; }
export { useFeed };
