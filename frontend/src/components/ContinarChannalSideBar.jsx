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
      icon: <FaLayerGroup className="text-xl" />,
    },
    {
      to: "joined",
      icon: <FaUsers className="text-xl" />,
    },
    {
      to: "my",
      icon: <FaUserShield className="text-xl" />,
    },
    {
      to: "unveristy",
      icon: <FaComments className="text-xl" />,
    },
    {
      to: "create",
      icon: <SquarePlus className="text-xl" />,
    },
  ];

  return (
    <div className="bg-white shadow-md h-screen overflow-y-auto px-3 py-4">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:bg-blue-100 p-2 rounded-md"
        >
          <IoIosArrowRoundBack size={28} />
        </button>
        <h2 className="text-blue-600 font-semibold text-lg">Channels</h2>
      </div>

      <div className="flex flex-col gap-3">
        {links.map(({ to, icon }, index) => (
          <Link
            key={index}
            to={to}
            className="flex items-center gap-3 px-4 py-2 rounded-md text-blue-600 font-medium hover:bg-blue-50 transition-all"
          >
            <span>{icon}</span>
            <span className="text-base capitalize">{to}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
