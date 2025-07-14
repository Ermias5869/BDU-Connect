import { useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const imgRef = useRef(null);

  // Fetch the authenticated user
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  // Mutation for creating a post
  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, image }) => {
      try {
        const formData = new FormData();
        formData.append("text", text);
        if (image) {
          formData.append("image", image); // Append image file to FormData
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/post/create`, {
          credentials: "include",
          method: "POST",
          body: formData, // Send FormData to the server
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setText("");
      setImage(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, image });
  };

  // Handle image change (file input)
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Directly store the file
    }
  };

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
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {image && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-blue-500 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImage(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={URL.createObjectURL(image)} // Display image using Object URL
              className="w-full mx-auto h-72 object-contain rounded"
              alt="selected-post-img"
            />
          </div>
        )}

        <div className="flex justify-between border py-2 border-blue-500 rounded-2xl p-2.5">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 text-blue-500 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary text-blue-500 w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button
            className="btn btn-primary rounded-full btn-sm text-white bg-blue-500 border-blue-500 px-4"
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
          {isError && <p>{error.message}</p>}
        </div>
      </form>
    </div>
  );
}
