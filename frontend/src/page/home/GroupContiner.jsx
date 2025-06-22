import React from "react";
import { Outlet } from "react-router-dom";
import ContinarGroupSideBar from "../../components/ContinarGroupSideBar";

export default function GroupContiner() {
  return (
    <div className="flex ">
      <div className="hidden md:block h-dvh">
        <ContinarGroupSideBar />
      </div>
      <Outlet />
    </div>
  );
}
