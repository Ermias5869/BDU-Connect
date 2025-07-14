import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import VideoCard from "../components/VideoCard";

export default function ShortVideo() {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const currentUserId = authUser?._id;
  const {
    data: videos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reel/getallvideo`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok || !Array.isArray(data))
        throw new Error("Failed to fetch posts");
      return data;
    },
  });
  const likeReelMutation = useMutation({
    mutationFn: async (reelId) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reel/like/${reelId}`,
        { credentials: "include", method: "PUT" }
      );
      if (!res.ok) throw new Error("Failed to like/unlike video");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["videos"]),
  });
  const commentMutation = useMutation({
    mutationFn: async ({ videoId, text }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reel/comment/${videoId}`,
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );
      if (!res.ok) throw new Error("Failed to add comment");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["videos"]),
  });
  const deleteCommentMutation = useMutation({
    mutationFn: async ({ videoId, commentId }) => {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/reel/deletecomment/${videoId}/${commentId}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete comment");
      return res.json();
    },
    onMutate: ({ videoId, commentId }) => {
      // Optimistically remove the comment from the local state
      queryClient.setQueryData(["videos"], (oldReels) => {
        return oldReels.map((video) => {
          if (video._id === videoId) {
            video.comments = video.comments.filter(
              (comment) => comment._id !== commentId
            );
          }
          return video;
        });
      });
    },
    onError: (error, variables, context) => {
      // Rollback the optimistic update if error occurs
      queryClient.setQueryData(["videos"], context.previousPosts);
    },
    onSettled: () => {
      // Ensure the posts are refetched after mutation
      queryClient.invalidateQueries(["videos"]);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ videoId, commentId, text }) => {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/reel/updatecomment/${videoId}/${commentId}`,
        {
          credentials: "include",
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );
      if (!res.ok) throw new Error("Failed to update comment");
      return res.json();
    },
    onMutate: ({ videoId, commentId, text }) => {
      // Store the previous state for rollback on error
      const previousPosts = queryClient.getQueryData(["videos"]);

      // Optimistically update the comment text in the local state
      queryClient.setQueryData(["videos"], (oldPosts) => {
        return oldPosts.map((video) => {
          if (video._id === videoId) {
            video.comments = video.comments.map((comment) => {
              if (comment._id === commentId) {
                comment.text = text; // Optimistically update the text
              }
              return comment;
            });
          }
          return videoId;
        });
      });

      // Return the previous state to be used in case of error for rollback
      return { previousPosts };
    },
    onError: (error, variables, context) => {
      // Rollback the optimistic update if error occurs
      queryClient.setQueryData(["videos"], context.previousPosts);
    },
    onSettled: () => {
      // Ensure the posts are refetched after mutation
      queryClient.invalidateQueries(["videos"]);
    },
  });
  const deletevideoMutation = useMutation({
    mutationFn: async (videoId) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reel/delete/${videoId}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete post");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["videos"]);
    },
  });

  if (isLoading) return <div>loading...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Failed to load posts</div>;
  if (videos.length === 0) return <div> No Video</div>;
  return (
    <div className="space-y-6 bg-gray-200">
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          likeReelMutation={likeReelMutation}
          currentUserId={currentUserId}
          commentMutation={commentMutation}
          updateCommentMutation={updateCommentMutation}
          deleteCommentMutation={deleteCommentMutation}
          deletevideoMutation={deletevideoMutation}
        />
      ))}
    </div>
  );
}
