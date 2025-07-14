import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthStore } from "../store/userAuthStore";

export default function UpdateMe() {
  const { authUser } = AuthStore();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    link: "",
  });
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        bio: authUser.bio || "",
        link: authUser.link || "",
      });
    }
  }, [authUser]);

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ name, bio, link }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user//updateme`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            bio,
            link,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      return data;
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
    setFormData({
      name: "",
      bio: "",
      link: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-blue-500 text-center mb-8">
          Update Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Name */}
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new name"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-gray-700 mb-1">Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="link"
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-gray-700 mb-1">Bio</label>
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your Bio"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition duration-200"
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
