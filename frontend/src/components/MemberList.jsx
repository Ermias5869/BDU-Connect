import { FaUserFriends, FaSearch, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthStore } from "../store/userAuthStore";

export default function MemberList({ channal, isLoading }) {
  const { onlineUsers } = AuthStore();

  if (isLoading) return <div>loading....</div>;
  console.log(channal);
  return (
    <div className="bg-white text-gray-500 w-full max-w-sm rounded-xl flex flex-col h-60">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-gray-700 shrink-0">
        <div className="flex items-center space-x-2 text-sm font-light">
          <FaUserFriends className="text-blue-500" />
          <span>{`${channal.members.length} MEMBERS`}</span>
        </div>
        <div className="flex space-x-3 text-gray-300">
          <FaSearch className="cursor-pointer text-blue-500" />
          <FaUserPlus className="cursor-pointer text-blue-500" />
        </div>
      </div>

      {/* Scrollable List */}
      <ul className="flex-1 overflow-y-auto">
        {channal.members.map((member) => (
          <Link
            to={`/profile/${member.studentId}`}
            key={member._id}
            className="flex items-center px-2 py-3 hover:bg-blue-300 hover:text-white w-full"
          >
            <div className="relative mx-1.5">
              <img
                src={
                  member.photo === "noProfile.jpg"
                    ? "/noProfile.jpg"
                    : member.photo
                }
                alt={member.name}
                className="size-10 object-cover rounded-full"
              />
              {onlineUsers.includes(member._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>
            <div className="block text-left min-w-0">
              <div className="flex justify-between items-center">
                <div className="font-light truncate text-xs text-black">
                  {member.name}
                </div>
                {channal.creator._id === member._id && (
                  <div className="ml-15 text-xs">admin</div>
                )}
              </div>
              <div className="text-xs text-zinc-400">
                {onlineUsers.includes(member._id) ? "Online" : "Offline"}
              </div>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
}
