import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

import { io } from "socket.io-client";
import { toast } from "react-toastify";

export const AuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoging: false,
  isUpdateingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data) => {
    try {
      set({ isSigningUp: true });
      const req = await axiosInstance.post("/auth/signup", data);
      set({ authUser: req.data });
      toast.success("accout create successfull");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  Logout: async () => {
    try {
      const req = await axiosInstance.post("/auth/logout");
      console.log(req);
      set({ authUser: null });
      toast.success("Logout successfull");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  Log: async (data) => {
    try {
      set({ isLoging: true });
      console.log(data);
      const res = await axiosInstance.post("/auth/login", data);
      toast.success("LogIn successfull");
      set({
        authUser: res.data,
      });
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoging: false });
    }
  },
  uploadPhoto: async (file) => {
    try {
      set({ isUpdateingProfile: true });
      const formData = new FormData();
      formData.append("photo", file);
      const req = await axiosInstance.post("/auth/uploadprofile", formData);
      set({ authUser: req.data });
      toast.success("upload image is successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdateingProfile: false });
    }
  },

  connectSocket: () => {
    if (!get().authUser || get().socket) return;
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      query: {
        userId: get().authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUser", (userId) => {
      set({ onlineUsers: userId });
    });
  },
  disconnectSocket: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },
}));
