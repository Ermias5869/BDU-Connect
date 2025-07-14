import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthStore } from "../../store/userAuthStore";

export default function SignUpPage() {
  const { signUp } = AuthStore();
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({
      name,
      studentId,
      password,
      passwordConfirm,
      email,
    }) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            studentId,
            password,
            passwordConfirm,
            email,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");

        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      setFormData({
        name: "",
        studentId: "",
        password: "",
        passwordConfirm: "",
        email: "",
      });

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    mutate(formData);
    signUp(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex flex-col md:flex-row bg-white  p-8 gap-10 w-full max-w-4xl">
        {/* Left: Logo */}
        <div className="flex flex-col items-center justify-center md:w-1/2">
          <img src="bdu.png" alt="BDU logo" className="w-68 h-68" />
          <h1 className="text-3xl text-blue-500 font-bold mt-4 text-center">
            BDU Connect
          </h1>
        </div>

        {/* Right: Sign Up Form */}
        <div className="md:w-1/2 border-3 border-gray-300 rounded-xl">
          <h2 className="text-2xl text-blue-500 font-bold text-center mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5   p-6">
            <label className="input input-bordered flex items-center gap-1">
              <span className="text-gray-500 w-24">Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="grow border-gray-300 border-2"
                placeholder=" Enter your name"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="text-gray-500 w-24">StudentId</span>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                className="grow border-gray-300 border-2"
                placeholder=" Enter your studentId"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="text-gray-500 w-24">Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="grow border-gray-300 border-2"
                placeholder=" Enter your password"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="text-gray-500 w-24"> PassConfirm</span>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleInputChange}
                className="grow border-gray-300 border-2"
                placeholder="Enter your passwordConfirm"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="text-gray-500 w-24">email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="grow border-gray-300 border-2"
                placeholder="Enter your email"
              />
            </label>

            <button
              type="submit"
              className="w-full border-2 p-2 text-white bg-blue-500 rounded-full mt-4"
            >
              {isPending ? "Loading..." : "Sign up"}
            </button>
            {isError && <p className="text-red-500">{error.message}</p>}

            <div className="flex gap-1.5">
              <p>You Have Account</p>
              <Link
                to="to=/login"
                className="text-center text-blue-500 underline"
              >
                SignIn{" "}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
