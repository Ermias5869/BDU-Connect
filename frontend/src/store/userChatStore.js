import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { AuthStore } from "./userAuthStore";

export const chatStore = create((set, get) => ({
  messages: [],
  user: [],
  selectedUser: null,
  isUserLoging: false,
  isMessageing: false,

  getUsers: async () => {
    try {
      set({ isUserLoging: true });
      const req = await axiosInstance.get("/message/user");
      set({ user: req.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoging: false });
    }
  },
  getMessage: async (id) => {
    try {
      set({ isMessageing: true });
      const req = await axiosInstance.get(`/message/getmessage/${id}`);
      set({ messages: req.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageing: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();

    const socket = AuthStore.getState().socket;
    if (!selectedUser) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = AuthStore.getState().socket;

    socket.off("newMessage");
  },
  selectUser: (selectedUser) => set({ selectedUser }),
}));
