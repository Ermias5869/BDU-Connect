import {
  FaLayerGroup,
  FaUsers,
  FaUserShield,

} from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { SquarePlus } from "lucide-react";

export default function ContinarGroupSideBar() {
  const navigate = useNavigate();
  const links = [
    {
      to: "all",
      label: "All ",
      icon: <FaLayerGroup className="text-1xl" />,
    },
    {
      to: "joined",
      label: "Joined",
      icon: <FaUsers className="text-1xl" />,
    },
    {
      to: "my",
      label: "My ",
      icon: <FaUserShield className="text-1xl" />,
    },

    {
      to: "create",
      label: "Create",
      icon: <SquarePlus className="text-1xl" />,
    },
  ];

  return (
    <div className=" rounded-lg bg-white shadow-md h-dvh ">
      <button onClick={() => navigate("/")}>
        <IoIosArrowRoundBack size={30} className="text-blue-400" />
      </button>
      <div className="flex flex-col gap-4 mt-5">
        {links.map(({ to, label, icon }, index) => (
          <Link
            key={index}
            to={to}
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-100 text-blue-500 transition-all duration-200"
          >
            {icon}
            <span className="text-base font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
