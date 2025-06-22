import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

export default function UpdatePassword() {
  const [formData, setFormData] = useState({
    studentId: "",
    password: "",
    newpassword: "",
    newpasswordConfirm: "",
  });

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({
      studentId,
      password,
      newpassword,
      newpasswordConfirm,
    }) => {
      const res = await fetch("/api/auth/updatepassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          password,
          newpassword,
          newpasswordConfirm,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");
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
      studentId: "",
      password: "",
      newpassword: "",
      newpasswordConfirm: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-blue-500 text-center mb-8">
          Password Update
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="newpassword"
              value={formData.newpassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="newpasswordConfirm"
              value={formData.newpasswordConfirm}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm new password"
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-gray-700 mb-1">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your student ID"
            />
          </div>

          {/* Old Password */}
          <div>
            <label className="block text-gray-700 mb-1">Old Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter current password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition duration-200"
          >
            {isPending ? "Updating..." : "Update Password"}
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
