import React from "react";
import { Outlet } from "react-router-dom";
import ContinarChannalSideBar from "../../components/ContinarChannalSideBar";

export default function ChannalContiner() {
  return (
    <div className="flex ">
      <div className="hidden md:block h-dvh">
        <ContinarChannalSideBar />
      </div>

      <Outlet />
    </div>
  );
}
