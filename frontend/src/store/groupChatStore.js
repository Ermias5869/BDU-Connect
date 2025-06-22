import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const groupStore = create((set, get) => ({
  groupMessages: [],

  selectedGroup: null,
  isGroupLoading: false,
  isMessageing: false,

  getGroupMessage: async (groupId) => {
    try {
      set({ isMessageing: true });
      const req = await axiosInstance.get(
        `/groupmessage/getmessage/${groupId}`
      );
      set({ groupMessages: req.data });
    } catch (error) {
      toast.error("this is error");
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageing: false });
    }
  },
  sendGroupMessage: async (messageData) => {
    const { selectedGroup, groupMessages } = get();
    try {
      const res = await axiosInstance.post(
        `/groupmessage/send/${selectedGroup?._id}`,
        messageData
      );
      set({ groupMessages: [...groupMessages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  updateGroupPhoto: (photo) =>
    set((state) => ({
      selectedGroup: { ...state.selectedGroup, photo },
    })),

  selectGroup: (selectedGroup) => set({ selectedGroup }),
}));
