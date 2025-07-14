import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { channalStore } from "../store/channalChatStore";

export default function UpdateChannalInfo() {
  const { selectedChannal } = channalStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
  });

  // Initialize form with selectedChannal data
  useEffect(() => {
    if (selectedChannal) {
      setFormData({
        name: selectedChannal.name || "",
        description: selectedChannal.description || "",
        link: selectedChannal.link || "",
      });
    }
  }, [selectedChannal]);

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ id, name, description, link }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/channal/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, description, link }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to update channel info");
      return data;
    },
    onSuccess: () => {
      toast.success("Channel info updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["channal"] }); // 🔁 refetch
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ id: selectedChannal._id, ...formData });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-2">
        <h2 className="text-xl font-bold text-blue-400 text-center mb-2">
          Update Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Name */}
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Channal new name"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-gray-700">Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter channel link"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Brief description about the channel"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-full transition duration-200"
          >
            {isPending ? "Updating..." : "Update Information"}
          </button>

          {/* Error Message */}
          {isError && (
            <p className="text-red-500 text-sm mt-2">{error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
