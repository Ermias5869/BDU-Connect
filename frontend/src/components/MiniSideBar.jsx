import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import {
  HiMiniHome,
  HiMiniChatBubbleBottomCenterText,
  HiMiniBell,
  HiMiniCog6Tooth,
  HiMiniUserCircle,
  HiMiniVideoCamera,
  HiMiniPlusCircle,
} from "react-icons/hi2";
import { MdGroups, MdArticle } from "react-icons/md";
import { AiOutlineAppstore } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";

export default function MiniSideBar() {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const navLinks = [
    { path: "/", icon: <HiMiniHome /> },
    { path: "/post", icon: <MdArticle /> },
    { path: "/message", icon: <BiMessageSquareDetail /> },
    { path: "/notification", icon: <HiMiniBell /> },
    { path: "/setting", icon: <HiMiniCog6Tooth /> },
    {
      path: authUser ? `/profile/${authUser.studentId}` : "#",
      icon: <HiMiniUserCircle />,
    },
    { path: "/video", icon: <HiMiniVideoCamera /> },
    { path: "/createShortVideo", icon: <HiMiniPlusCircle /> },
    { path: "/channal", icon: <HiMiniChatBubbleBottomCenterText /> },
    { path: "/group", icon: <MdGroups /> },
    { path: "/service", icon: <AiOutlineAppstore /> },
  ];

  return (
    <div className="flex justify-between px-3 py-2">
      {navLinks.map(({ path, icon }, idx) => (
        <NavLink
          key={idx}
          to={path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-2 text-sm ${
              isActive
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-blue-400 hover:text-blue-500"
            }`
          }
        >
          <span className="text-xl">{icon}</span>
        </NavLink>
      ))}
    </div>
  );
}
