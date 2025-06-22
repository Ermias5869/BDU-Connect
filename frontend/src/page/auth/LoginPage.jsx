import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthStore } from "../../store/userAuthStore";

export default function SignUpPage() {
  const { Log } = AuthStore();
  const [formData, setFormData] = useState({
    studentId: "",
    password: "",
  });
  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ studentId, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("login is success");
    },
    onError: () => {
      console.log("error");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
    Log(formData);

    setFormData({
      studentId: "",
      password: "",
    });
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
            SignIn
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5   p-6">
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
            <button
              type="submit"
              className="w-full border-2 p-2 text-white bg-blue-500 rounded-full mt-4"
            >
              {isPending ? "Loading..." : "Login"}
            </button>
            {isError && <p className="text-red-500">{error.message}</p>}
            <div className="flex gap-1.5">
              <p>You Have not Account</p>
              <Link
                to="/signup"
                className="text-center text-blue-500 underline"
              >
                SignUp{" "}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
