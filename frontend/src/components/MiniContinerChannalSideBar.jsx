import {
  FaLayerGroup,
  FaUsers,
  FaUserShield,
  FaComments,
} from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { SquarePlus } from "lucide-react";

export default function MiniContinarChannalSideBar() {
  const navigate = useNavigate();
  const links = [
    {
      to: "all",

      icon: <FaLayerGroup className="text-1xl" />,
    },
    {
      to: "joined",

      icon: <FaUsers />,
    },
    {
      to: "my",

      icon: <FaUserShield />,
    },
    {
      to: "unveristy",

      icon: <FaComments />,
    },
    {
      to: "create",

      icon: <SquarePlus />,
    },
  ];

  return (
    <div className="rounded-lg bg-white shadow-md h-screen ">
      <button onClick={() => navigate("/")}>
        <IoIosArrowRoundBack size={30} className="text-blue-400" />
      </button>
      <div className="flex  gap-4 mb-4">
        {links.map(({ to, icon }, index) => (
          <Link
            key={index}
            to={to}
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-100 text-blue-500 transition-all duration-200"
          >
            <span className="text-lg">{icon}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
