import { Link, useNavigate } from "react-router-dom";

import { CiLogout } from "react-icons/ci";
import MemberList from "./MemberList";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthStore } from "../store/userAuthStore";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { IoMdSettings } from "react-icons/io";
import { groupStore } from "../store/groupChatStore";
export default function GroupDescription({ setIsSetting }) {
  const { selectedGroup, selectGroup } = groupStore();
  const { authUser } = AuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: group, isLoading } = useQuery({
    queryKey: ["group", selectedGroup?._id],
    enabled: !!selectedGroup?._id,
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/group/getgroup/${selectedGroup._id}`
      );
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Failed to fetch group data");
      }
      return data;
    },
  });

  const leaveGroup = useMutation({
    mutationFn: async (groupId) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/group/leave/${groupId}`,
        {
          method: "PUT",
        }
      );
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.message || "Failed to leave channel");
      }
      return data;
    },
    onSuccess: (updatedgroup) => {
      groupStore.setState({ selectedGroup: updatedgroup });
      queryClient.invalidateQueries(["group", updatedgroup._id]);
      toast.success("Left the group successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to leave the group");
    },
  });

  const deleteGroup = useMutation({
    mutationFn: async (groupId) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/group/delete/${groupId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Failed to delete group");
      }
      return data;
    },
    onSuccess: () => {
      groupStore.setState({ selectedGroup: null });
      queryClient.invalidateQueries(["group"]);
      toast.success("Group deleted successfully!");
      navigate("/group/my");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete the channel");
    },
  });

  return (
    <div className="bg-white text-black h-screen w-full max-w-sm rounded-xl shadow-xl p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <img
          src={
            selectedGroup.photo === "bduLogo.jpg"
              ? "/bduLogo.jpg"
              : selectedGroup.photo
          }
          alt="Channel Logo"
          className="w-16 h-16 rounded-full border-2 border-blue-500"
        />
        <div>
          <h2 className="text-lg text-gray-700">{selectedGroup.name}</h2>
          <p className="text-sm text-gray-400">
            {selectedGroup.members?.length} subscribers
          </p>
        </div>
      </div>

      {/* Channel Info */}
      <div className="bg-blue-300 p-4 rounded-lg space-y-4 max-h-40 overflow-y-auto ">
        {selectedGroup.link && (
          <p className="text-white break-all text-sm">
            <Link
              to={selectedGroup.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Link: {selectedGroup.link}
            </Link>
          </p>
        )}

        {selectedGroup.description && (
          <pre className="whitespace-pre-wrap text-black text-xs font-mono">
            Description: {selectedGroup.description}
          </pre>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-4 justify-center items-center pt-2">
          <button
            className="flex items-center text-black hover:text-gray-900 space-x-1"
            onClick={(e) => {
              e.preventDefault();
              leaveGroup.mutate(selectedGroup._id);
            }}
          >
            <CiLogout size={18} />
            <span className="text-sm font-medium">
              {leaveGroup.isLoading ? "Leaving..." : "Leave"}
            </span>
          </button>
          {selectedGroup.creator === authUser._id && (
            <button
              className="flex items-center text-green-600 hover:text-green-700 space-x-1"
              onClick={() => setIsSetting((pre) => !pre)}
            >
              <IoMdSettings size={18} />
              <span className="text-sm font-medium">Setting</span>
            </button>
          )}

          <button className="flex items-center text-red-400 hover:text-red-500 space-x-1">
            <MdOutlineReportGmailerrorred size={18} />
            <span className="text-sm font-medium">Report</span>
          </button>

          {/* Only show Delete if user is creator */}
          {selectedGroup.creator === authUser._id && (
            <button
              className="flex items-center text-red-400 hover:text-red-500 space-x-1"
              onClick={(e) => {
                e.preventDefault();
                const confirmDelete = window.confirm(
                  "Are you sure you want to delete this channel?"
                );
                selectGroup(null);
                if (confirmDelete) {
                  deleteGroup.mutate(selectedGroup._id);
                }
              }}
            >
              <FaTrashAlt size={18} />
              <span className="text-sm font-medium">
                {deleteGroup.isLoading ? "Deleting..." : "Delete"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Members */}
      <MemberList channal={group} isLoading={isLoading} />
    </div>
  );
}
