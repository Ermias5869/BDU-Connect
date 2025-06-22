import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Service() {
  return (
    <div>
      <h1 className="flex items-center justify-center text-3xl text-blue-400 mt-4">
        BahirDar university የምግብ ዝርዝር
      </h1>

      <div className="mt-6 text-2xl flex justify-around">
        <NavLink
          to="የጾም"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition ${
              isActive
                ? "border-b-2 border-blue-500 text-blue-500"
                : "hover:text-blue-600"
            }`
          }
        >
          የጾም ምግብችህ
        </NavLink>
        <NavLink
          to="የፍስግ"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition ${
              isActive
                ? "border-b-2 border-blue-500 text-blue-500"
                : "hover:text-blue-600"
            }`
          }
        >
          የፍስግ ምግብችህ
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}
