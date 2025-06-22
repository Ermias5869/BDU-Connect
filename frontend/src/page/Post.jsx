import { NavLink, Outlet } from "react-router-dom";
import CreatePost from "../components/CreatePost";

export default function Post() {
  return (
    <div>
      <CreatePost />
      <div className="mt-8 mb-4 flex items-center justify-around text-blue-500 font-semibold">
        <NavLink
          to="my-posts"
          className={({ isActive }) =>
            `px-4 py-2 transition-all ${
              isActive
                ? "border-b-2 border-blue-500 text-blue-500"
                : "hover:text-blue-600"
            }`
          }
        >
          My Post
        </NavLink>
        <NavLink
          to="following-posts"
          className={({ isActive }) =>
            `px-4 py-2 transition-all ${
              isActive
                ? "border-b-2 border-blue-500 text-blue-500"
                : "hover:text-blue-600"
            }`
          }
        >
          Following Post
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
