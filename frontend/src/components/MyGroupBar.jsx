import SidebarSkeleton from "./SidebarSkeleton";

import { useQuery } from "@tanstack/react-query";
import { groupStore } from "../store/groupChatStore";
import { Link, useNavigate } from "react-router-dom";
import { IoReorderThree } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function MyGroupBar() {
  const navigate = useNavigate();
  const { data: group, isGroupLoading } = useQuery({
    queryKey: ["group"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/group/mygroup");
        const data = await res.json();
        if (!res.ok || data?.error) return null;

        if (!res.ok) {
          throw new Error("someting is wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  const { selectedGroup, selectGroup } = groupStore();

  if (isGroupLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-screen w-full md:w-60  bg-white text-black  border-r border-gray-200 flex flex-col transition-all duration-200 overflow-scroll">
      <div className="md:hidden">
        <div className="dropdown ">
          <div tabIndex={0} role="button" className="ml-2">
            <IoReorderThree className="w-3" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2  bg-blue-400 shadow text-white rounded-box w-52"
          >
            <li>
              <button onClick={() => navigate("/")}>
                <IoIosArrowRoundBack size={30} className="text-white" />
              </button>
              <Link to="/group/all">all</Link>
              <Link to="/group/my">my</Link>
              <Link to="/group/joined">joined</Link>

              <Link to="/channal/create">create</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-b border-gray-200 w-full p-5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl text-blue-400"> Join Group</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {group?.map((group) => (
          <button
            key={group._id}
            onClick={() => selectGroup(group)}
            className={`
              w-full p-3 flex items-center gap-1 
              hover:bg-base-300 transition-colors
              ${
                selectedGroup?._id === group._id
                  ? "bg-blue-300  text-white"
                  : ""
              }
            `}
          >
            <div className="relative mx-1.5">
              {group.photo === "bduLogo.jpg" ? (
                <img
                  src="/bduLogo.jpg"
                  alt={group.name}
                  className="size-10 object-cover rounded-full"
                />
              ) : (
                <img
                  src={group.photo}
                  alt={group.name}
                  className="size-10 object-cover rounded-full"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className=" block text-left min-w-0">
              <div className="font-light truncate text-xs">{group.name}</div>
              <div className="font-light truncate text-xs text-gray-600">
                {group.lastMessage?.text
                  ? `${group.lastMessage.text.slice(0, 17)}...`
                  : group.lastMessage?.photo?.length
                  ? "📷 Photo"
                  : group.lastMessage?.video?.length
                  ? "🎥 Video"
                  : group.lastMessage?.file?.length
                  ? "📄 File"
                  : "No messages yet"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
