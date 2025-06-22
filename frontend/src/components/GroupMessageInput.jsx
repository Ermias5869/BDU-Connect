import { useRef, useState } from "react";
import { Image, Send, Video, File, X, Smile } from "lucide-react";
import { toast } from "react-toastify";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import { groupStore } from "../store/groupChatStore";
import { useQueryClient } from "@tanstack/react-query";

const GroupMessageInput = ({ refetchMessages }) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [fileData, setFileData] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [fileFile, setFileFile] = useState(null);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const { sendGroupMessage } = groupStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) return toast.error("Invalid image");
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("video/")) return toast.error("Invalid video");
    setVideoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setVideoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileFile(file);
    setFileData({ name: file.name, url: URL.createObjectURL(file) });
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeFile = () => {
    setFileFile(null);
    setFileData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji.native);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageFile && !videoFile && !fileFile) return;

    const formData = new FormData();
    formData.append("text", text.trim());
    if (imageFile) formData.append("photo", imageFile);
    if (videoFile) formData.append("video", videoFile);
    if (fileFile) formData.append("file", fileFile);

    try {
      await sendGroupMessage(formData);
      setText("");
      removeImage();
      removeVideo();
      removeFile();
      setShowEmojiPicker(false);
      refetchMessages();
      queryClient.invalidateQueries(["group"]);
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div className="relative  bg-white w-full">
      <div className="flex flex-wrap gap-3 mb-3">
        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {videoPreview && (
          <div className="relative">
            <video
              src={videoPreview}
              className="w-20 h-20 object-cover rounded-lg border"
              controls
            />
            <button
              onClick={removeVideo}
              type="button"
              className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {fileData && (
          <div className="relative flex items-center gap-2 bg-gray-100 p-2 rounded-lg border">
            <File size={20} className="text-blue-500" />
            <span className="text-sm">{fileData.name}</span>
            <button
              onClick={removeFile}
              type="button"
              className="ml-auto w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-2 z-50">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 input input-bordered input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* File Inputs */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={imageInputRef}
          onChange={handleImageChange}
        />
        <input
          type="file"
          accept="video/*"
          className="hidden"
          ref={videoInputRef}
          onChange={handleVideoChange}
        />
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {/* Action Icons */}
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="btn btn-circle w-8 h-8  text-blue-500"
        >
          <Image size={15} />
        </button>

        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="btn btn-circle  w-8 h-8 text-red-500"
        >
          <Video size={15} />
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-circle  w-8 h-8 text-green-600"
        >
          <File size={15} />
        </button>
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="btn btn-circle  w-8 h-8 text-yellow-500"
        >
          <Smile size={15} />
        </button>

        <button
          type="submit"
          disabled={!text.trim() && !imageFile && !videoFile && !fileFile}
          className="btn  w-8 h-8 btn-circle btn-primary"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};

export default GroupMessageInput;
