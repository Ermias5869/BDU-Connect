import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateGroup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
  });

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ name, description, link }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/group/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, link }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to update channel info");
      return data;
    },
    onSuccess: () => {
      toast.success("Group Create successfully!");
      queryClient.invalidateQueries({ queryKey: ["group"] });
      setFormData({ name: "", description: "", link: "" });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ ...formData });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center  w-full">
      <div className="w-full max-w-md bg-white p-10 rounded-4xl">
        <div className="block md:hidden ">
          <button onClick={() => navigate(-1)}>
            <IoIosArrowRoundBack size={30} className="text-blue-500" />
          </button>
        </div>
        <h2 className="text-xl font-bold text-blue-400 text-center mb-2">
          Create Group
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700">Channal Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Group name"
              required
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
              className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. bdu/me/my-group"
              required
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
              placeholder="Brief description about the group"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition duration-200"
          >
            {isPending ? "Creating..." : "Create Group"}
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
