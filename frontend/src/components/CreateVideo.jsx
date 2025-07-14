import { useEffect, useRef, useState } from "react";
import { CiVideoOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function CreateVideo() {
  const [caption, setCaption] = useState("");
  const [video, setVideo] = useState(null);
  const videoElementRef = useRef(null);
  const inputRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createVideo,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ caption, video }) => {
      try {
        const formData = new FormData();
        formData.append("caption", caption);
        if (video) {
          formData.append("video", video);
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/reel/create`, {
          credentials: "include",
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      setCaption("");
      setVideo(null);
      toast.success("Video uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!video) {
      toast.error("Please select a video to upload.");
      return;
    }
    createVideo({ caption, video });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
    }
  };

  useEffect(() => {
    if (video && videoElementRef.current) {
      const videoEl = videoElementRef.current;
      videoEl.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Video play failed:", err.message);
        }
      });
    }
  }, [video]);

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          {authUser?.photo === "noProfile.jpg" ? (
            <img src="/noProfile.jpg" alt="user-avatar" />
          ) : (
            <img src={authUser?.photo} alt="user-avatar" />
          )}
        </div>
      </div>

      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full text-lg resize-none focus:outline-none border-1 border-blue-500 p-4 rounded-2xl"
          placeholder="Say something about your video..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {video && (
          <div className="relative w-full max-w-sm mx-auto">
            <IoCloseSharp
              className="absolute top-1 right-1 text-white bg-blue-500 rounded-full w-5 h-5 cursor-pointer z-10"
              onClick={() => {
                setVideo(null);
                inputRef.current.value = null;
              }}
            />
            <video
              ref={videoElementRef}
              src={URL.createObjectURL(video)}
              className="w-full h-72 object-contain rounded"
              controls
            />
          </div>
        )}

        <div className="flex justify-between items-center border py-2 border-blue-500 rounded-2xl p-2.5">
          <div className="flex gap-2 items-center">
            <CiVideoOn
              className="fill-primary w-6 h-6 text-blue-500 cursor-pointer"
              onClick={() => inputRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary text-blue-500 w-5 h-5 cursor-pointer" />
          </div>

          <input
            type="file"
            accept="video/*"
            hidden
            ref={inputRef}
            onChange={handleVideoChange}
          />

          <button
            type="submit"
            className="btn btn-primary rounded-full btn-sm text-white bg-blue-500 border-blue-500 px-4"
            disabled={isPending}
          >
            {isPending ? "Uploading..." : "Upload"}
          </button>
        </div>

        {isError && (
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        )}
      </form>
    </div>
  );
}
