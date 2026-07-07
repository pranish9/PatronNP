import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Type,
  List,
  Quote,
  Image as ImageIcon,
  Video,
  Code,
  X,
  Music,
  Loader2,
  Trash2,
  GripVertical,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import postService from "../services/postService";
import aiService from "../services/aiService";
import PostSidebar from "../components/posts/PostSidebar";
import FileDropzone from "../components/posts/FileDropzone";
import PromptModal from "../components/posts/PromptModal";
import PostLiveModal from "../components/posts/PostLiveModal";
import { uploadImageToCloudinary, uploadAudioToCloudinary } from "../services/cloudinaryService";

// The backend stores publishAt as a plain LocalDateTime (no timezone). Date#toISOString()
// converts to UTC and appends "Z", which silently shifts the clock time by the local
// offset once the backend reads those digits back as if they were already local time —
// a post "5 minutes from now" in Nepal (UTC+5:45) would land ~5h45m in the past there,
// making it look instantly published instead of scheduled. Send the wall-clock value as-is.
const toLocalDateTimeString = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const getYouTubeEmbedUrl = (url) => {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const PostEditor = () => {
  const navigate = useNavigate();
  const { type: typeParam, id } = useParams();
  const username = localStorage.getItem("username") || "";
  const [existing, setExisting] = useState(null);
  const type = existing?.postType?.toLowerCase() || typeParam || "post";

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [visibility, setVisibility] = useState("PUBLIC");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevelIds, setSelectedLevelIds] = useState([]);

  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const savedRangeRef = useRef(null);
  const selectedImageRef = useRef(null);
  const toolbarRef = useRef(null);
  const [imageSelection, setImageSelection] = useState(null);
  const [liveModalOpen, setLiveModalOpen] = useState(false);
  const [livePost, setLivePost] = useState(null);
  const [improvingCaption, setImprovingCaption] = useState(false);

  useEffect(() => {
    if (!id) return;
    postService
      .getPost(id)
      .then(({ data }) => {
        setExisting(data);
        setTitle(data.title || "");
        setCaption(data.caption || "");
        setImages((data.images || []).map((url) => ({ id: url, url })));
        setAudioFile(data.audioUrl ? { url: data.audioUrl, name: data.audioName } : null);
        setPollOptions(data.pollOptions?.length ? data.pollOptions : ["", ""]);
        setVisibility(data.visibility || "PUBLIC");
        setSelectedCategories(data.categories || []);
        setSelectedLevelIds(data.allowedLevelIds || []);
        if (editorRef.current && data.content) {
          editorRef.current.innerHTML = data.content;
        }
      })
      .catch(() => toast.error("Failed to load post"));
  }, [id]);

  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const toggleLevel = (levelId) =>
    setSelectedLevelIds((prev) =>
      prev.includes(levelId) ? prev.filter((id) => id !== levelId) : [...prev, levelId]
    );

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    editorRef.current?.focus();
    const range = savedRangeRef.current;
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const exec = (command, value) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const clearImageSelection = () => {
    if (selectedImageRef.current) {
      selectedImageRef.current.style.outline = "";
      selectedImageRef.current.style.outlineOffset = "";
    }
    selectedImageRef.current = null;
    setImageSelection(null);
  };

  const selectImageNode = (img) => {
    if (selectedImageRef.current && selectedImageRef.current !== img) clearImageSelection();
    img.style.outline = "2px solid #16a34a";
    img.style.outlineOffset = "2px";
    selectedImageRef.current = img;
    setImageSelection({});
  };

  // Clicking the image selects it (shows the remove/resize toolbar); clicking anything
  // else — including elsewhere in the text — deselects it. Clicks on the toolbar itself
  // are excluded so pressing its buttons doesn't immediately clear the selection first.
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "IMG" && editorRef.current?.contains(e.target)) {
        selectImageNode(e.target);
      } else if (toolbarRef.current?.contains(e.target)) {
        return;
      } else {
        clearImageSelection();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const resizeSelectedImage = (width) => {
    const img = selectedImageRef.current;
    if (!img) return;
    img.style.width = width === "full" ? "100%" : `${width}px`;
    img.style.height = "auto";
    setImageSelection({});
  };

  const removeSelectedImage = () => {
    if (!selectedImageRef.current) return;
    selectedImageRef.current.remove();
    clearImageSelection();
  };

  const openLinkModal = () => {
    saveSelection();
    setLinkModalOpen(true);
  };

  const handleInsertLink = (url) => {
    restoreSelection();
    document.execCommand("createLink", false, url);
    setLinkModalOpen(false);
  };

  const openVideoModal = () => {
    saveSelection();
    setVideoModalOpen(true);
  };

  const handleInsertVideo = (url) => {
    const embedUrl = getYouTubeEmbedUrl(url);
    if (!embedUrl) {
      toast.error("Enter a valid YouTube link");
      return;
    }
    restoreSelection();
    document.execCommand(
      "insertHTML",
      false,
      `<iframe src="${embedUrl}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9"></iframe><br/>`
    );
    setVideoModalOpen(false);
  };

  const openImagePicker = () => {
    saveSelection();
    imageInputRef.current?.click();
  };

  const handleImageFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImageToCloudinary(file);
      restoreSelection();
      // insertImage (vs. insertHTML) leaves the image as the last node with nowhere for the
      // caret to go, which is why typing after it — and selecting it to delete — didn't work.
      // A trailing <br> gives the cursor a line to land on, same as the video embed below.
      document.execCommand("insertHTML", false, `<img src="${url}" alt="" draggable="false" /><br/>`);
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const insertCode = () => {
    const selection = window.getSelection()?.toString() || "code";
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, `<code>${selection}</code>`);
  };

  // Album images used to just be URL.createObjectURL(file) — a blob: URL that only exists
  // in this browser tab. It got saved straight into the post payload, so the image "worked"
  // for the moment you picked it and broke for everyone (including you, after a reload) the
  // instant that URL went away. Upload to Cloudinary like inline post images already do, and
  // show the local blob URL only as an instant preview until the real URL comes back.
  const handleImageFiles = (files) => {
    const next = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      uploading: true,
    }));
    setImages((prev) => [...prev, ...next]);

    files.forEach(async (file, i) => {
      const { id } = next[i];
      try {
        const url = await uploadImageToCloudinary(file);
        setImages((prev) => prev.map((img) => (img.id === id ? { ...img, url, uploading: false } : img)));
      } catch (err) {
        toast.error(err.message || "Image upload failed");
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    });
  };

  const removeImage = (index) => setImages((prev) => prev.filter((_, i) => i !== index));

  // Same bug the album-photo fix addressed: a blob: URL only exists in this tab, so
  // saving it directly would break the audio for everyone (including you) after a reload.
  // Show it instantly via the local blob URL, then swap in the real Cloudinary URL.
  const handleAudioFiles = async (files) => {
    const file = files[0];
    if (!file) return;
    setAudioFile({ url: URL.createObjectURL(file), name: file.name, uploading: true });
    try {
      const url = await uploadAudioToCloudinary(file);
      setAudioFile((prev) => (prev ? { ...prev, url, uploading: false } : prev));
    } catch (err) {
      toast.error(err.message || "Audio upload failed");
      setAudioFile(null);
    }
  };

  const updatePollOption = (index, value) =>
    setPollOptions((prev) => prev.map((o, i) => (i === index ? value : o)));

  const addPollOption = () => setPollOptions((prev) => [...prev, ""]);

  const removePollOption = (index) =>
    setPollOptions((prev) => prev.filter((_, i) => i !== index));

  const handleImproveCaption = async () => {
    if (!caption.trim()) {
      toast.error("Write something first");
      return;
    }
    setImprovingCaption(true);
    try {
      const { data } = await aiService.improveText(caption);
      setCaption(data.improvedText);
      toast.success("Improved with AI");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "AI assist failed");
    } finally {
      setImprovingCaption(false);
    }
  };

  const ImproveWithAiButton = () => (
    <button
      type="button"
      onClick={handleImproveCaption}
      disabled={improvingCaption}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-patron-gray-300 text-xs font-semibold text-patron-black hover:bg-patron-gray-50 disabled:opacity-60 shrink-0"
    >
      <Sparkles size={12} className={improvingCaption ? "animate-pulse" : ""} />
      {improvingCaption ? "Improving..." : "Improve with AI"}
    </button>
  );

  const dragChoiceIndexRef = useRef(null);
  const reorderPollOptions = (toIndex) => {
    const fromIndex = dragChoiceIndexRef.current;
    dragChoiceIndexRef.current = null;
    if (fromIndex === null || fromIndex === toIndex) return;
    setPollOptions((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const buildPayload = () => {
    const base = {
      postType: type.toUpperCase(),
      title: title.trim(),
      visibility,
      categories: selectedCategories,
      allowedLevelIds: visibility === "MEMBERS" ? selectedLevelIds : [],
      caption,
    };
    if (type === "post") return { ...base, content: editorRef.current?.innerHTML || "" };
    if (type === "album") return { ...base, images: images.map((i) => i.url) };
    if (type === "audio") return { ...base, audioUrl: audioFile?.url || null, audioName: audioFile?.name || null };
    if (type === "poll") return { ...base, pollOptions: pollOptions.filter((o) => o.trim()) };
    return base;
  };

  const validate = (publishing) => {
    if (!title.trim()) {
      toast.error("Add a title first");
      return false;
    }
    if (type === "album" && images.some((img) => img.uploading)) {
      toast.error("Wait for images to finish uploading");
      return false;
    }
    if (type === "audio" && audioFile?.uploading) {
      toast.error("Wait for the audio to finish uploading");
      return false;
    }
    if (!publishing) return true;
    if (type === "album" && images.length === 0) {
      toast.error("Add at least one image");
      return false;
    }
    if (type === "audio" && !audioFile) {
      toast.error("Upload an audio file");
      return false;
    }
    if (type === "poll" && pollOptions.filter((o) => o.trim()).length < 2) {
      toast.error("Add at least two poll options");
      return false;
    }
    return true;
  };

  const save = async (status, publishAt = null) => {
    if (!validate(status === "PUBLISHED" || status === "SCHEDULED")) return;
    const payload = { ...buildPayload(), status, publishAt };
    try {
      const { data } = existing
        ? await postService.updatePost(existing.id, payload)
        : await postService.createPost(payload);

      if (status === "PUBLISHED") {
        setLivePost(data);
        setLiveModalOpen(true);
      } else {
        toast.success(status === "SCHEDULED" ? "Post scheduled" : "Saved as draft");
        navigate("/posts");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save post");
    }
  };

  const closeLiveModalAndRedirect = () => {
    setLiveModalOpen(false);
    navigate(`/${username}/posts/${livePost.id}`);
  };

  const canPublish = title.trim().length > 0;

  return (
    <div className="min-h-screen bg-patron-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={() => navigate("/posts")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-patron-gray-300 text-sm font-semibold text-patron-black hover:bg-patron-gray-50 mb-6"
        >
          <ArrowLeft size={16} />
          Dashboard
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {type === "poll" && (
              <h2 className="text-2xl font-bold text-patron-black text-center mb-6">Create Poll</h2>
            )}

            {type !== "poll" && (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === "post" ? "Title" : "Add title"}
                className="w-full text-3xl font-bold text-patron-black placeholder-patron-gray-300 outline-none mb-4"
              />
            )}

            {type === "post" && (
              <>
                <div className="flex flex-wrap items-center gap-1 border-y border-patron-gray-200 py-2 mb-4 text-patron-gray-600">
                  <ToolbarButton icon={Bold} onClick={() => exec("bold")} />
                  <ToolbarButton icon={Italic} onClick={() => exec("italic")} />
                  <ToolbarButton icon={Underline} onClick={() => exec("underline")} />
                  <ToolbarButton icon={LinkIcon} onClick={openLinkModal} />
                  <ToolbarButton
                    icon={Type}
                    onClick={() => exec("formatBlock", editorRef.current?.querySelector("h2") ? "P" : "H2")}
                  />
                  <ToolbarButton icon={List} onClick={() => exec("insertUnorderedList")} />
                  <ToolbarButton icon={Quote} onClick={() => exec("formatBlock", "BLOCKQUOTE")} />
                  <ToolbarButton
                    icon={uploadingImage ? Loader2 : ImageIcon}
                    spin={uploadingImage}
                    onClick={openImagePicker}
                  />
                  <ToolbarButton icon={Video} onClick={openVideoModal} />
                  <ToolbarButton icon={Code} onClick={insertCode} />
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileSelected}
                />
                <div className="relative">
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="min-h-[300px] text-patron-black outline-none max-w-none empty:before:content-['Write_something...'] empty:before:text-patron-gray-400 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-patron-gray-300 [&_blockquote]:pl-3 [&_blockquote]:text-patron-gray-600 [&_blockquote]:italic [&_code]:bg-patron-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_a]:text-patron-green-700 [&_a]:underline [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2 [&_img]:block [&_img]:cursor-pointer [&_iframe]:rounded-lg [&_iframe]:my-2"
                  />
                  {imageSelection && selectedImageRef.current && (
                    <div
                      ref={toolbarRef}
                      style={{
                        top: Math.max(selectedImageRef.current.offsetTop - 42, 0),
                        left: selectedImageRef.current.offsetLeft,
                      }}
                      className="absolute z-20 flex items-center gap-0.5 bg-patron-black text-white rounded-lg px-1 py-1 shadow-lg text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => resizeSelectedImage(160)}
                        className="px-2 py-1 rounded hover:bg-white/20 font-medium"
                      >
                        S
                      </button>
                      <button
                        type="button"
                        onClick={() => resizeSelectedImage(320)}
                        className="px-2 py-1 rounded hover:bg-white/20 font-medium"
                      >
                        M
                      </button>
                      <button
                        type="button"
                        onClick={() => resizeSelectedImage(480)}
                        className="px-2 py-1 rounded hover:bg-white/20 font-medium"
                      >
                        L
                      </button>
                      <button
                        type="button"
                        onClick={() => resizeSelectedImage("full")}
                        className="px-2 py-1 rounded hover:bg-white/20 font-medium"
                      >
                        Full
                      </button>
                      <span className="w-px h-4 bg-white/30 mx-0.5" />
                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="p-1.5 rounded hover:bg-white/20"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {type === "album" && (
              <div className="space-y-4">
                <FileDropzone accept="image/*" multiple onFiles={handleImageFiles} icon={ImageIcon} />
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {images.map((img, i) => (
                      <div key={img.id || img.url} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img
                          src={img.url}
                          alt=""
                          className={`w-full h-full object-cover ${img.uploading ? "opacity-50" : ""}`}
                        />
                        {img.uploading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin text-white" />
                          </div>
                        )}
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 border-b border-patron-gray-100 py-2">
                  <input
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Type something here (optional)"
                    className="flex-1 text-sm text-patron-gray-700 placeholder-patron-gray-400 outline-none"
                  />
                  <ImproveWithAiButton />
                </div>
              </div>
            )}

            {type === "audio" && (
              <div className="space-y-4">
                {audioFile ? (
                  <div className="flex items-center gap-3 bg-patron-gray-50 border border-patron-gray-200 rounded-2xl p-4">
                    <div className="w-12 h-12 rounded-xl bg-patron-green-100 flex items-center justify-center text-patron-green-600 shrink-0">
                      {audioFile.uploading ? <Loader2 size={20} className="animate-spin" /> : <Music size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-patron-black truncate">
                        {audioFile.name}
                        {audioFile.uploading && <span className="text-patron-gray-400 font-normal"> — uploading…</span>}
                      </p>
                      <audio src={audioFile.url} controls className="w-full mt-1 h-8" />
                    </div>
                    <button onClick={() => setAudioFile(null)} className="text-patron-gray-400 hover:text-red-600 shrink-0">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <FileDropzone
                    accept="audio/*"
                    onFiles={handleAudioFiles}
                    icon={Music}
                    hint="Upload audio or drag and drop."
                  />
                )}
                <div className="flex items-center gap-2 border-b border-patron-gray-100 py-2">
                  <input
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Type something here (optional)"
                    className="flex-1 text-sm text-patron-gray-700 placeholder-patron-gray-400 outline-none"
                  />
                  <ImproveWithAiButton />
                </div>
              </div>
            )}

            {type === "poll" && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-patron-black">Question</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ask a question.."
                    className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-patron-black">Description</label>
                    <ImproveWithAiButton />
                  </div>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                    placeholder="Provide more information about your poll"
                    className="mt-1.5 w-full px-4 py-3 text-sm bg-patron-gray-100 border-none rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-patron-green-500/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-patron-black">Choices</label>
                  <div className="mt-2 space-y-2">
                    {pollOptions.map((opt, i) => (
                      <div
                        key={i}
                        draggable
                        onDragStart={() => (dragChoiceIndexRef.current = i)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => reorderPollOptions(i)}
                        className="flex items-center gap-2 bg-patron-gray-100 rounded-xl pr-3"
                      >
                        <span className="pl-2 text-patron-gray-400 cursor-grab shrink-0">
                          <GripVertical size={16} />
                        </span>
                        <input
                          value={opt}
                          onChange={(e) => updatePollOption(i, e.target.value)}
                          placeholder="Add"
                          className="flex-1 py-3 text-sm bg-transparent border-none focus:outline-none"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            onClick={() => removePollOption(i)}
                            className="text-patron-gray-400 hover:text-red-600 shrink-0"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addPollOption}
                    className="mt-3 px-4 py-2 border border-patron-gray-300 rounded-full text-sm font-semibold text-patron-black hover:bg-patron-gray-50"
                  >
                    + Add a choice
                  </button>
                </div>
              </div>
            )}
          </div>

          <PostSidebar
            canPublish={canPublish}
            visibility={visibility}
            onVisibilityChange={setVisibility}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            selectedLevelIds={selectedLevelIds}
            onToggleLevel={toggleLevel}
            onPublishNow={() => save("PUBLISHED", toLocalDateTimeString(new Date()))}
            onSaveDraft={() => save("DRAFT")}
            onSchedule={(datetime) => save("SCHEDULED", datetime)}
          />
        </div>
      </div>

      <PromptModal
        isOpen={linkModalOpen}
        title="Insert link"
        label="URL"
        placeholder="https://example.com"
        confirmLabel="Insert"
        onConfirm={handleInsertLink}
        onClose={() => setLinkModalOpen(false)}
      />

      <PromptModal
        isOpen={videoModalOpen}
        title="Insert YouTube video"
        label="YouTube link"
        placeholder="https://www.youtube.com/watch?v=..."
        confirmLabel="Insert"
        onConfirm={handleInsertVideo}
        onClose={() => setVideoModalOpen(false)}
      />

      {livePost && (
        <PostLiveModal
          isOpen={liveModalOpen}
          onClose={closeLiveModalAndRedirect}
          url={`${window.location.origin}/${username}/posts/${livePost.id}`}
          title={livePost.title}
        />
      )}
    </div>
  );
};

const ToolbarButton = ({ icon: Icon, onClick, spin }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={spin}
    className="p-2 rounded-lg hover:bg-patron-gray-100 disabled:opacity-60"
  >
    <Icon size={16} className={spin ? "animate-spin" : ""} />
  </button>
);

export default PostEditor;
