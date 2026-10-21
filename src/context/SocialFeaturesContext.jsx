
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SocialFeaturesContext = createContext(null);

const demoPosts = [
  {
    id: "demo-1",
    username: "india.explores",
    displayName: "India Explores",
    avatarColor: "#962FBF",
    caption: "Discovering the beautiful colours of India. 🇮🇳",
    mediaUrl:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80",
    mediaType: "image",
    likes: 1248,
    comments: [],
    saved: false,
    createdAt: Date.now(),
  },
];

const demoUsers = [
  { username: "art.of.india", displayName: "Art of India", color: "#D62976" },
  { username: "tech.community", displayName: "Tech Community", color: "#4F5BD5" },
  { username: "foodie.trails", displayName: "Foodie Trails", color: "#FA7E1E" },
  { username: "daily.inspiration", displayName: "Daily Inspiration", color: "#0F766E" },
];

export function SocialFeaturesProvider({ children }) {
  const [posts, setPosts] = useState(demoPosts);
  const [stories, setStories] = useState([]);
  const [following, setFollowing] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser] = useState({
    username: "newindiaconnect",
    displayName: "New India Connect",
    color: "#102B59",
  });

  const addNotification = useCallback((type, message, username = "") => {
    setNotifications((current) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        type,
        message,
        username,
        read: false,
        createdAt: Date.now(),
      },
      ...current,
    ]);
  }, []);

  const publishPost = useCallback((post) => {
    setPosts((current) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarColor: currentUser.color,
        likes: 0,
        comments: [],
        saved: false,
        createdAt: Date.now(),
        ...post,
      },
      ...current,
    ]);
  }, [currentUser]);

  const toggleLike = useCallback((postId) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post;

        const liked = !post.liked;
        return {
          ...post,
          liked,
          likes: Math.max(0, post.likes + (liked ? 1 : -1)),
        };
      })
    );
  }, []);

  const addComment = useCallback((postId, text) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `${Date.now()}-${Math.random()}`,
                  username: currentUser.username,
                  text: cleanText,
                  createdAt: Date.now(),
                },
              ],
            }
          : post
      )
    );
  }, [currentUser]);

  const toggleSave = useCallback((postId) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  }, []);

  const toggleFollow = useCallback((username) => {
    const wasFollowing = following.includes(username);

    setFollowing((current) =>
      wasFollowing
        ? current.filter((name) => name !== username)
        : [...current, username]
    );

    if (!wasFollowing) {
      addNotification("follow", `You are now following @${username}`, username);
    }
  }, [following, addNotification]);

  const publishStory = useCallback((story) => {
    setStories((current) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        username: currentUser.username,
        displayName: currentUser.displayName,
        createdAt: Date.now(),
        ...story,
      },
      ...current,
    ]);
  }, [currentUser]);

  const markNotificationsRead = useCallback(() => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
  }, []);

  const value = useMemo(() => ({
    posts,
    stories,
    following,
    notifications,
    currentUser,
    suggestedUsers: demoUsers,
    publishPost,
    toggleLike,
    addComment,
    toggleSave,
    toggleFollow,
    publishStory,
    addNotification,
    markNotificationsRead,
  }), [
    posts, stories, following, notifications, currentUser,
    publishPost, toggleLike, addComment, toggleSave,
    toggleFollow, publishStory, addNotification, markNotificationsRead,
  ]);

  return (
    <SocialFeaturesContext.Provider value={value}>
      {children}
    </SocialFeaturesContext.Provider>
  );
}

export function useSocialFeatures() {
  const context = useContext(SocialFeaturesContext);

  if (!context) {
    throw new Error(
      "useSocialFeatures must be used inside SocialFeaturesProvider"
    );
  }

  return context;
}
