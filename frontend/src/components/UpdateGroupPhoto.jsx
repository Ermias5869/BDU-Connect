import { Camera } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { groupStore } from "../store/groupChatStore";

export default function UpdateGroupPhoto() {
  const { selectedGroup, updateGroupPhoto } = groupStore();
  const [preview, setPreview] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, file }) => {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/group/uploadphoto/${id}`,
        {
          credentials: "include",
          method: "PATCH",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to update channel photo");
      return data;
    },
    onSuccess: (data) => {
      toast.success("Channel photo updated successfully!");
      updateGroupPhoto(data.photo);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleProfile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview (optional)
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    // Trigger mutation
    mutate({ id: selectedGroup._id, file });
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-xl flex flex-col items-center font-medium text-stone-400">
        <div className="relative mt-5">
          <label htmlFor="fileInput" className="cursor-pointer">
            <img
              src={
                preview
                  ? preview
                  : selectedGroup.photo === "bduLogo.jpg"
                  ? "/bduLogo.jpg"
                  : selectedGroup.photo
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-3 border-blue-300"
            />
            <div className="absolute bottom-1 right-1 bg-gray-800 p-1 rounded-full">
              <Camera className="w-5 h-5 text-gray-300" />
            </div>
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfile}
            disabled={isPending}
          />
        </div>
        <p className="font-light text-gray-600">
          {isPending ? "Uploading..." : "Update Group Image"}
        </p>
      </div>
    </div>
  );
}
