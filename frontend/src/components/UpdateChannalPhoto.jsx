import { Camera } from "lucide-react";
import { channalStore } from "../store/channalChatStore";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function UpdateChannalPhoto() {
  const { selectedChannal, updateChannalPhoto } = channalStore();
  const [preview, setPreview] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, file }) => {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch(`/api/channal/uploadphoto/${id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to update channel photo");
      return data;
    },
    onSuccess: (data) => {
      toast.success("Channel photo updated successfully!");
      updateChannalPhoto(data.photo);
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
    mutate({ id: selectedChannal._id, file });
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
                  : selectedChannal.photo === "bduLogo.jpg"
                  ? "/bduLogo.jpg"
                  : selectedChannal.photo
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
          {isPending ? "Uploading..." : "Update Channel Image"}
        </p>
      </div>
    </div>
  );
}
