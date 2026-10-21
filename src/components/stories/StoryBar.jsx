
import { useRef, useState } from "react";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSocialFeatures } from "../context/SocialFeaturesContext";

export default function StoryBar() {
  const { stories, publishStory, currentUser } = useSocialFeatures();
  const inputRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  function chooseFile(event) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/") &&
        !selectedFile.type.startsWith("video/")) {
      alert("Please select an image or video.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  function publish() {
    if (!file || !preview) return;

    publishStory({
      mediaUrl: preview,
      mediaType: file.type.startsWith("video/") ? "video" : "image",
    });

    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function closePreview() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const allStories = [
    ...stories,
  ];

  return (
    <>
      <section className="nic-stories">
        <button
          type="button"
          className="nic-story"
          onClick={() => inputRef.current?.click()}
        >
          <span className="nic-story-ring nic-own-story">
            <span className="nic-story-avatar">
              {currentUser.displayName.slice(0, 1)}
            </span>
            <span className="nic-story-plus"><Plus size={15} /></span>
          </span>
          <span className="nic-story-name">Your story</span>
        </button>

        {allStories.map((story) => (
          <button
            type="button"
            className="nic-story"
            key={story.id}
            onClick={() => setSelected(story)}
          >
            <span className="nic-story-ring">
              {story.mediaType === "video" ? (
                <video src={story.mediaUrl} muted />
              ) : (
                <img src={story.mediaUrl} alt="" />
              )}
            </span>
            <span className="nic-story-name">
              {story.username === currentUser.username
                ? "Your story"
                : story.username}
            </span>
          </button>
        ))}
      </section>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        hidden
        onChange={chooseFile}
      />

      {preview && (
        <div className="nic-story-overlay">
          <div className="nic-story-dialog">
            <header>
              <strong>Preview story</strong>
              <button type="button" onClick={closePreview} aria-label="Close">
                <X />
              </button>
            </header>

            {file?.type.startsWith("video/") ? (
              <video src={preview} controls autoPlay />
            ) : (
              <img src={preview} alt="Story preview" />
            )}

            <button
              type="button"
              className="nic-story-publish"
              onClick={publish}
            >
              Share to story
            </button>
          </div>
        </div>
      )}

      {selected && (
        <div className="nic-story-overlay" onClick={() => setSelected(null)}>
          <div
            className="nic-story-viewer"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="nic-story-close"
              onClick={() => setSelected(null)}
              aria-label="Close story"
            >
              <X />
            </button>

            {selected.mediaType === "video" ? (
              <video src={selected.mediaUrl} controls autoPlay />
            ) : (
              <img src={selected.mediaUrl} alt="Story" />
            )}

            <div className="nic-story-viewer-name">
              @{selected.username}
            </div>

            <button
              type="button"
              className="nic-story-next"
              onClick={() => setSelected(null)}
            >
              Close story <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
