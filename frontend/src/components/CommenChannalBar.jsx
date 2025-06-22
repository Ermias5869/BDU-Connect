import SidebarSkeleton from "./SidebarSkeleton";

import { channalStore } from "../store/channalChatStore";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { IoReorderThree } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function CommenChannalBar() {
  const navigate = useNavigate();
  const { data: channal, isChnnalLoading } = useQuery({
    queryKey: ["channal"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/channal/commenchannels");
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
  const { selectedChannal, selectChannal } = channalStore();

  if (isChnnalLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-screen md:w-60 w-full  bg-white text-black  border-r border-gray-200 flex flex-col transition-all duration-200 overflow-scroll">
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
              <Link to="/channal/all">all</Link>
              <Link to="/channal/my">my</Link>
              <Link to="/channal/joined">joined</Link>
              <Link to="/channal/unveristy">unveristy</Link>
              <Link to="/channal/create">create</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-b border-gray-200 w-full p-5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl text-blue-400">Bdu Channals</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {channal?.map((channal) => (
          <button
            key={channal._id}
            onClick={() => selectChannal(channal)}
            className={`
              w-full p-3 flex items-center gap-1 
              hover:bg-base-300 transition-colors
              ${
                selectedChannal?._id === channal._id
                  ? "bg-blue-300  text-white"
                  : ""
              }
            `}
          >
            <div className="relative mx-1.5">
              {channal.photo === "bduLogo.jpg" ? (
                <img
                  src="/bduLogo.jpg"
                  alt={channal.name}
                  className="size-10 object-cover rounded-full"
                />
              ) : (
                <img
                  src={channal.photo}
                  alt={channal.name}
                  className="size-10 object-cover rounded-full"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className=" block text-left min-w-0">
              <div className="font-light truncate text-xs">{channal.name}</div>
              <div className="font-light truncate text-xs text-gray-600">
                {channal.lastMessage?.text
                  ? `${channal.lastMessage.text.slice(0, 17)}...`
                  : channal.lastMessage?.photo?.length
                  ? "📷 Photo"
                  : channal.lastMessage?.video?.length
                  ? "🎥 Video"
                  : channal.lastMessage?.file?.length
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
