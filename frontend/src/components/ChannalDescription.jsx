import { Link, useNavigate } from "react-router-dom";
import { channalStore } from "../store/channalChatStore";
import { CiLogout } from "react-icons/ci";
import MemberList from "./MemberList";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthStore } from "../store/userAuthStore";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { IoMdSettings } from "react-icons/io";
export default function ChannalDescription({ setIsSetting }) {
  const { selectedChannal } = channalStore();
  const { authUser } = AuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: channal, isLoading } = useQuery({
    queryKey: ["channal", selectedChannal?._id],
    enabled: !!selectedChannal?._id,
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/channal/getchannel/${
          selectedChannal._id
        }`
      );
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Failed to fetch channel data");
      }
      return data;
    },
  });

  const leaveChannal = useMutation({
    mutationFn: async (channalId) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/channal/leave/${channalId}`,
        {
          method: "PUT",
        }
      );
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Failed to leave channel");
      }
      return data;
    },
    onSuccess: (updatedChannal) => {
      channalStore.setState({ selectedChannal: updatedChannal });
      queryClient.invalidateQueries(["channal", updatedChannal._id]);
      toast.success("Left the channel successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to leave the channel");
    },
  });

  const deleteChannal = useMutation({
    mutationFn: async (channalId) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/channal/delete/${channalId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Failed to delete channel");
      }
      return data;
    },
    onSuccess: () => {
      channalStore.setState({ selectedChannal: null });
      queryClient.invalidateQueries(["channal"]);
      toast.success("Channel deleted successfully!");
      navigate("/channal/my");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete the channel");
    },
  });

  return (
    <div className="bg-white  text-black w-full max-w-sm rounded-xl shadow-xl p-4 space-y-6 h-screen">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <img
          src={
            selectedChannal.photo === "bduLogo.jpg"
              ? "/bduLogo.jpg"
              : selectedChannal.photo
          }
          alt="Channel Logo"
          className="w-16 h-16 rounded-full border-2 border-blue-500"
        />
        <div>
          <h2 className="text-lg text-gray-700">{selectedChannal.name}</h2>
          <p className="text-sm text-gray-400">
            {selectedChannal.members?.length} subscribers
          </p>
        </div>
      </div>

      {/* Channel Info */}
      <div className="bg-blue-300 p-4 rounded-lg space-y-4 max-h-40 overflow-y-auto">
        {selectedChannal.link && (
          <p className="text-white break-all text-sm">
            <Link
              to={selectedChannal.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Link: {selectedChannal.link}
            </Link>
          </p>
        )}

        {selectedChannal.description && (
          <pre className="whitespace-pre-wrap text-black text-xs font-mono">
            Description: {selectedChannal.description}
          </pre>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-4 justify-center items-center pt-2">
          <button
            className="flex items-center text-black hover:text-gray-900 space-x-1"
            onClick={(e) => {
              e.preventDefault();
              leaveChannal.mutate(selectedChannal._id);
            }}
          >
            <CiLogout size={18} />
            <span className="text-sm font-medium">
              {leaveChannal.isLoading ? "Leaving..." : "Leave"}
            </span>
          </button>
          {selectedChannal.creator === authUser._id && (
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
          {selectedChannal.creator === authUser._id && (
            <button
              className="flex items-center text-red-400 hover:text-red-500 space-x-1"
              onClick={(e) => {
                e.preventDefault();
                const confirmDelete = window.confirm(
                  "Are you sure you want to delete this channel?"
                );
                if (confirmDelete) {
                  deleteChannal.mutate(selectedChannal._id);
                }
              }}
            >
              <FaTrashAlt size={18} />
              <span className="text-sm font-medium">
                {deleteChannal.isLoading ? "Deleting..." : "Delete"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Members */}
      <MemberList channal={channal} isLoading={isLoading} />
    </div>
  );
}
