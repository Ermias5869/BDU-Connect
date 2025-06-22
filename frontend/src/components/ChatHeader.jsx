import { X } from "lucide-react";
import { AuthStore } from "../store/userAuthStore";
import { chatStore } from "../store/userChatStore";
import { Link } from "react-router-dom";

const ChatHeader = () => {
  const { selectedUser, selectUser } = chatStore();
  const { onlineUsers } = AuthStore();

  return (
    <div className="p-2.5 bg-blue-400 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <Link
              to={`/profile/${selectedUser.studentId}`}
              className="size-10 rounded-full relative"
            >
              <img
                src={selectedUser?.photo || "/noProfile.jpg"}
                alt={selectedUser?.name}
              />
            </Link>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-white">{selectedUser?.name}</h3>
            <p className="text-sm text-white ">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => selectUser(null)}>
          <X className="text-white" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
