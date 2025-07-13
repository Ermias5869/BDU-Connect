import React, { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HiHeart,
  HiMiniChatBubbleOvalLeftEllipsis,
  HiMiniTrash,
} from "react-icons/hi2";
import { formatPostDate } from "../utility/index";
import { Link, useParams } from "react-router-dom";
import useUser from "../hook/useUser";

export default function UserPost() {
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const inputRefs = useRef({});
  const { studId } = useParams();
  const { user } = useUser(studId);
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const currentUserId = authUser?._id;

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(`/api/post/user/${user._id}`);
      const data = await res.json();
      if (!res.ok || !Array.isArray(data))
        throw new Error("Failed to fetch posts");
      return data;
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await fetch(`/api/post/like/${postId}`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to like/unlike post");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
  });

  const commentMutation = useMutation({
    mutationFn: async ({ postId, text }) => {
      const res = await fetch(`/api/post/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ postId, commentId }) => {
      const res = await fetch(
        `/api/post/deletecomment/${postId}/${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete comment");
      return res.json();
    },
    onMutate: ({ postId, commentId }) => {
      queryClient.setQueryData(["posts"], (oldPosts) => {
        return oldPosts.map((post) => {
          if (post._id === postId) {
            post.comments = post.comments.filter(
              (comment) => comment._id !== commentId
            );
          }
          return post;
        });
      });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ postId, commentId, text }) => {
      const res = await fetch(
        `/api/post/updatecomment/${postId}/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );
      if (!res.ok) throw new Error("Failed to update comment");
      return res.json();
    },
    onMutate: ({ postId, commentId, text }) => {
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldPosts) => {
        return oldPosts.map((post) => {
          if (post._id === postId) {
            post.comments = post.comments.map((comment) => {
              if (comment._id === commentId) {
                comment.text = text;
              }
              return comment;
            });
          }
          return post;
        });
      });

      return { previousPosts };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // New mutation for deleting post
  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      const res = await fetch(`/api/post/delete/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete post");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Failed to load posts</div>;

  return (
    <div className="h-full p-4 bg-gray-100">
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No posts yet.</div>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="flex justify-center mt-6">
            <div className="w-full max-w-md bg-white text-black rounded-lg shadow-md overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-2">
                  {post.user.photo === "noProfile.jpg" ? (
                    <img
                      src="/noProfile.jpg"
                      alt={post.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <img
                      src={post.user.photo}
                      alt={post.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="font-semibold">{post.user.name}</span>
                  <span className="text-sm text-gray-500">
                    {formatPostDate(post.createdAt)}
                  </span>
                </div>
                {post.user._id === currentUserId && (
                  <div className="text-xl">
                    <HiMiniTrash
                      className="text-red-500 cursor-pointer"
                      onClick={() => deletePostMutation.mutate(post._id)}
                    />
                  </div>
                )}
              </div>

              {/* Post Content */}
              {post.image?.length > 0 ? (
                <img src={post.image} alt="post" className="w-full" />
              ) : (
                <div className="px-4 text-sm mb-2">
                  <span className="font-semibold text-blue-500">
                    {post.user.name}
                  </span>{" "}
                  A{post.text}
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex space-x-4 text-2xl items-center">
                  <button
                    onClick={() => likePostMutation.mutate(post._id)}
                    disabled={likePostMutation.isLoading}
                  >
                    <HiHeart
                      className={`cursor-pointer transition-colors duration-200 ${
                        post.likes.includes(currentUserId)
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    />
                  </button>
                  <HiMiniChatBubbleOvalLeftEllipsis
                    className="text-gray-500 cursor-pointer"
                    onClick={() => {
                      setShowCommentsFor(
                        showCommentsFor === post._id ? null : post._id
                      );
                      setTimeout(() => {
                        inputRefs.current[post._id]?.focus();
                      }, 100);
                    }}
                  />
                </div>
              </div>

              {/* Likes */}
              <div className="px-4 text-sm font-semibold mb-1">
                {`${post.likes.length} likes`}
              </div>
              {post.image?.length > 0 && (
                <div className="px-4 text-sm mb-2">
                  <span className="font-semibold text-blue-500">
                    {post.user.name}
                  </span>{" "}
                  A{post.text}
                </div>
              )}

              {/* View All Comments Button */}
              <div className="px-4 text-sm text-gray-400 mb-2">
                {post.comments.length === 0 ? (
                  "Add first comment"
                ) : (
                  <>
                    View all {post.comments.length} comments
                    <button
                      className="ml-2 text-blue-500 underline"
                      onClick={() =>
                        setShowCommentsFor(
                          showCommentsFor === post._id ? null : post._id
                        )
                      }
                    >
                      {showCommentsFor === post._id ? "Hide" : "Show all"}
                    </button>
                  </>
                )}
              </div>

              {/* Comments Section */}
              {showCommentsFor === post._id && (
                <div className="px-4 mb-2 space-y-1">
                  {post.comments.map((comment, i) => (
                    <div key={i} className="flex items-start space-x-2 text-sm">
                      <Link to={`/profile/${comment.user.studentId}`}>
                        <img
                          src={comment.user?.photo}
                          alt="commenter"
                          className="w-6 h-6 rounded-full"
                        />
                      </Link>
                      <div>
                        <span className="font-semibold text-blue-600">
                          {comment.user?.name}
                        </span>{" "}
                        {comment.text}
                        {comment.user._id === currentUserId && (
                          <div className="flex space-x-2 mt-2">
                            <button
                              className="text-blue-500"
                              onClick={() => {
                                const updatedText = prompt(
                                  "Edit your comment",
                                  comment.text
                                );
                                if (updatedText) {
                                  updateCommentMutation.mutate({
                                    postId: post._id,
                                    commentId: comment._id,
                                    text: updatedText,
                                  });
                                }
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-500"
                              onClick={() =>
                                deleteCommentMutation.mutate({
                                  postId: post._id,
                                  commentId: comment._id,
                                })
                              }
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="border-t border-gray-200 px-4 py-2 flex items-center text-sm">
                <input
                  ref={(el) => (inputRefs.current[post._id] = el)}
                  type="text"
                  placeholder="Add a comment..."
                  className="bg-white text-black w-full focus:outline-none"
                  value={commentTexts[post._id] || ""}
                  onChange={(e) =>
                    setCommentTexts((prev) => ({
                      ...prev,
                      [post._id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && commentTexts[post._id]?.trim()) {
                      commentMutation.mutate({
                        postId: post._id,
                        text: commentTexts[post._id],
                      });
                      setCommentTexts((prev) => ({
                        ...prev,
                        [post._id]: "",
                      }));
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (commentTexts[post._id]?.trim()) {
                      commentMutation.mutate({
                        postId: post._id,
                        text: commentTexts[post._id],
                      });
                      setCommentTexts((prev) => ({
                        ...prev,
                        [post._id]: "",
                      }));
                    }
                  }}
                  className="ml-2 text-blue-500"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
