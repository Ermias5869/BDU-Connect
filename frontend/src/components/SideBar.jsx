import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  HiMiniHome,
  HiMiniChatBubbleBottomCenterText,
  HiMiniBell,
  HiMiniCog6Tooth,
  HiMiniUserCircle,
  HiMiniVideoCamera,
  HiMiniPlusCircle,
  HiMiniFolderOpen,
} from "react-icons/hi2";
import { MdGroups, MdArticle } from "react-icons/md";
import { AiOutlineAppstore } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";

export default function SideBar() {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const navLinks = [
    { path: "/", label: "Home", icon: <HiMiniHome /> },
    { path: "/post", label: "Post", icon: <MdArticle /> },
    { path: "/message", label: "Message", icon: <BiMessageSquareDetail /> },
    { path: "/notification", label: "Notification", icon: <HiMiniBell /> },
    { path: "/setting", label: "Setting", icon: <HiMiniCog6Tooth /> },
    {
      path: authUser ? `/profile/${authUser.studentId}` : "#",
      label: "MyProfile",
      icon: <HiMiniUserCircle />,
    },
    { path: "/video", label: "Video", icon: <HiMiniVideoCamera /> },
    {
      path: "/createShortVideo",
      label: "CreateVideo",
      icon: <HiMiniPlusCircle />,
    },
    {
      path: "/channal",
      label: "Channel",
      icon: <HiMiniChatBubbleBottomCenterText />,
    },
    { path: "/group", label: "Group", icon: <MdGroups /> },
    { path: "/service", label: "Service", icon: <AiOutlineAppstore /> },
  ];

  return (
    <div className="h-dvh p-4 bg-white w-full overflow-auto">
      <div className="flex flex-col items-center justify-center mb-6">
        <h1 className="text-2xl font-bold text-blue-500  text-center">
          BDU Connect
        </h1>
      </div>

      <div className="flex flex-col gap-2">
        {navLinks.map(({ path, label, icon }, index) => (
          <NavLink
            key={index}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 font-semibold rounded-md transition-all
              ${
                isActive
                  ? "text-blue-600 border-l-4 border-blue-300 bg-blue-50"
                  : "text-blue-500 hover:bg-blue-100"
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            <span className="text-md">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
