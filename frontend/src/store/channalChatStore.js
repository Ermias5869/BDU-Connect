import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const channalStore = create((set, get) => ({
  channalMessages: [],

  selectedChannal: null,
  isChnnalLoading: false,
  isMessageing: false,
  getChannalMessage: async (channalId) => {
    try {
      set({ isMessageing: true });
      const req = await axiosInstance.get(
        `/channelmessage/getmessage/${channalId}`
      );
      set({ channalMessages: req.data });
    } catch (error) {
      toast.success("this is error");
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageing: false });
    }
  },
  sendChannalMessage: async (messageData) => {
    const { selectedChannal, channalMessages } = get();
    try {
      const res = await axiosInstance.post(
        `/channelmessage/send/${selectedChannal?._id}`,
        messageData
      );
      set({ channalMessages: [...channalMessages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  updateChannalPhoto: (photo) =>
    set((state) => ({
      selectedChannal: { ...state.selectedChannal, photo },
    })),

  selectChannal: (selectedChannal) => set({ selectedChannal }),
}));
