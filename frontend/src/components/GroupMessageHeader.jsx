import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { groupStore } from "../store/groupChatStore";

const GroupMessageHeader = () => {
  const { selectedGroup, selectGroup } = groupStore();

  return (
    <div className="p-1  bg-blue-400 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <Link
              to={`/profile/${selectedGroup._id}`}
              className="size-10 rounded-full relative"
            >
              {selectedGroup.photo === "bduLogo.jpg" ? (
                <img
                  src="/bduLogo.jpg"
                  alt="Channel Logo"
                  className="w-16 h-16 rounded-full border-2 border-blue-400"
                />
              ) : (
                <img
                  src={selectedGroup.photo}
                  alt="Channel Logo"
                  className="w-16 h-16 rounded-full border-2 border-blue-400"
                />
              )}
            </Link>
          </div>

          <div>
            <h2 className="text-lg  text-white">{selectedGroup.name}</h2>
            <p className="text-sm text-white">
              {selectedGroup.members.length} Member
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => selectGroup(null)}>
          <X className="text-white" />
        </button>
      </div>
    </div>
  );
};
export default GroupMessageHeader;
