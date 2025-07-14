import CreateVideo from "../components/CreateVideo";
import { NavLink, Outlet } from "react-router-dom";

export default function Video() {
  return (
    <>
      <CreateVideo />

      <div className="mt-8 mb-6 flex items-center justify-center gap-6 text-blue-500 font-semibold">
        <NavLink
          to="my-videos"
          className={({ isActive }) =>
            `transition-all px-3 py-1 ${
              isActive
                ? "border-b-2 border-blue-500 text-blue-600"
                : "hover:text-blue-600"
            }`
          }
        >
          My Video
        </NavLink>

        <NavLink
          to="following-videos"
          className={({ isActive }) =>
            `transition-all px-3 py-1 ${
              isActive
                ? "border-b-2 border-blue-500 text-blue-600"
                : "hover:text-blue-600"
            }`
          }
        >
          Following Video
        </NavLink>
      </div>

      <Outlet />
    </>
  );
}
