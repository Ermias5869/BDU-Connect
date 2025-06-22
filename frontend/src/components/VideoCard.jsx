import { Heart, MessageCircle, Trash2, Pencil } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FaPauseCircle, FaPlayCircle, FaTrash } from "react-icons/fa";
import { formatPostDate } from "../utility";
import { Link } from "react-router-dom";
import { HiHeart } from "react-icons/hi2";

export default function VideoCard({
  video,
  likeReelMutation,
  currentUserId,
  commentMutation,
  deleteCommentMutation,
  updateCommentMutation,
  deletevideoMutation,
}) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) {
          video.play();
          setIsPaused(false);
        } else {
          video.pause();
          setIsPaused(true);
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
    setCurrentTime(value);
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const toggleCommentModal = () => {
    setIsCommentOpen((prev) => !prev);
    setEditCommentId(null); // close edit mode when modal toggled
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      commentMutation.mutate({ videoId: video._id, text: comment });
      setComment("");
    }
  };

  const handleDeleteComment = (commentId) => {
    deleteCommentMutation.mutate({ videoId: video._id, commentId });
  };

  const handleUpdateComment = (e) => {
    e.preventDefault();
    if (editCommentText.trim()) {
      updateCommentMutation.mutate({
        videoId: video._id,
        commentId: editCommentId,
        text: editCommentText,
      });
      setEditCommentId(null);
      setEditCommentText("");
    }
  };

  return (
    <div
      key={video._id}
      className="relative max-w-md mx-auto p-6 space-y-2 bg-white text-black rounded-lg"
    >
      {video.caption && (
        <p className="font-bold text-blue-500">{`#${video?.caption}`}</p>
      )}
      <div className="flex justify-between">
        <div>
          <span className="font-semibold text-blue-500">{`@${video?.user?.name}`}</span>
          <span className="text-sm ml-2 text-gray-500">
            {formatPostDate(video.createdAt)}
          </span>
        </div>
        {video?.user?._id === currentUserId && (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (video?._id) {
                deletevideoMutation.mutate(video?._id);
              }
            }}
            disabled={deletevideoMutation.isPending}
          >
            <FaTrash className="text-red-500 " />
          </button>
        )}
      </div>

      {/* Video */}
      <div className="relative">
        <video
          ref={videoRef}
          src={video.video}
          loop
          muted={isMuted}
          className="w-full h-[600px] p-3 object-cover rounded-lg cursor-pointer"
          onClick={toggleMute}
        />

        {/* Sidebar Icons */}
        <div className="absolute right-4 top-40 flex flex-col items-center space-y-4">
          <Link
            to={`/profile/${video?.user?.studentId}`}
            className="flex items-center space-x-2"
          >
            <img
              src={
                video?.user?.photo === "noProfile.jpg"
                  ? "/noProfile.jpg"
                  : video?.user?.photo
              }
              alt={video?.user?.name}
              className="w-10 h-10 rounded-full"
            />
          </Link>

          <button
            onClick={() => likeReelMutation.mutate(video._id)}
            disabled={likeReelMutation.isLoading}
          >
            <HiHeart
              className={`cursor-pointer text-4xl ${
                video?.likes?.includes(currentUserId)
                  ? "text-red-500"
                  : "text-white"
              }`}
            />
            <span className="text-sm">{video?.likes?.length}</span>
          </button>

          <button
            onClick={toggleCommentModal}
            className="flex flex-col items-center"
          >
            <MessageCircle className="w-7 h-7 text-white" />
            <span className="text-sm">{video?.comments?.length}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleSliderChange}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-sm text-blue-300">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Play/Pause */}
      <div className="flex justify-center">
        <button onClick={togglePlayPause} className="text-blue-500 text-4xl">
          {isPaused ? <FaPlayCircle /> : <FaPauseCircle />}
        </button>
      </div>

      {/* Comment Modal */}
      {isCommentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-60 bg-opacity-0">
          <div className="bg-white rounded-lg w-full max-w-[300px] p-2 relative h-[60vh] overflow-y-auto">
            <button
              onClick={toggleCommentModal}
              className="absolute top-2 right-2 text-gray-500 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">Comments</h2>

            <div className="space-y-3">
              {video.comments?.length > 0 ? (
                video.comments.map((comment) => (
                  <div key={comment._id} className="border-b pb-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={comment?.user?.photo}
                        className="w-8 h-8 rounded-full"
                        alt=""
                      />
                      <p className="font-semibold">@{comment?.user?.name}</p>
                    </div>
                    {editCommentId === comment._id ? (
                      <form
                        onSubmit={handleUpdateComment}
                        className="flex gap-2 mt-1"
                      >
                        <input
                          type="text"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="flex-1 border px-3 py-1 rounded"
                        />
                        <button type="submit" className="text-blue-500">
                          Save
                        </button>
                        <button
                          onClick={() => setEditCommentId(null)}
                          className="text-gray-500"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <p className="ml-10">{comment.text}</p>
                    )}

                    {comment?.user?._id === currentUserId &&
                      editCommentId !== comment._id && (
                        <div className="flex gap-3 text-sm ml-10 mt-1">
                          <button
                            className="text-blue-600 flex items-center gap-1"
                            onClick={() => {
                              setEditCommentId(comment._id);
                              setEditCommentText(comment.text);
                            }}
                          >
                            <Pencil size={16} /> Edit
                          </button>
                          <button
                            className="text-red-500 flex items-center gap-1"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No comments yet.</p>
              )}
            </div>

            {/* Add Comment Input */}
            <div className="mt-4">
              <form onSubmit={handleAddComment}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full border rounded-full px-4 py-2 focus:outline-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
